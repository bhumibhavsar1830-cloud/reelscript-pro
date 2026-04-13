require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple in-memory credits store (upgrade to DB later)
const userCredits = {};

function getCredits(userId) {
  if (!userCredits[userId]) userCredits[userId] = 5;
  return userCredits[userId];
}

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// GET credits
app.get("/api/credits/:userId", (req, res) => {
  res.json({ credits: getCredits(req.params.userId) });
});

// POST generate script - API key safe on server
app.post("/api/generate", async (req, res) => {
  const { userId, prompt, type } = req.body;
  if (!userId || !prompt) return res.status(400).json({ error: "Missing fields" });

  const credits = getCredits(userId);
  if (credits <= 0) return res.status(402).json({ error: "NO_CREDITS" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.content?.map((b) => b.text || "").join("") || "Error";

    // Deduct credit
    userCredits[userId] = credits - 1;

    res.json({ script: text, creditsLeft: userCredits[userId] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed: " + err.message });
  }
});

// Razorpay - create order
app.post("/api/create-order", async (req, res) => {
  const { plan } = req.body;
  const Razorpay = require("razorpay");
  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const PLANS = {
    starter: { amount: 4900, credits: 50 },
    pro: { amount: 9900, credits: 99999 },
  };
  const selected = PLANS[plan];
  if (!selected) return res.status(400).json({ error: "Invalid plan" });

  try {
    const order = await rzp.orders.create({
      amount: selected.amount,
      currency: "INR",
      notes: { plan },
    });
    res.json({ orderId: order.id, amount: selected.amount, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Razorpay - verify payment
app.post("/api/verify-payment", (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const CREDITS = { starter: 50, pro: 99999 };
  const add = CREDITS[plan] || 0;
  userCredits[userId] = (userCredits[userId] || 0) + add;

  res.json({ success: true, creditsLeft: userCredits[userId] });
});

// Fallback to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
