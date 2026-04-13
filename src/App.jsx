import { useState, useEffect } from "react";

const LANGUAGES = {
  Hindi: "hi", English: "en", Gujarati: "gu",
  Tamil: "ta", Marathi: "mr", Bengali: "bn",
  Punjabi: "pa", Telugu: "te",
};

const LANG_NAMES = {
  hi: "Hindi", en: "English", gu: "Gujarati",
  ta: "Tamil", mr: "Marathi", bn: "Bengali",
  pa: "Punjabi", te: "Telugu",
};

const UI_TEXT = {
  hi: { title: "रील स्क्रिप्ट जेनरेटर", subtitle: "1 मिनट में वायरल रील बनाएं ✨", placeholder: "अपना रील आइडिया लिखें...", generate: "स्क्रिप्ट बनाएं 🎬", generating: "बना रहे हैं...", viral: "Viral आइडियाज", jokes: "जोक्स", langLabel: "भाषा", outputLang: "स्क्रिप्ट भाषा", credits: "क्रेडिट बचे", upgrade: "अपग्रेड करें ✨" },
  en: { title: "Reel Script Generator", subtitle: "Create viral reels in 1 minute ✨", placeholder: "Write your reel idea...", generate: "Generate Script 🎬", generating: "Generating...", viral: "Viral Ideas", jokes: "Jokes", langLabel: "Language", outputLang: "Script Language", credits: "credits left", upgrade: "Upgrade ✨" },
  gu: { title: "રીલ સ્ક્રિપ્ટ જનરેટર", subtitle: "1 મિનિટમાં વાઇરલ રીલ ✨", placeholder: "તમારો રીલ આઇડિયા લખો...", generate: "સ્ક્રિપ્ટ બનાવો 🎬", generating: "બનાવી રહ્યા...", viral: "Viral આઇડિયા", jokes: "જોક્સ", langLabel: "ભાષા", outputLang: "સ્ક્રિપ્ટ ભાષા", credits: "ક્રેડિટ બાકી", upgrade: "અપગ્રેડ ✨" },
  ta: { title: "ரீல் ஸ்கிரிப்ட்", subtitle: "1 நிமிடத்தில் வைரல் ரீல் ✨", placeholder: "உங்கள் யோசனை...", generate: "உருவாக்கு 🎬", generating: "உருவாக்குகிறோம்...", viral: "Viral யோசனை", jokes: "நகைச்சுவை", langLabel: "மொழி", outputLang: "ஸ்கிரிப்ட் மொழி", credits: "கிரெடிட்", upgrade: "மேம்படுத்து ✨" },
  mr: { title: "रील स्क्रिप्ट जनरेटर", subtitle: "1 मिनिटात व्हायरल रील ✨", placeholder: "तुमची रील आयडिया लिहा...", generate: "स्क्रिप्ट बनवा 🎬", generating: "बनवत आहोत...", viral: "Viral आयडिया", jokes: "विनोद", langLabel: "भाषा", outputLang: "स्क्रिप्ट भाषा", credits: "क्रेडिट शिल्लक", upgrade: "अपग्रेड ✨" },
  bn: { title: "রিল স্ক্রিপ্ট জেনারেটর", subtitle: "১ মিনিটে ভাইরাল রিল ✨", placeholder: "আপনার রিল আইডিয়া লিখুন...", generate: "স্ক্রিপ্ট তৈরি করুন 🎬", generating: "তৈরি হচ্ছে...", viral: "Viral আইডিয়া", jokes: "জোকস", langLabel: "ভাষা", outputLang: "স্ক্রিপ্ট ভাষা", credits: "ক্রেডিট বাকি", upgrade: "আপগ্রেড ✨" },
  pa: { title: "ਰੀਲ ਸਕ੍ਰਿਪਟ ਜਨਰੇਟਰ", subtitle: "1 ਮਿੰਟ ਵਿੱਚ ਵਾਇਰਲ ਰੀਲ ✨", placeholder: "ਆਪਣਾ ਰੀਲ ਆਈਡੀਆ ਲਿਖੋ...", generate: "ਸਕ੍ਰਿਪਟ ਬਣਾਓ 🎬", generating: "ਬਣਾ ਰਹੇ ਹਾਂ...", viral: "Viral ਆਈਡੀਆ", jokes: "ਜੋਕਸ", langLabel: "ਭਾਸ਼ਾ", outputLang: "ਸਕ੍ਰਿਪਟ ਭਾਸ਼ਾ", credits: "ਕ੍ਰੈਡਿਟ ਬਚੇ", upgrade: "ਅੱਪਗ੍ਰੇਡ ✨" },
  te: { title: "రీల్ స్క్రిప్ట్ జనరేటర్", subtitle: "1 నిమిషంలో వైరల్ రీల్ ✨", placeholder: "మీ రీల్ ఆలోచన రాయండి...", generate: "స్క్రిప్ట్ రూపొందించు 🎬", generating: "రూపొందిస్తున్నాం...", viral: "Viral ఆలోచనలు", jokes: "జోకులు", langLabel: "భాష", outputLang: "స్క్రిప్ట్ భాష", credits: "క్రెడిట్లు మిగిలాయి", upgrade: "అప్‌గ్రేడ్ ✨" },
};

const VIRAL_IDEAS = {
  hi: ["एक बेवकूफ राजा की कहानी 👑", "दो दोस्तों का झगड़ा 😂", "मम्मी vs पापा 🏠", "पहला प्यार की कहानी 💕", "नौकरी का पहला दिन 😅", "परीक्षा की रात 📚"],
  en: ["A foolish king's story 👑", "Two friends arguing 😂", "Mom vs Dad at home 🏠", "First love story 💕", "First day at job 😅", "Exam night panic 📚"],
  gu: ["મૂર્ખ રાજાની વાર્તા 👑", "બે મિત્રોનો ઝઘડો 😂", "મમ્મી vs પપ્પા 🏠", "પ્રથમ પ્રેમ 💕", "નોકરીનો પ્રથમ દિવસ 😅", "પરીક્ષાની રાત 📚"],
  ta: ["முட்டாள் ராஜா 👑", "நண்பர்கள் சண்டை 😂", "அம்மா vs அப்பா 🏠", "முதல் காதல் 💕", "முதல் நாள் வேலை 😅", "தேர்வு இரவு 📚"],
  mr: ["मूर्ख राजा 👑", "दोन मित्र भांडण 😂", "आई vs बाबा 🏠", "पहिले प्रेम 💕", "नोकरीचा पहिला दिवस 😅", "परीक्षेची रात्र 📚"],
  bn: ["বোকা রাজা 👑", "দুই বন্ধু ঝগড়া 😂", "মা vs বাবা 🏠", "প্রথম প্রেম 💕", "কাজের প্রথম দিন 😅", "পরীক্ষার রাত 📚"],
  pa: ["ਮੂਰਖ ਰਾਜਾ 👑", "ਦੋ ਦੋਸਤਾਂ ਦਾ ਝਗੜਾ 😂", "ਮਾਂ vs ਪਾਪਾ 🏠", "ਪਹਿਲਾ ਪਿਆਰ 💕", "ਨੌਕਰੀ ਦਾ ਪਹਿਲਾ ਦਿਨ 😅", "ਪ੍ਰੀਖਿਆ ਦੀ ਰਾਤ 📚"],
  te: ["మూర్ఖ రాజు 👑", "ఇద్దరు మిత్రుల గొడవ 😂", "అమ్మ vs నాన్న 🏠", "మొదటి ప్రేమ 💕", "ఉద్యోగం మొదటి రోజు 😅", "పరీక్ష రాత్రి 📚"],
};

const JOKES = {
  hi: ["टीचर vs स्टूडेंट 😂", "सास-बहू ड्रामा 🎭", "दुकानदार की चालाकी 🤣", "पड़ोसी की नोकझोंक 😆", "परीक्षा का डर 📚", "शादी में बोर अंकल 😅"],
  en: ["Teacher vs Student 😂", "Mother-in-law drama 🎭", "Clever shopkeeper 🤣", "Neighbor argument 😆", "Exam fear 📚", "Bored uncle at wedding 😅"],
  gu: ["ટીચર vs સ્ટૂડન્ટ 😂", "સાસ-વહુ ડ્રામા 🎭", "દુકાનદારની ચાલાકી 🤣", "પડોશીની ઝઘડો 😆", "પરીક્ષાનો ડર 📚", "લગ્નમાં કાકા 😅"],
  ta: ["ஆசிரியர் vs மாணவர் 😂", "மாமியார் நாடகம் 🎭", "தந்திரமான கடைக்காரர் 🤣", "அண்டை வீட்டார் சண்டை 😆", "தேர்வு பயம் 📚", "திருமணத்தில் சித்தப்பா 😅"],
  mr: ["शिक्षक vs विद्यार्थी 😂", "सासू-सून ड्रामा 🎭", "दुकानदाराची चलाखी 🤣", "शेजाऱ्याची भांडणे 😆", "परीक्षेची भीती 📚", "लग्नात कंटाळलेले काका 😅"],
  bn: ["শিক্ষক vs ছাত্র 😂", "শাশুড়ি ড্রামা 🎭", "চালাক দোকানদার 🤣", "পড়শি ঝগড়া 😆", "পরীক্ষার ভয় 📚", "বিয়েতে বিরক্ত কাকা 😅"],
  pa: ["ਅਧਿਆਪਕ vs ਵਿਦਿਆਰਥੀ 😂", "ਸੱਸ-ਨੂੰਹ ਡਰਾਮਾ 🎭", "ਦੁਕਾਨਦਾਰ ਦੀ ਚਲਾਕੀ 🤣", "ਗੁਆਂਢੀ ਨਾਲ ਝਗੜਾ 😆", "ਪ੍ਰੀਖਿਆ ਦਾ ਡਰ 📚", "ਵਿਆਹ ਵਿੱਚ ਚਾਚਾ 😅"],
  te: ["టీచర్ vs స్టూడెంట్ 😂", "అత్తగారి నాటకం 🎭", "తెలివైన దుకాణదారుడు 🤣", "పొరుగువారి గొడవ 😆", "పరీక్ష భయం 📚", "పెళ్ళిలో బోర్ అవుతున్న మావయ్య 😅"],
};

// User ID - browser fingerprint
let USER_ID = localStorage.getItem("rsp_uid");
if (!USER_ID) {
  USER_ID = "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  localStorage.setItem("rsp_uid", USER_ID);
}

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [uiLang, setUiLang] = useState("hi");
  const [scriptLang, setScriptLang] = useState("hi");
  const [idea, setIdea] = useState("");
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [credits, setCredits] = useState(5);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [toast, setToast] = useState("");

  const t = UI_TEXT[uiLang] || UI_TEXT.hi;

  useEffect(() => {
    fetch(`${BACKEND}/api/credits/${USER_ID}`)
      .then((r) => r.json())
      .then((d) => setCredits(d.credits ?? 5))
      .catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const buildPrompt = (ideaText, type) => {
    const lang = LANG_NAMES[scriptLang] || "Hindi";
    if (type === "joke") {
      return `Write a super funny viral reel comedy skit in ${lang} about: "${ideaText}". Punchy dialogues, relatable humor. Under 45 seconds. Use emojis. Write ONLY in ${lang}.`;
    }
    return `Create a viral Instagram/YouTube Reels script in ${lang} for: "${ideaText}"

Format:
🎬 HOOK (first 3 seconds - attention grabbing)
📖 SCENE 1 - dialogue
📖 SCENE 2 - dialogue  
📖 SCENE 3 - dialogue
🔥 TWIST/CLIMAX - surprising punchline
📣 CTA - like/share/comment

Under 60 seconds when spoken. Funny, relatable, viral. Use emojis. Write ONLY in ${lang}.`;
  };

  const generateAll = async (ideaText, type = "script") => {
    if (!ideaText.trim() || loading) return;
    if (credits <= 0) { setShowUpgrade(true); return; }

    setLoading(true);
    setScripts([]);
    setActiveTab("write");

    // Show 5 loading placeholders
    setScripts(Array(5).fill({ loading: true, text: "" }));

    // Generate 5 in parallel
    const tasks = Array.from({ length: 5 }, (_, i) =>
      fetch(`${BACKEND}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          prompt: buildPrompt(ideaText, type) + `\n\n[Variation ${i + 1} - make it unique]`,
          type,
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.error === "NO_CREDITS") { setShowUpgrade(true); return null; }
          if (i === 0 && d.creditsLeft !== undefined) setCredits(d.creditsLeft);
          return d.script || d.error || "Error generating";
        })
        .catch(() => "⚠️ Network error. Try again.")
    );

    const results = await Promise.all(tasks);
    setScripts(results.filter(Boolean).map((text) => ({ loading: false, text })));
    setLoading(false);
  };

  const copyScript = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast("✅ Script copied!");
  };

  const handlePayment = async () => {
    try {
      const orderRes = await fetch(`${BACKEND}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const order = await orderRes.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "ReelScript Pro",
        description: selectedPlan === "pro" ? "Pro Plan — Unlimited" : "Starter — 50 Credits",
        order_id: order.orderId,
        handler: async (response) => {
          const verifyRes = await fetch(`${BACKEND}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, userId: USER_ID, plan: selectedPlan }),
          });
          const v = await verifyRes.json();
          if (v.success) {
            setCredits(v.creditsLeft);
            setShowUpgrade(false);
            showToast("🎉 Payment successful! Credits added.");
          }
        },
        theme: { color: "#f72585" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      showToast("❌ " + e.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", fontFamily: "'Poppins','Noto Sans Devanagari',sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Sans+Tamil:wght@400;500&family=Noto+Sans+Telugu:wght@400;500&family=Noto+Sans+Gujarati:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .pill{background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);color:#ccc;padding:5px 13px;border-radius:20px;cursor:pointer;font-size:12px;font-family:inherit;transition:all .2s}
        .pill:hover{background:rgba(255,255,255,0.15);color:#fff}
        .pill.on{background:linear-gradient(90deg,#f72585,#7209b7);border-color:transparent;color:#fff;font-weight:600}
        .tab{flex:1;padding:10px;border:none;background:transparent;color:#777;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit;transition:all .2s}
        .tab.on{color:#f72585;border-bottom-color:#f72585;font-weight:700}
        .chip{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ddd;padding:11px 14px;border-radius:12px;cursor:pointer;font-size:13px;font-family:inherit;text-align:left;width:100%;transition:all .2s;margin-bottom:8px}
        .chip:hover:not(:disabled){background:rgba(247,37,133,0.2);border-color:#f72585;color:#fff;transform:translateX(4px)}
        .chip:disabled{opacity:.4;cursor:not-allowed}
        .genbtn{width:100%;padding:14px;background:linear-gradient(90deg,#f72585,#7209b7);border:none;color:#fff;font-size:15px;font-weight:700;border-radius:14px;cursor:pointer;font-family:inherit;transition:all .2s}
        .genbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(247,37,133,.4)}
        .genbtn:disabled{opacity:.5;cursor:not-allowed}
        .actbtn{padding:6px 14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#ccc;border-radius:8px;cursor:pointer;font-size:12px;font-family:inherit;transition:all .2s}
        .actbtn:hover{background:rgba(255,255,255,0.15);color:#fff}
        .actbtn.copied{border-color:#10b981;color:#10b981}
        textarea{width:100%;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.15);color:#fff;padding:14px;border-radius:14px;font-size:15px;resize:none;font-family:inherit;outline:none;transition:border .2s}
        textarea:focus{border-color:#f72585}
        textarea::placeholder{color:#555}
        .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fade .4s ease}
        @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .plan-card{border:2px solid rgba(255,255,255,.15);border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;text-align:center;background:rgba(255,255,255,.05)}
        .plan-card:hover{border-color:#f72585}
        .plan-card.on{border-color:#f72585;background:rgba(247,37,133,.1)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#f72585;border-radius:4px}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(20px)", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.08)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, background: "linear-gradient(90deg,#f72585,#b5179e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎬 ReelScript Pro</div>
            <div style={{ fontSize: 11, color: "#777" }}>{t.subtitle}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div
              onClick={() => setShowUpgrade(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 20, cursor: "pointer", fontSize: 13 }}
            >
              <span style={{ fontSize: 14 }}>💰</span>
              <span style={{ color: credits <= 1 ? "#ef4444" : "#fff", fontWeight: 700 }}>{credits}</span>
              <span style={{ color: "#666", fontSize: 11 }}>{t.credits}</span>
            </div>
            <button className="pill on" onClick={() => setShowUpgrade(true)} style={{ fontSize: 12 }}>{t.upgrade}</button>
          </div>
        </div>
      </div>

      {/* WARN STRIP */}
      {credits <= 2 && credits > 0 && (
        <div style={{ background: "rgba(251,191,36,.1)", borderBottom: "1px solid rgba(251,191,36,.2)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#fbbf24" }}>⚠️ Sirf {credits} credit bachi!</span>
          <button className="pill on" onClick={() => setShowUpgrade(true)} style={{ fontSize: 12 }}>Upgrade now →</button>
        </div>
      )}

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 14px" }}>

        {/* UI LANG */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 7 }}>{t.langLabel}:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(LANGUAGES).map(([name, code]) => (
              <button key={code} className={`pill ${uiLang === code ? "on" : ""}`} onClick={() => setUiLang(code)}>{name}</button>
            ))}
          </div>
        </div>

        {/* SCRIPT LANG */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 7 }}>{t.outputLang}:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(LANGUAGES).map(([name, code]) => (
              <button key={code} className={`pill ${scriptLang === code ? "on" : ""}`} onClick={() => setScriptLang(code)}>{name}</button>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 18, background: "rgba(255,255,255,.03)", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
          {["write", "viral", "jokes"].map((tab) => (
            <button key={tab} className={`tab ${activeTab === tab ? "on" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "write" ? "✍️ Write" : tab === "viral" ? `🔥 ${t.viral}` : `😂 ${t.jokes}`}
            </button>
          ))}
        </div>

        {/* WRITE TAB */}
        {activeTab === "write" && (
          <div className="fade">
            <textarea rows={4} placeholder={t.placeholder} value={idea} onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && generateAll(idea)} />
            <div style={{ fontSize: 11, color: "#444", textAlign: "right", margin: "4px 0 12px" }}>Ctrl+Enter</div>
            <button className="genbtn" onClick={() => generateAll(idea)} disabled={loading || !idea.trim()}>
              {loading ? <><span className="spin" />Generating 5 scripts...</> : `${t.generate} (5 variations)`}
            </button>
          </div>
        )}

        {/* VIRAL TAB */}
        {activeTab === "viral" && (
          <div className="fade">
            {(VIRAL_IDEAS[scriptLang] || VIRAL_IDEAS.hi).map((v, i) => (
              <button key={i} className="chip" disabled={loading} onClick={() => { setIdea(v); generateAll(v); }}>
                {v}
              </button>
            ))}
          </div>
        )}

        {/* JOKES TAB */}
        {activeTab === "jokes" && (
          <div className="fade">
            {(JOKES[scriptLang] || JOKES.hi).map((j, i) => (
              <button key={i} className="chip" disabled={loading} onClick={() => generateAll(j, "joke")}>
                {j}
              </button>
            ))}
          </div>
        )}

        {/* SCRIPTS OUTPUT */}
        {scripts.length > 0 && (
          <div style={{ marginTop: 24 }} className="fade">
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f72585", marginBottom: 14 }}>
              {loading ? "⏳ Generating..." : `✅ ${scripts.length} Scripts Ready — Best wala use karo!`}
            </div>
            {scripts.map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(247,37,133,.2)", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,.2)" }}>
                  <span style={{ fontSize: 12, color: "#888", background: "rgba(255,255,255,.08)", padding: "2px 10px", borderRadius: 20 }}>Version {i + 1} / 5</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!s.loading && (
                      <>
                        <CopyBtn text={s.text} onCopy={() => showToast("✅ Copied!")} />
                        <button className="actbtn" onClick={() => generateAll(idea || scripts[0]?.text?.slice(0, 30), "script")}>🔄 Redo</button>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ padding: 14, fontSize: 14, lineHeight: 1.8, color: s.loading ? "#555" : "#e0e0e0", whiteSpace: "pre-wrap", minHeight: 60 }}>
                  {s.loading ? <><span className="spin" />Generating variation {i + 1}...</> : s.text}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center", color: "#333", fontSize: 12 }}>Made with ❤️ · Powered by Claude AI</div>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && setShowUpgrade(false)}>
          <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,.15)", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🚀</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Unlimited Scripts!</h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>Har mahine 100s of viral scripts banao. Razorpay se secure payment.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { key: "starter", name: "Starter", price: "₹49", sub: "/month", feature: "50 credits" },
                { key: "pro", name: "Pro", price: "₹99", sub: "/month", feature: "Unlimited ✨", badge: "Popular" },
              ].map((p) => (
                <div key={p.key} className={`plan-card ${selectedPlan === p.key ? "on" : ""}`} onClick={() => setSelectedPlan(p.key)}>
                  {p.badge && <div style={{ fontSize: 10, background: "linear-gradient(90deg,#f72585,#7209b7)", color: "#fff", padding: "2px 8px", borderRadius: 20, display: "inline-block", marginBottom: 6, fontWeight: 700 }}>{p.badge}</div>}
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f72585" }}>{p.price}<span style={{ fontSize: 12, color: "#666", fontWeight: 400 }}>{p.sub}</span></div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{p.feature}</div>
                </div>
              ))}
            </div>
            <button className="genbtn" onClick={handlePayment}>💳 Razorpay se Pay karo</button>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setShowUpgrade(false)} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Baad mein</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1f2937", color: "#fff", padding: "10px 20px", borderRadius: 20, fontSize: 13, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function CopyBtn({ text, onCopy }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`actbtn ${copied ? "copied" : ""}`} onClick={handle}>
      {copied ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}
