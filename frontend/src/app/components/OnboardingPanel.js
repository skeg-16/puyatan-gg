"use client";

import Link from "next/link";

const supportLinks = [
  {
    title: "Otter Digitals",
    subtitle: "Custom websites and systems",
    href: "https://otter-digitals.vercel.app/",
    accent: "#3B82F6",
    cta: "HIRE US",
    emoji: "OT",
  },
  {
    title: "Pampagising Kape",
    subtitle: "Late-night survival fuel",
    href: "https://www.profitablecpmratenetwork.com/wj5k3704g?key=a1e8c914d826c6b3834b15aa0bbba67e",
    accent: "#F97316",
    cta: "BUY NOW",
    emoji: "KP",
  },
];

const introHighlights = [
  "Anonymous by default",
  "Fast random matching",
  "Built for late-night students",
];

export default function OnboardingPanel({
  status,
  setStatus,
  nickname,
  setNickname,
  nickError,
  serverNotice,
  selectedUniv,
  setSelectedUniv,
  selectedMood,
  setSelectedMood,
  selectedTags,
  toggleTag,
  customTag,
  setCustomTag,
  handleAddCustomTag,
  agreed,
  setAgreed,
  handleStart,
  connectionState,
  isDark,
  D,
  universities,
  vibes,
  tagGroups,
}) {
  const panelBase = {
    position: "relative",
    padding: "16px",
    borderRadius: "22px",
    overflow: "hidden",
    background: D.panelBg,
    border: `1px solid ${D.panelBdr}`,
    boxShadow: D.panelShadow,
    minHeight: 0,
  };

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    background: D.inputBg,
    border: `1px solid ${D.inputBdr}`,
    color: D.inputClr,
    fontSize: "13px",
    fontWeight: 600,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: D.labelClr,
    display: "block",
    marginBottom: "10px",
  };

  if (status === "intro") {
    return (
      <div
        className="onboarding-shell intro-shell"
        style={{
          flex: 1,
          minHeight: 0,
          padding: "22px",
          display: "grid",
          gap: "18px",
        }}
      >
        <section
          className="intro-hero"
          style={{
            ...panelBase,
            padding: "26px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            gap: "18px",
            background: isDark
              ? "radial-gradient(circle at top left, rgba(168,85,247,0.28), transparent 30%), radial-gradient(circle at bottom right, rgba(14,165,233,0.18), transparent 28%), linear-gradient(145deg, rgba(20,16,38,0.98), rgba(8,11,24,0.96))"
              : "radial-gradient(circle at top left, rgba(2,132,199,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(236,72,153,0.14), transparent 24%), linear-gradient(145deg, rgba(255,255,255,0.96), rgba(244,246,255,0.92))",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "22px",
              alignContent: "space-between",
              minHeight: "420px",
            }}
          >
            <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: isDark ? "#67E8F9" : "#0369A1",
                  border: `1px solid ${isDark ? "rgba(103,232,249,0.22)" : "rgba(3,105,161,0.18)"}`,
                  background: isDark ? "rgba(103,232,249,0.08)" : "rgba(255,255,255,0.82)",
                  width: "fit-content",
                }}
              >
                Live anonymous chat
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(3.4rem, 8vw, 6.4rem)",
                    letterSpacing: "0.08em",
                    lineHeight: 0.86,
                    backgroundImage: D.logoGrad,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: isDark ? "0 0 34px rgba(167,139,250,0.18)" : "0 0 20px rgba(2,132,199,0.12)",
                  }}
                >
                  PUYATAN.GG
                </h1>

                <p
                  style={{
                    margin: 0,
                    maxWidth: "24ch",
                    fontSize: "clamp(1.08rem, 1.9vw, 1.5rem)",
                    lineHeight: 1.45,
                    color: D.textPri,
                    fontWeight: 600,
                  }}
                >
                  Anonymous late-night tambayan for students, gamers, and puyat warriors.
                </p>
              </div>
            </div>

            <div className="intro-highlight-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
              {introHighlights.map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: "16px",
                    padding: "12px",
                    border: `1px solid ${D.panelBdr}`,
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.64)",
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1.45,
                    color: D.textMut,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "14px", alignContent: "space-between" }}>
            <section
              style={{
                ...panelBase,
                padding: "18px",
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
              }}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                <span style={{ ...labelStyle, marginBottom: 0 }}>Tonight&apos;s vibe</span>
                <strong style={{ fontSize: "1.08rem", color: D.textPri, lineHeight: 1.3 }}>
                  Quick, low-pressure, and late-night friendly.
                </strong>
                <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.55, color: D.textMut }}>
                  Less clutter, faster entry, better first impression for both phone and desktop users.
                </p>
              </div>
            </section>

            <div className="intro-support-grid" style={{ display: "grid", gap: "12px" }}>
              {supportLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...panelBase,
                    padding: "16px",
                    textDecoration: "none",
                    color: D.textPri,
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: `${item.accent}22`,
                        color: item.accent,
                        fontSize: "12px",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        flexShrink: 0,
                      }}
                    >
                      {item.emoji}
                    </div>
                    <div style={{ display: "grid", gap: "3px", minWidth: 0 }}>
                      <strong style={{ fontSize: "0.98rem", lineHeight: 1.2 }}>{item.title}</strong>
                      <span style={{ fontSize: "12px", color: D.textMut, lineHeight: 1.45 }}>{item.subtitle}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "38px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${item.accent}, ${item.accent}CC)`,
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.cta}
                  </span>
                </a>
              ))}
            </div>

            <section
              style={{
                ...panelBase,
                padding: "16px",
                display: "grid",
                gap: "12px",
              }}
            >
              {serverNotice && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "14px",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.22)",
                    color: "#FCA5A5",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {serverNotice}
                </div>
              )}

              <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.55, color: D.textMut }}>
                Hanap kausap agad, walang mahabang setup. Clean sa mobile, intentional sa desktop.
              </p>

              <button
                onClick={() => setStatus("landing")}
                className="cta-btn"
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: "18px",
                  border: "none",
                  background: D.accentGrad,
                  color: "#fff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.35rem",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  boxShadow: D.btnShadow,
                }}
              >
                ENTER APP
              </button>
            </section>
          </div>
        </section>

        <style>{`
          @media (max-width: 960px) {
            .intro-shell {
              padding: 16px !important;
            }

            .intro-hero {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .intro-shell {
              padding: 12px !important;
              gap: 12px !important;
            }

            .intro-highlight-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="onboarding-shell landing-shell"
      style={{
        flex: 1,
        minHeight: 0,
        padding: "18px",
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.7rem, 6vw, 4.5rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.9,
              backgroundImage: D.logoGrad,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PUYATAN.GG
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: D.textMut,
            }}
          >
            Match fast, yap faster
          </p>
        </div>

        <span
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            background: isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)",
            border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "rgba(22,163,74,0.25)"}`,
            color: isDark ? "#4ADE80" : "#16A34A",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isDark ? "#4ADE80" : "#16A34A" }} />
          {connectionState === "connected" ? "LIVE" : "SYNC"}
        </span>
      </div>

      {(nickError || serverNotice) && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: "14px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#FCA5A5",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {nickError || serverNotice}
        </div>
      )}

      <div className="landing-main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: "14px", minHeight: 0 }}>
        <div style={{ display: "grid", gap: "14px", minHeight: 0 }}>
          <section
            style={{
              ...panelBase,
              padding: "18px",
              background: isDark
                ? "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(8,11,22,0.9) 58%, rgba(14,165,233,0.08))"
                : "linear-gradient(145deg, rgba(2,132,199,0.1), rgba(255,255,255,0.9) 58%, rgba(236,72,153,0.06))",
            }}
          >
            <span style={labelStyle}>Who are you?</span>
            <div style={{ display: "grid", gap: "10px" }}>
              <input
                type="text"
                maxLength="15"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Lagyan ng pangalan..."
                style={fieldStyle}
              />

              <div style={{ position: "relative" }}>
                <select
                  value={selectedUniv}
                  onChange={(e) => setSelectedUniv(e.target.value)}
                  style={{
                    ...fieldStyle,
                    appearance: "none",
                    cursor: "pointer",
                    color: selectedUniv === "NONE" ? D.textMut : D.inputClr,
                    paddingRight: "34px",
                  }}
                >
                  {universities.map((u) => (
                    <option key={u.id} value={u.id} style={{ background: isDark ? "#111" : "#fff", color: isDark ? "#fff" : "#000" }}>
                      {u.id === "NONE" ? u.name : `${u.id} - ${u.name}`}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    fontSize: "10px",
                    color: D.textMut,
                  }}
                >
                  ▼
                </span>
              </div>
            </div>
          </section>

          <section style={{ ...panelBase, padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
              <span style={labelStyle}>Current vibe</span>
              <span style={{ fontSize: "10px", color: D.textMut, fontWeight: 700 }}>
                Pick one
              </span>
            </div>
            <div className="landing-vibe-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px" }}>
              {vibes.map((v) => {
                const sel = selectedMood === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedMood(v.id)}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      gap: "6px",
                      minHeight: "88px",
                      padding: "10px 8px",
                      borderRadius: "18px",
                      cursor: "pointer",
                      background: sel ? (isDark ? "rgba(167,139,250,0.16)" : "rgba(2,132,199,0.1)") : "transparent",
                      border: `1.5px solid ${sel ? D.accent : D.panelBdr}`,
                      boxShadow: sel ? `0 0 18px ${isDark ? "rgba(167,139,250,0.2)" : "rgba(2,132,199,0.16)"}` : "none",
                      color: sel ? D.accent : D.textMut,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{v.emoji}</span>
                    <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.04em" }}>{v.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section style={{ ...panelBase, padding: "18px", display: "grid", gridTemplateRows: "auto 1fr auto", gap: "14px", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={labelStyle}>Interests</span>
              <span style={{ fontSize: "10px", color: D.textMut, fontWeight: 700 }}>(max 3)</span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {selectedTags.filter((t) => !tagGroups.some((g) => g.tags.includes(t))).map((ct) => (
                <button
                  key={ct}
                  onClick={() => toggleTag(ct)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "none",
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    color: D.textPri,
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {ct} ×
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", alignContent: "start", minHeight: 0 }}>
            {tagGroups.map((g) => (
              <div key={g.cat}>
                <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: isDark ? g.dk : g.lt, display: "block", marginBottom: "8px" }}>
                  {g.cat}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {g.tags.map((tag) => {
                    const sel = selectedTags.includes(tag);
                    const c = isDark ? g.dk : g.lt;
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{
                          padding: "6px 11px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          background: sel ? `${c}18` : "transparent",
                          border: `1.5px solid ${sel ? `${c}88` : D.panelBdr}`,
                          color: sel ? c : D.textMut,
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCustomTag} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              maxLength="15"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Custom tag..."
              style={{ ...fieldStyle, minWidth: 0 }}
            />
            <button
              type="submit"
              disabled={selectedTags.length >= 3}
              style={{
                padding: "0 16px",
                borderRadius: "14px",
                background: selectedTags.length >= 3 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") : D.accent,
                color: selectedTags.length >= 3 ? D.textMut : "#fff",
                border: "none",
                fontSize: "11px",
                fontWeight: 800,
                cursor: selectedTags.length >= 3 ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}
            >
              + ADD
            </button>
          </form>
        </section>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            onClick={() => setAgreed(!agreed)}
            style={{
              flexShrink: 0,
              width: "18px",
              height: "18px",
              borderRadius: "6px",
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: agreed ? D.accent : "transparent",
              border: `1.5px solid ${agreed ? D.accent : D.panelBdr}`,
            }}
          >
            {agreed && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900 }}>✓</span>}
          </div>
          <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.55, color: D.textMut }}>
            <span style={{ fontWeight: 900, color: isDark ? "#F472B6" : "#E11D48" }}>HEADS UP:</span> Bawal ang bastos at explicit na content. Basahin ang{" "}
            <Link href="/terms" style={{ color: D.accent, fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              terms
            </Link>{" "}
            at{" "}
            <Link href="/privacy" style={{ color: D.accent, fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              privacy
            </Link>
            .
          </p>
        </label>

        <button
          onClick={handleStart}
          className="cta-btn"
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "18px",
            border: "none",
            background: D.accentGrad,
            color: "#fff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.35rem",
            letterSpacing: "0.12em",
            cursor: "pointer",
            boxShadow: D.btnShadow,
          }}
        >
          START CHAT
        </button>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .landing-shell,
          .intro-shell {
            padding: 16px !important;
          }

          .intro-hero,
          .landing-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .landing-shell,
          .intro-shell {
            padding: 12px !important;
            gap: 12px !important;
          }

          .intro-highlight-grid,
          .landing-vibe-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
