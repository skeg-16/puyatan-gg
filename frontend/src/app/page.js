"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import * as htmlToImage from 'html-to-image';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
const badWords = ["bobo","tanga","gago","puta","amputa","shit","fuck","inamo","nudes","kantot","jakol","titi","puke"];
const THEME_STORAGE_KEY = "puyatan-theme";

// 1. EXPANDED UNIVERSITIES (Dropdown Data)
const universities = [
  { id: "NONE",  name: "Tambay Lang / Iba",               color: "#6B7280" },
  { id: "ADMU",  name: "Ateneo de Manila University",     color: "#3B82F6" },
  { id: "AdU",   name: "Adamson University",              color: "#0369A1" },
  { id: "AU",    name: "Arellano University",             color: "#3B82F6" },
  { id: "BSU",   name: "Batangas State University",       color: "#EF4444" },
  { id: "BULSU", name: "Bulacan State University",        color: "#F59E0B" },
  { id: "CAVSU", name: "Cavite State University",         color: "#22C55E" },
  { id: "CEU",   name: "Centro Escolar University",       color: "#EC4899" },
  { id: "CSB",   name: "De La Salle-College of Saint Benilde", color: "#22C55E" },
  { id: "DLSU",  name: "De La Salle University",          color: "#22C55E" },
  { id: "EARIST",name: "Eulogio 'Amang' Rodriguez IST",   color: "#EF4444" },
  { id: "FEU",   name: "Far Eastern University",          color: "#14B8A6" },
  { id: "HAU",   name: "Holy Angel University",           color: "#B91C1C" },
  { id: "JRU",   name: "Jose Rizal University",           color: "#1D4ED8" },
  { id: "LPU",   name: "Lyceum of the Philippines",       color: "#DC2626" },
  { id: "MAPUA", name: "Mapúa University",                color: "#B91C1C" },
  { id: "MMSU",  name: "Mariano Marcos State Univ",       color: "#16A34A" },
  { id: "MSU",   name: "Mindanao State University",       color: "#8B5CF6" },
  { id: "NEUST", name: "Nueva Ecija UST",                 color: "#F59E0B" },
  { id: "NU",    name: "National University",             color: "#3B82F6" },
  { id: "PLM",   name: "Pamantasan ng Lungsod ng Maynila",color: "#EF4444" },
  { id: "PNU",   name: "Philippine Normal University",    color: "#22C55E" },
  { id: "PUP",   name: "Polytechnic University of the PH",color: "#8B5CF6" },
  { id: "RTU",   name: "Rizal Technological University",  color: "#3B82F6" },
  { id: "SBU",   name: "San Beda University",             color: "#DC2626" },
  { id: "SLU",   name: "Saint Louis University",          color: "#0369A1" },
  { id: "TIP",   name: "Technological Institute of the PH",color: "#F59E0B" },
  { id: "TSU",   name: "Tarlac State University",         color: "#B91C1C" },
  { id: "TUP",   name: "Technological University of the PH",color: "#EF4444" },
  { id: "UA&P",  name: "Univ. of Asia and the Pacific",   color: "#0369A1" },
  { id: "UC",    name: "University of Cebu",              color: "#3B82F6" },
  { id: "UE",    name: "University of the East",          color: "#EF4444" },
  { id: "UM",    name: "University of Mindanao",          color: "#DC2626" },
  { id: "UP",    name: "University of the Philippines",   color: "#F97316" },
  { id: "USC",   name: "University of San Carlos",        color: "#16A34A" },
  { id: "USJR",  name: "Univ. of San Jose-Recoletos",     color: "#F59E0B" },
  { id: "UST",   name: "University of Santo Tomas",       color: "#EAB308" },
  { id: "XU",    name: "Xavier University - Ateneo de CDO",color: "#3B82F6" },
];

const vibes = [
  { id: "🎧 Chill Lang",    emoji: "🎧", label: "Chill"   },
  { id: "🥀 Sabaw Na",      emoji: "🥀", label: "Sabaw"   },
  { id: "🧠 Deep Talks",    emoji: "🧠", label: "Deep"    },
  { id: "💔 Brokenhearted", emoji: "💔", label: "Broken"  },
  { id: "🎮 Gamer Mode",    emoji: "🎮", label: "Gamer"   },
];

const tagGroups = [
  { cat: "Gaming",  dk: "#4ADE80", lt: "#16A34A", tags: ["#Valorant","#MLBB","#Genshin","#Roblox"] },
  { cat: "Acads",   dk: "#60A5FA", lt: "#1D4ED8", tags: ["#Thesis","#Coding","#Cramming","#Homework"] },
  { cat: "Chika",   dk: "#F472B6", lt: "#BE185D", tags: ["#Ghosting","#LifeAdvice","#Relationships","#Rant"] },
  { cat: "Hobbies", dk: "#FBBF24", lt: "#D97706", tags: ["#KPop","#Anime","#Music","#Gym"] },
];

const icebreakers = [
  "Anong mas malala: code na walang error pero di gumagana, o kakampi na AFK?",
  "Ano yung huling kinain mo ngayong madaling araw?",
  "Red flag ba kapag mabilis mag-reply?",
  "Kung may 1M pesos ka bukas, ano unang bibilhin mo?",
  "Kwento mo yung pinaka-sabaw moment mo today.",
];

/* ── ADBANNER COMPONENT (ADSTERRA) ── */
const AdBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Check natin kung wala pang laman yung div para hindi mag-doble-doble ang ads
    if (bannerRef.current && !bannerRef.current.hasChildNodes()) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `atOptions = {
        'key' : 'b0ac9338a38cb7f265d44e19d30617da',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };`;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/b0ac9338a38cb7f265d44e19d30617da/invoke.js';
      
      bannerRef.current.appendChild(conf);
      bannerRef.current.appendChild(script);
    }
  }, []);

  return <div ref={bannerRef} style={{ width: "728px", height: "90px" }} />;
};

/* ─────────────────────────────────────────────────────────── */
export default function Home() {
  const [theme,       setTheme]       = useState("dark");
  const [status,      setStatus]      = useState("landing");
  const [connectionState, setConnectionState] = useState("connecting");
  const [serverNotice, setServerNotice] = useState("");
  const [nickname,    setNickname]    = useState("");
  const [nickError,   setNickError]   = useState("");
  const [selectedUniv,setSelectedUniv]= useState("NONE");
  const [selectedMood,setSelectedMood]= useState(vibes[0].id);
  const [selectedTags,setSelectedTags]= useState([]);
  const [customTag,   setCustomTag]   = useState(""); 
  const [agreed,      setAgreed]      = useState(false);
  const [room,        setRoom]        = useState(null);
  const [strangerInfo,setStrangerInfo]= useState(null);
  const [message,     setMessage]     = useState("");
  const [chatBox,     setChatBox]     = useState([]);
  const [isTyping,    setIsTyping]    = useState(false);
  const [strangerAfk, setStrangerAfk] = useState(false);
  const [floatingEmojis,setFloatingEmojis]= useState([]);
  const [isSpoilerMode, setIsSpoilerMode] = useState(false);
  const [messageCount,  setMessageCount]  = useState(0);

  // ... (tuloy-tuloy na yung ibang variables at logic mo sa baba)

  const chatEndRef       = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sponsorTimeoutRef = useRef(null);

  const isDark = theme === "dark";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  /* ── window blur / focus AFK ── */
  useEffect(() => {
    const onBlur  = () => { if (room) socket.emit("set_afk", true);  };
    const onFocus = () => { if (room) socket.emit("set_afk", false); };
    window.addEventListener("blur",  onBlur);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("blur", onBlur); window.removeEventListener("focus", onFocus); };
  }, [room]);

 /* ── SPONSORED MESSAGE TRIGGER (DITO MO ILALAGAY) ── */
/* ── SPONSORED MESSAGE TRIGGER ── */
  useEffect(() => {
    // Lalabas ang ad kapag 5, 20, at 50 na ang total messages sa room
    if (messageCount === 5 || messageCount === 20 || messageCount === 50) {
      const adTexts = [
        { text: "Lumalabo na ba paningin mo? Pampagising na kape here! ☕", link: "https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e" },
        { text: "Nagdo-double click na ba mouse mo kaka-rank up? Upgrade na! 🖱️", link: "https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e" },
        { text: "Pagod na likod mo kakaupo. Baka bet mo ng ergonomic chair. 💺", link: "https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e" }
      ];
      const randomAd = adTexts[Math.floor(Math.random() * adTexts.length)];
      
      // Delay ng 1.5 seconds bago lumabas para natural ang pasok
      clearTimeout(sponsorTimeoutRef.current);
      sponsorTimeoutRef.current = setTimeout(() => {
        setChatBox(p => [...p, { text: randomAd.text, link: randomAd.link, type: "sponsor" }]);
      }, 1500);
    }
    return () => clearTimeout(sponsorTimeoutRef.current);
  }, [messageCount]);


  /* ── auto-scroll ── */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatBox]);

  /* ── socket events ── */
  useEffect(() => {
    const onConnect = () => {
      setConnectionState("connected");
      setServerNotice("");
    };
    const onDisconnect = (reason) => {
      setConnectionState("disconnected");
      if (reason !== "io client disconnect") {
        setServerNotice("Connection interrupted. Trying to recover...");
      }
    };
    const onConnectError = () => {
      setConnectionState("error");
      setServerNotice("Hindi ma-reach ang chat server ngayon.");
    };
    const onAppError = (payload) => {
      const message = payload?.message || "May error sa server.";
      setNickError(message);
      setServerNotice(message);
    };
    const onReportSubmitted = () => setServerNotice("Report submitted. Salamat sa pag-ingat sa community.");
    const onQueueLeft = () => setServerNotice("");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("app_error", onAppError);
    socket.on("report_submitted", onReportSubmitted);
    socket.on("queue_left", onQueueLeft);
    socket.on("waiting_for_match",   () => setStatus("searching"));
    socket.on("match_found",         (d) => {
      setStatus("connected"); setRoom(d.room); setStrangerAfk(false); setMessageCount(0); setServerNotice("");
      setChatBox([{ text: "Nakahanap ka na ng ka-puyatan. Wag torpe, mag-hi ka na!", type: "system" }]);
    });
    socket.on("stranger_info",       (i)  => setStrangerInfo(i));
    socket.on("receive_message",     (d)  => {
      setIsTyping(false); setStrangerAfk(false); setMessageCount(p => p + 1);
      setChatBox(p => [...p, { text: d.message, type: "stranger", isSpoiler: d.isSpoiler }]);
    });
    socket.on("stranger_typing",     ()   => {
      setIsTyping(true); clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    });
    socket.on("stranger_afk",        (v)  => setStrangerAfk(v));
    socket.on("receive_reaction",    (d)  => triggerFloatingEmoji(d.emoji));
    socket.on("stranger_disconnected",()  => { setIsTyping(false); setStrangerAfk(false); setStatus("rating"); setRoom(null); });
    
    return () => {
      ["connect","disconnect","connect_error","app_error","report_submitted","queue_left",
       "waiting_for_match","match_found","stranger_info","receive_message",
       "stranger_typing","stranger_afk","receive_reaction","stranger_disconnected"]
        .forEach(e => socket.off(e));
    };
  }, []);
  const triggerFloatingEmoji = (emoji) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis(p => [...p, { id, emoji }]);
    setTimeout(() => setFloatingEmojis(p => p.filter(e => e.id !== id)), 2200);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else if (selectedTags.length < 3) setSelectedTags([...selectedTags, tag]);
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    let newTag = customTag.trim();
    if (!newTag.startsWith("#")) newTag = "#" + newTag; 
    
    if (selectedTags.includes(newTag)) { setCustomTag(""); return; }
    if (selectedTags.length < 3) { setSelectedTags([...selectedTags, newTag]); }
    setCustomTag("");
  };

const handleStart = () => {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) return setNickError("Walang backend URL sa env mo.");
    if (connectionState === "error") return setNickError("Hindi ma-reach ang chat server ngayon.");
    if (!nickname.trim()) return setNickError("Lagyan mo naman ng pangalan idol.");
    if (badWords.some(w => nickname.toLowerCase().includes(w))) return setNickError("Bawal ang bastos na pangalan dito. Iba na lang.");
    if (!agreed) return setNickError("I-check mo muna yung terms sa baba.");
    
    setNickError(""); 
    setServerNotice("");
    setChatBox([]);
    setStatus("searching"); // ETO YUNG NAWAWALA KANINA!
    socket.emit("find_match", { nickname, univ: selectedUniv, mood: selectedMood, tags: selectedTags });
  };
  
  const skipChat = () => {
    socket.disconnect();
    socket.connect();
    setStatus("rating");
    setRoom(null);
  };

  const exitToMenu = () => {
    if (status === "searching") socket.emit("leave_queue");
    if (status === "connected") {
      socket.disconnect();
      socket.connect();
    }
    setStatus("landing"); 
    setRoom(null); 
    setStrangerInfo(null); 
    setChatBox([]);
    setServerNotice("");
  };

  const submitRating = (rating) => {
    socket.emit("submit_rating", { rating });
    setStatus("searching"); setChatBox([]); setRoom(null); setStrangerInfo(null);
    setTimeout(() => socket.emit("find_match", { nickname, univ: selectedUniv, mood: selectedMood, tags: selectedTags }), 500);
  };

  const sendMessage = () => {
    if (message.trim() && room) {
      const cleanMessage = message.trim().slice(0, 300);
      setChatBox(p => [...p, { text: cleanMessage, type: "me", isSpoiler: isSpoilerMode }]);
      socket.emit("send_message", { message: cleanMessage, room, isSpoiler: isSpoilerMode });
      setMessage(""); setMessageCount(p => p + 1); setIsSpoilerMode(false);
    }
  };

  const handleTyping = (e) => { setMessage(e.target.value); if (room) socket.emit("typing", { room }); };
  const sendIcebreaker = () => setMessage(icebreakers[Math.floor(Math.random() * icebreakers.length)]);

  const reportUser = () => {
    if (!room) return;
    socket.emit("report_user", { room, reason: "Reported from chat UI." });
    setServerNotice("Naka-submit na ang report.");
    setStatus("rating");
    setRoom(null);
  };

  const exportChat = async () => {
    if (!chatContainerRef.current) return;
    try {
      const url = await htmlToImage.toPng(chatContainerRef.current, { backgroundColor: isDark ? "#030008" : "#E0F2FE", pixelRatio: 2 });
      const a = document.createElement("a"); a.download = `PuyatanGG-${Date.now()}.png`; a.href = url; a.click();
    } catch (e) { console.error(e); }
  };

  const getYapperTier = () => {
    if (messageCount < 10) return { label: "🥉 Bronze",  c: "#FB923C" };
    if (messageCount < 30) return { label: "🥈 Silver",  c: "#94A3B8" };
    if (messageCount < 50) return { label: "🥇 Gold",    c: "#FBBF24" };
    return                         { label: "💎 Mythic",  c: "#22D3EE" };
  };

  const activeUniv = universities.find(u => u.id === (strangerInfo?.univ || "NONE"));
  const tier = getYapperTier();

  /* ── Design tokens ── */
  const D = {
    pageBg:    isDark ? "#030008"                     : "#DCF0F8",
    blob1:     isDark ? "#6D28D9"                     : "#0EA5E9",
    blob2:     isDark ? "#9D174D"                     : "#14B8A6",
    blob3:     isDark ? "#0E7490"                     : "#6366F1",
    cardBg:    isDark ? "rgba(255,255,255,0.04)"      : "rgba(255,255,255,0.55)",
    cardBdr:   isDark ? "rgba(255,255,255,0.09)"      : "rgba(255,255,255,0.75)",
    cardShadow:isDark ? "0 0 0 1px rgba(109,40,217,0.12), 0 32px 80px rgba(3,0,8,0.9), inset 0 1px 0 rgba(255,255,255,0.07)"
                      : "0 32px 80px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
    panelBg:   isDark ? "rgba(255,255,255,0.04)"      : "rgba(255,255,255,0.65)",
    panelBdr:  isDark ? "rgba(255,255,255,0.08)"      : "rgba(255,255,255,0.8)",
    panelShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.07)" : "inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 12px rgba(14,165,233,0.06)",
    inputBg:   isDark ? "rgba(255,255,255,0.06)"      : "rgba(255,255,255,0.85)",
    inputBdr:  isDark ? "rgba(255,255,255,0.1)"       : "rgba(14,165,233,0.2)",
    inputClr:  isDark ? "#EDE9FE"                     : "#0C4A6E",
    inputPh:   isDark ? "rgba(196,181,253,0.3)"       : "rgba(12,74,110,0.3)",
    textPri:   isDark ? "#EDE9FE"                     : "#0C4A6E",
    textMut:   isDark ? "rgba(196,181,253,0.45)"      : "rgba(12,74,110,0.45)",
    accent:    isDark ? "#A78BFA"                     : "#0284C7",
    accentGrad:isDark ? "linear-gradient(135deg,#7C3AED 0%,#BE185D 60%,#0891B2 100%)"
                      : "linear-gradient(135deg,#0284C7 0%,#0D9488 100%)",
    btnShadow: isDark ? "0 0 40px rgba(124,58,237,0.45), 0 10px 30px rgba(3,0,8,0.5)"
                      : "0 0 30px rgba(2,132,199,0.25), 0 10px 30px rgba(14,165,233,0.15)",
    bubbleMe:  isDark ? "linear-gradient(135deg,#7C3AED,#BE185D)"   : "linear-gradient(135deg,#0284C7,#0D9488)",
    bubbleThem:isDark ? "rgba(255,255,255,0.08)"      : "rgba(255,255,255,0.85)",
    bubbleThemBdr: isDark ? "rgba(255,255,255,0.1)"   : "rgba(14,165,233,0.15)",
    hdrBg:     isDark ? "rgba(0,0,0,0.35)"            : "rgba(255,255,255,0.55)",
    hdrBdr:    isDark ? "rgba(255,255,255,0.07)"       : "rgba(14,165,233,0.12)",
    sidebarBg: isDark ? "rgba(255,255,255,0.02)"      : "rgba(255,255,255,0.3)",
    sidebarBdr:isDark ? "rgba(255,255,255,0.06)"      : "rgba(14,165,233,0.12)",
    iconBtnBg: isDark ? "rgba(255,255,255,0.06)"      : "rgba(255,255,255,0.75)",
    iconBtnBdr:isDark ? "rgba(255,255,255,0.1)"       : "rgba(14,165,233,0.2)",
    iconBtnClr:isDark ? "#C4B5FD"                     : "#0284C7",
    watermark1:isDark ? "rgba(109,40,217,0.07)"       : "rgba(2,132,199,0.05)",
    watermark2:isDark ? "rgba(157,23,77,0.07)"        : "rgba(13,148,136,0.05)",
    watermark3:isDark ? "rgba(14,116,144,0.07)"       : "rgba(99,102,241,0.05)",
    logoGrad:  isDark ? "linear-gradient(90deg,#C4B5FD 0%,#F9A8D4 50%,#67E8F9 100%)"
                      : "linear-gradient(90deg,#0284C7 0%,#0891B2 50%,#0D9488 100%)",
    labelClr:  isDark ? "rgba(196,181,253,0.5)" : "rgba(12,74,110,0.45)",
  };

  const panel = (wm) => ({
    position: "relative", padding: "16px", borderRadius: "18px", overflow: "hidden",
    background: D.panelBg, border: `1px solid ${D.panelBdr}`, boxShadow: D.panelShadow,
    transition: "box-shadow 0.2s",
    _wm: wm,
  });

  const lbl = { fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: D.labelClr, display: "block", marginBottom: "10px" };
  const iconBtn = { background: D.iconBtnBg, border: `1px solid ${D.iconBtnBdr}`, color: D.iconBtnClr, borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" };

return (
    <div
      style={{ height: "100dvh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px", position: "relative", overflow: "hidden", background: D.pageBg, fontFamily: "'Figtree', sans-serif", transition: "background 0.6s", boxSizing: "border-box" }}
    >
      {/* ── AURORA BACKGROUND BLOBS ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div className="aurora-blob b1" style={{ background: D.blob1 }} />
        <div className="aurora-blob b2" style={{ background: D.blob2 }} />
        <div className="aurora-blob b3" style={{ background: D.blob3 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* ── THEME PILL TOGGLE ── */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        style={{ position: "fixed", top: "16px", right: "16px", zIndex: 60, display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "999px", background: D.iconBtnBg, border: `1px solid ${D.iconBtnBdr}`, color: D.accent, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", transition: "all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isDark ? "🌤" : "🌙"} {isDark ? "LIGHT" : "DARK"}
      </button>

      {/* ── FLOATING EMOJIS ── */}
      {floatingEmojis.map(e => (
        <div key={e.id} style={{ position: "fixed", bottom: "130px", right: "60px", fontSize: "3rem", pointerEvents: "none", zIndex: 50, animation: "floatUp 2.2s ease-out forwards" }}>{e.emoji}</div>
      ))}

      {/* ── TOP AD BANNER (Google AdSense Placeholder) ── */}
      <div style={{ width: "100%", maxWidth: "920px", height: "90px", marginBottom: "10px", borderRadius: "14px", border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.25)"}`, display: "none", alignItems: "center", justifyContent: "center", zIndex: 10, fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: D.textMut, background: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)" }} className="banner-ad">
        [ Google AdSense Space - 728x90 ]
      </div>

      {serverNotice && status !== "landing" && (
        <div style={{ width: "100%", maxWidth: "920px", marginBottom: "10px", padding: "10px 14px", borderRadius: "14px", border: `1px solid ${isDark ? "rgba(244,114,182,0.22)" : "rgba(2,132,199,0.18)"}`, background: isDark ? "rgba(244,114,182,0.08)" : "rgba(2,132,199,0.08)", color: isDark ? "#FBCFE8" : "#075985", fontSize: "11px", fontWeight: 700, zIndex: 10 }}>
          {serverNotice}
        </div>
      )}

      <div
        style={{ width: "100%", maxWidth: "920px", borderRadius: "28px",
        background: D.cardBg, backdropFilter: "blur(28px)", WebkitBackdropFilter:
        "blur(28px)", border: `1px solid ${D.cardBdr}`, boxShadow: D.cardShadow, display:
        "flex", flexDirection: "row", flex: 1, minHeight: 0, maxHeight: "760px", zIndex: 10, overflow:
        "hidden", transition: "all 0.6s" }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* ── STATE: LANDING ── */}
        {status === "landing" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: "12px", minHeight: 0 }}
          className="chat-scroll">

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                 <h1
                            style={{
                              margin: 0,
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: "clamp(2.15rem, 4.8vw, 3.35rem)",
                              letterSpacing: "0.1em",
                              lineHeight: 0.96,
                              backgroundImage: D.logoGrad, /* Pinalitan natin ng backgroundImage */
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                              textShadow: isDark ? "0 0 24px rgba(167,139,250,0.18)" : "0 0 18px rgba(2,132,199,0.12)",
                            }}
                          >
                            PUYATAN.GG
                          </h1>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "999px", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", background: isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)", border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "rgba(22,163,74,0.25)"}`, color: isDark ? "#4ADE80" : "#16A34A" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: isDark ? "#4ADE80" : "#16A34A", animation: "pulse 1.4s infinite" }} /> LIVE
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: D.textMut }}>
                    Puyatan pa more, find a puyatan buddy!
                  </p>
                </div>
              </div>

              {(nickError || serverNotice) && (
                <div style={{ padding: "10px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#FCA5A5", fontSize: "12px", fontWeight: 600, animation: "shake 0.3s ease-out" }}>
                  ⚠️ {nickError || serverNotice}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
                
                {/* CARD 01 – WHO (Now with Dropdown) */}
                <div style={{ ...panel("01"), gridColumn: "1/2" }}>
                  <span style={{ position: "absolute", top: "-8px", right: "10px", fontFamily: "'Bebas Neue',sans-serif", fontSize: "5.5rem", color: D.watermark1, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>01</span>
                  <span style={lbl}>Who are you?</span>
                  
                  <input
                    type="text" maxLength="15" value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleStart()}
                    placeholder="Lagyan ng pangalan..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", background: D.inputBg, border: `1.5px solid ${D.inputBdr}`, color: D.inputClr, fontSize: "13px", fontWeight: 600, outline: "none", marginBottom: "10px", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = D.accent}
                    onBlur={e  => e.target.style.borderColor = D.inputBdr}
                  />

                  {/* Dropdown for Universities */}
                  <div style={{ position: "relative" }}>
                    <select
                      value={selectedUniv}
                      onChange={(e) => setSelectedUniv(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", background: D.inputBg, border: `1.5px solid ${D.inputBdr}`, color: selectedUniv === "NONE" ? D.textMut : D.inputClr, fontSize: "12px", fontWeight: 600, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", appearance: "none", cursor: "pointer" }}
                      onFocus={e => e.target.style.borderColor = D.accent}
                      onBlur={e  => e.target.style.borderColor = D.inputBdr}
                    >
                      {universities.map(u => (
                        <option key={u.id} value={u.id} style={{ background: isDark ? "#111" : "#fff", color: isDark ? "#fff" : "#000" }}>
                          {u.id === "NONE" ? u.name : `${u.id} - ${u.name}`}
                        </option>
                      ))}
                    </select>
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "10px", color: D.textMut }}>▼</span>
                  </div>
                </div>

                {/* CARD 02 – VIBE */}
                <div style={{ ...panel("02"), gridColumn: "2/3" }}>
                  <span style={{ position: "absolute", top: "-8px", right: "10px", fontFamily: "'Bebas Neue',sans-serif", fontSize: "5.5rem", color: D.watermark2, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>02</span>
                  <span style={lbl}>Current Vibe</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "7px" }}>
                    {vibes.map(v => {
                      const sel = selectedMood === v.id;
                      return (
                        <button key={v.id} onClick={() => setSelectedMood(v.id)}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "10px 4px", borderRadius: "14px", cursor: "pointer", transition: "all 0.15s", background: sel ? (isDark ? "rgba(167,139,250,0.14)" : "rgba(2,132,199,0.1)") : "transparent", border: `1.5px solid ${sel ? D.accent : D.panelBdr}`, boxShadow: sel ? `0 0 18px ${isDark ? "rgba(167,139,250,0.25)" : "rgba(2,132,199,0.2)"}` : "none" }}
                          onMouseEnter={e => { if (!sel) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)"; }}
                          onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ fontSize: "1.4rem" }}>{v.emoji}</span>
                          <span style={{ fontSize: "8px", fontWeight: 800, color: sel ? D.accent : D.textMut, letterSpacing: "0.04em" }}>{v.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CARD 03 – TAGS & CUSTOM INTEREST */}
                <div style={{ ...panel("03"), gridColumn: "1/3" }}>
                  <span style={{ position: "absolute", top: "-8px", right: "10px", fontFamily: "'Bebas Neue',sans-serif", fontSize: "5.5rem", color: D.watermark3, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>03</span>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={lbl}>Interests</span>
                      <span style={{ fontSize: "9px", fontWeight: 600, color: D.textMut, marginTop: "-10px" }}>(max 3)</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px", marginTop: "-10px" }}>
                      {selectedTags.filter(t => !tagGroups.some(g => g.tags.includes(t))).map(ct => (
                        <span key={ct} onClick={() => toggleTag(ct)} style={{ cursor: "pointer", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", color: D.textPri, transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"} onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}>
                          {ct} ✕
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {tagGroups.map(g => (
                      <div key={g.cat} style={{ flex: "1 1 80px" }}>
                        <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: isDark ? g.dk : g.lt, display: "block", marginBottom: "7px" }}>{g.cat}</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {g.tags.map(tag => {
                            const sel = selectedTags.includes(tag);
                            const c   = isDark ? g.dk : g.lt;
                            return (
                              <button key={tag} onClick={() => toggleTag(tag)}
                                style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s", background: sel ? `${c}18` : "transparent", border: `1.5px solid ${sel ? c + "80" : D.panelBdr}`, color: sel ? c : D.textMut }}
                                onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = c + "50"; }}
                                onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = D.panelBdr; }}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Interest Input */}
                  <form onSubmit={handleAddCustomTag} style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: `1px dashed ${D.panelBdr}`, paddingTop: "14px" }}>
                    <input type="text" maxLength="15" value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Wala sa choices? Type mo dito..." style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", background: D.inputBg, border: `1px solid ${D.inputBdr}`, color: D.inputClr, fontSize: "11px", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = D.accent} onBlur={e => e.target.style.borderColor = D.inputBdr}/>
                    <button type="submit" disabled={selectedTags.length >= 3} style={{ padding: "0 16px", borderRadius: "10px", background: selectedTags.length >= 3 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") : D.accent, color: selectedTags.length >= 3 ? D.textMut : "#fff", border: "none", fontSize: "10px", fontWeight: 800, cursor: selectedTags.length >= 3 ? "not-allowed" : "pointer", transition: "0.2s" }}>
                      + ADD
                    </button>
                  </form>
                </div>
              </div>

              {/* TERMS + CTA */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }} onClick={() => setAgreed(!agreed)}>
                  <div style={{ flexShrink: 0, width: "18px", height: "18px", borderRadius: "6px", marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", background: agreed ? D.accent : "transparent", border: `1.5px solid ${agreed ? D.accent : D.panelBdr}` }}>
                    {agreed && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900 }}>✓</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: "10px", lineHeight: 1.6, color: D.textMut }}>
                    <span style={{ fontWeight: 900, color: isDark ? "#F472B6" : "#E11D48" }}>HEADS UP:</span>{" "}
                    Bawal ang bastos at explicit na content. Laging may respeto. Basahin ang{" "}
                    <Link href="/terms" style={{ color: D.accent, fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "2px" }}>terms</Link>{" "}
                    at{" "}
                    <Link href="/privacy" style={{ color: D.accent, fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "2px" }}>privacy</Link>.{" "}
                    <span style={{ opacity: 0.6 }}>(Basic lang naman diba?)</span>
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  className="cta-btn"
                  style={{ width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: D.accentGrad, backgroundSize: "200% 200%", animation: "gradShift 5s ease infinite", color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.15rem", letterSpacing: "0.14em", cursor: "pointer", boxShadow: D.btnShadow, position: "relative", overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.015)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  onMouseDown={e  => { e.currentTarget.style.transform = "scale(0.985)"; }}
                  onMouseUp={e    => { e.currentTarget.style.transform = "scale(1.015)"; }}
                >
                  START CHAT →
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════ STATE: SEARCHING ════════════════════ */}
          {status === "searching" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "32px" }}>
              <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: isDark ? "rgba(139,92,246,0.15)" : "rgba(2,132,199,0.12)", animation: "ringPulse 1.8s ease-in-out infinite" }} />
                <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", background: isDark ? "rgba(236,72,153,0.1)" : "rgba(13,148,136,0.1)", animation: "ringPulse 1.8s ease-in-out infinite 0.4s" }} />
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `3px solid transparent`, borderTop: `3px solid ${isDark ? "#A78BFA" : "#0284C7"}`, borderRight: `3px solid ${isDark ? "#F472B6" : "#0D9488"}`, animation: "spin 1s linear infinite", boxShadow: isDark ? "0 0 24px rgba(167,139,250,0.3)" : "0 0 20px rgba(2,132,199,0.25)" }} />
                <span style={{ position: "absolute", fontSize: "1.8rem" }}>✦</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: "0 0 6px", fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.2rem", letterSpacing: "0.1em", color: D.textPri }}>NAGHAHANAP…</h2>
                <p style={{ margin: 0, fontSize: "12px", color: D.textMut, fontWeight: 600 }}>Hinahanap ang ka-puyatan mo ngayong gabi.</p>
              </div>
              
              <button onClick={exitToMenu} style={{ marginTop: "10px", background: "none", border: "none", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: D.textMut, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Cancel Search
              </button>
            </div>
          )}

          {/* ════════════════════ STATE: RATING ════════════════════ */}
          {status === "rating" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", textAlign: "center", animation: "fadeSlideUp 0.35s ease-out" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: D.panelBg, border: `1px solid ${D.panelBdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", marginBottom: "18px", boxShadow: D.panelShadow }}>📝</div>
              <h2 style={{ margin: "0 0 6px", fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: "0.1em", color: D.textPri }}>VIBE CHECK</h2>
              <p style={{ margin: "0 0 24px", fontSize: "12px", color: D.textMut, fontWeight: 600 }}>Paano mo i-ra-rate ang huli mong kausap?</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%", maxWidth: "300px", marginBottom: "16px" }}>
                {[
                  { label: "🔥 W Kausap", val: "W Kausap", c: "#22C55E" },
                  { label: "🥀 Sabaw",    val: "Sabaw",    c: "#F59E0B" },
                  { label: "⏭ Boring",   val: "GG",       c: "#6B7280" },
                  { label: "🚩 Red Flag", val: "Red Flag", c: "#EF4444" },
                ].map(r => (
                  <button key={r.val} onClick={() => submitRating(r.val)}
                    style={{ padding: "14px 0", borderRadius: "14px", fontSize: "13px", fontWeight: 800, cursor: "pointer", transition: "all 0.15s", background: `${r.c}12`, border: `1.5px solid ${r.c}50`, color: r.c }}
                    onMouseEnter={e => { e.currentTarget.style.background = r.c; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${r.c}12`; e.currentTarget.style.color = r.c; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              
              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <button onClick={() => submitRating("Skip")} style={{ background: "none", border: "none", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: D.textMut, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  Skip & Next
                </button>
                <button onClick={exitToMenu} style={{ background: "none", border: "none", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: D.textMut, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  Exit to Menu
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════ STATE: CONNECTED ════════════════════ */}
          {status === "connected" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }} ref={chatContainerRef}>

              {/* CHAT HEADER */}
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${D.hdrBdr}`, background: D.hdrBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: D.panelBg, border: `1px solid ${D.panelBdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                    {strangerInfo?.mood?.split(" ")[0] || "👤"}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: D.textPri }}>{strangerInfo?.nickname || "Stranger"}</span>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: strangerAfk ? "#F59E0B" : "#22C55E", animation: "pulse 1.4s infinite", display: "inline-block" }} />
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "3px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "9px", fontWeight: 800, padding: "2px 7px", borderRadius: "6px", background: `${tier.c}15`, border: `1px solid ${tier.c}40`, color: tier.c }}>{tier.label}</span>
                      {strangerInfo?.univ && activeUniv && (
                        <span style={{ fontSize: "9px", fontWeight: 800, padding: "2px 7px", borderRadius: "6px", background: `${activeUniv.color}15`, border: `1px solid ${activeUniv.color}40`, color: activeUniv.color }}>{strangerInfo.univ}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={exitToMenu} title="Main Menu" style={{ ...iconBtn, width: "36px", height: "36px", fontSize: "14px" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>🚪</button>
                  <button onClick={exportChat} title="Screenshot" style={{ ...iconBtn, width: "36px", height: "36px" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>📸</button>
                  <button onClick={reportUser} title="Report User" style={{ ...iconBtn, width: "36px", height: "36px", fontSize: "14px", color: isDark ? "#FCA5A5" : "#DC2626", border: `1px solid ${isDark ? "rgba(248,113,113,0.35)" : "rgba(220,38,38,0.28)"}` }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>🚩</button>
                  <button onClick={skipChat} style={{ ...iconBtn, padding: "0 14px", height: "36px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.05em" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>⏭ Skip</button>
                </div>
              </div>

              {/* AFK BANNER */}
              {strangerAfk && (
                <div style={{ background: "rgba(245,158,11,0.08)", borderBottom: "1px solid rgba(245,158,11,0.2)", padding: "7px 16px", fontSize: "9px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#F59E0B", textAlign: "center", animation: "pulse 1.4s infinite" }}>
                  ⚠️  Stranger is Alt-Tabbed
                </div>
              )}

              {/* MESSAGES */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }} className="chat-scroll">
                {chatBox.map((msg, i) => {
                  if (msg.type === "system") return (
                    <div key={i} style={{ alignSelf: "center", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: D.textMut, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${D.panelBdr}`, padding: "5px 14px", borderRadius: "999px" }}>{msg.text}</div>
                  );
                  const isMe = msg.type === "me";
                  return (
                    <div key={i}
                      onClick={e => e.currentTarget.style.filter = "none"}
                      style={{ maxWidth: "72%", padding: "11px 15px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: "13px", fontWeight: 500, lineHeight: 1.55, alignSelf: isMe ? "flex-end" : "flex-start", transition: "all 0.2s", animation: "fadeSlideUp 0.25s ease-out", filter: msg.isSpoiler ? "blur(6px)" : "none", cursor: msg.isSpoiler ? "pointer" : "default", background: isMe ? D.bubbleMe : D.bubbleThem, border: isMe ? "none" : `1px solid ${D.bubbleThemBdr}`, color: isMe ? "#fff" : D.textPri, backdropFilter: isMe ? "none" : "blur(8px)", WebkitBackdropFilter: isMe ? "none" : "blur(8px)", boxShadow: isMe ? (isDark ? "0 4px 20px rgba(124,58,237,0.3)" : "0 4px 20px rgba(2,132,199,0.25)") : "none" }}
                    >
                      {msg.text}
                    </div>
                  );
                })}
                {isTyping && (
                  <div style={{ maxWidth: "72px", padding: "13px 16px", borderRadius: "18px 18px 18px 4px", alignSelf: "flex-start", background: D.bubbleThem, border: `1px solid ${D.bubbleThemBdr}`, backdropFilter: "blur(8px)", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0,0.18,0.36].map((d,i) => <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: isDark ? "rgba(196,181,253,0.5)" : "rgba(2,132,199,0.5)", animation: `bounce 0.8s ease-in-out infinite ${d}s`, display: "block" }} />)}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* INPUT BAR */}
              <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${D.hdrBdr}`, background: D.hdrBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "7px" }}>
                    {["😂","💀","❤️"].map(em => (
                      <button key={em}
                        onClick={() => { triggerFloatingEmoji(em); socket.emit("send_reaction", { emoji: em, room }); }}
                        style={{ ...iconBtn, width: "32px", height: "32px", fontSize: "14px" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.25) translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      >{em}</button>
                    ))}
                  </div>
                  {isSpoilerMode && (
                    <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: isDark ? "#F472B6" : "#BE185D", animation: "pulse 1.4s infinite" }}>🔒 SPOILER ON</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={sendIcebreaker} title="Random Icebreaker"
                    style={{ ...iconBtn, width: "40px", height: "40px", fontSize: "16px", flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1) rotate(-10deg)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}>🎲</button>
                  <button onClick={() => setIsSpoilerMode(!isSpoilerMode)} title="Spoiler Mode"
                    style={{ ...iconBtn, width: "40px", height: "40px", fontSize: "16px", flexShrink: 0, background: isSpoilerMode ? (isDark ? "rgba(244,114,182,0.15)" : "rgba(190,24,93,0.1)") : D.iconBtnBg, borderColor: isSpoilerMode ? (isDark ? "rgba(244,114,182,0.5)" : "rgba(190,24,93,0.4)") : D.iconBtnBdr, color: isSpoilerMode ? (isDark ? "#F472B6" : "#BE185D") : D.iconBtnClr }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>🔒</button>

                  <input
                    type="text" placeholder="Yap na boss…" value={message}
                    onChange={handleTyping} onKeyDown={e => e.key === "Enter" && sendMessage()}
                    style={{ flex: 1, padding: "11px 16px", borderRadius: "12px", background: D.inputBg, border: `1.5px solid ${isSpoilerMode ? (isDark ? "rgba(244,114,182,0.5)" : "rgba(190,24,93,0.4)") : D.inputBdr}`, color: D.inputClr, fontSize: "13px", fontWeight: 500, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = isSpoilerMode ? (isDark ? "#F472B6" : "#BE185D") : D.accent}
                    onBlur={e  => e.target.style.borderColor = isSpoilerMode ? (isDark ? "rgba(244,114,182,0.5)" : "rgba(190,24,93,0.4)") : D.inputBdr}
                  />

                  <button onClick={sendMessage}
                    style={{ padding: "11px 20px", borderRadius: "12px", border: "none", background: D.accentGrad, color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", flexShrink: 0, transition: "all 0.15s", boxShadow: isDark ? "0 0 20px rgba(124,58,237,0.35)" : "0 0 16px rgba(2,132,199,0.25)" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1.05)"}>
                    SEND
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

{/* ── AD SIDEBAR (Hybrid Monetization Zone) ── */}
        <div style={{ width: "220px", flexShrink: 0, borderLeft: `1px solid ${D.sidebarBdr}`,
        background: D.sidebarBg, display: "flex", flexDirection: "column", alignItems:
        "center", padding: "20px 16px", gap: "16px", overflowY: "auto" }}
        className="sidebar-ad chat-scroll">
          
          <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: D.textMut }}>Sponsored</span>

          {/* 1. OTTER DIGITALS PROMO */}
          <div style={{ width: "100%", background: D.panelBg, borderRadius: "14px", border: `1px solid ${D.panelBdr}`, padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: D.panelShadow }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = D.panelBdr; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🦦</div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: D.textPri, margin: "0 0 4px 0" }}>Otter Digitals</p>
            <p style={{ fontSize: "9px", color: D.textMut, margin: "0 0 12px 0", lineHeight: 1.4 }}>Need a website or custom system? Let's build it.</p>
            <a href="https://otter-digitals.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "8px 0", background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
              HIRE US
            </a>
          </div>

          {/* 2. AFFILIATE / ADSTERRA DIRECT LINK */}
          <div style={{ width: "100%", background: D.panelBg, borderRadius: "14px", border: `1px solid ${D.panelBdr}`, padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: D.panelShadow }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = D.panelBdr; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>☕</div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: D.textPri, margin: "0 0 4px 0" }}>Pampagising Kape</p>
            <p style={{ fontSize: "9px", color: D.textMut, margin: "0 0 12px 0", lineHeight: 1.4 }}>Para sa madaling araw na puyatan.</p>
            <a href="https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "8px 0", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
              BUY ON SHOPEE
            </a>
          </div>

          {/* 3. MERCH / ADSTERRA DIRECT LINK */}
          <div style={{ width: "100%", background: D.panelBg, borderRadius: "14px", border: `1px solid ${D.panelBdr}`, padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: D.panelShadow }} onMouseEnter={e => { e.currentTarget.style.borderColor = D.accent; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = D.panelBdr; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🛍️</div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: D.textPri, margin: "0 0 4px 0" }}>Limited Edition Tote</p>
            <p style={{ fontSize: "14px", fontWeight: 900, color: D.accent, margin: "0 0 12px 0" }}>₱175</p>
            <a href="https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "8px 0", background: D.accentGrad, color: "#fff", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 800, textDecoration: "none", boxShadow: D.btnShadow }}>
              GET YOURS
            </a>
          </div>

        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Figtree:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        input::placeholder { color: ${D.inputPh}; }

        /* ── Aurora blobs ── */
        .aurora-blob {
          position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.4; pointer-events: none;
        }
        .b1 { width: 500px; height: 500px; top: -140px; left: -120px; animation: drift1 22s ease-in-out infinite alternate; }
        .b2 { width: 400px; height: 400px; bottom: -100px; right: -80px; animation: drift2 26s ease-in-out infinite alternate; }
        .b3 { width: 300px; height: 300px; top: 45%; left: 55%; transform: translate(-50%,-50%); animation: drift3 30s ease-in-out infinite alternate; opacity: 0.25; }
        @keyframes drift1 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(55px,-35px) scale(1.07)} 100%{transform:translate(-25px,45px) scale(0.94)} }
        @keyframes drift2 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-45px,30px) scale(1.06)} 100%{transform:translate(35px,-40px) scale(0.96)} }
        @keyframes drift3 { 0%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(calc(-50% + 28px),calc(-50% - 20px)) scale(1.12)} 100%{transform:translate(calc(-50% - 18px),calc(-50% + 22px)) scale(0.9)} }

        /* ── Animations ── */
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ringPulse   { 0%{transform:scale(0.9);opacity:0.6} 50%{transform:scale(1.08);opacity:0.2} 100%{transform:scale(0.9);opacity:0.6} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes floatUp     { 0%{transform:translateY(0) scale(1) rotate(0deg);opacity:1} 100%{transform:translateY(-220px) scale(2.2) rotate(18deg);opacity:0} }
        @keyframes gradShift   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        /* CTA shimmer sweep */
        .cta-btn::after {
          content: ''; position: absolute; top: 0; left: -80%;
          width: 60px; height: 100%; background: rgba(255,255,255,0.18);
          transform: skewX(-18deg); animation: shimmer 3.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%{left:-80%} 100%{left:160%} }

        /* Scrollbars */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(167,139,250,0.2)" : "rgba(2,132,199,0.2)"}; border-radius: 10px; }

        /* Responsive hide */
        @media (max-width: 768px) {
          .sidebar-ad { display: none !important; }
          .banner-ad  { display: none !important; }
        }
        @media (min-width: 769px) {
          .banner-ad { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
