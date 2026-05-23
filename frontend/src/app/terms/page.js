export const metadata = {
  title: "Terms of Use | Puyatan.GG",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f8fafc", fontFamily: "'Figtree', sans-serif" }}>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", lineHeight: 1.8 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", letterSpacing: "0.1em", background: "linear-gradient(135deg, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: "32px" }}>
          TERMS OF USE
        </h1>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", fontSize: "15px", color: "#cbd5e1" }}>
          <p style={{ marginBottom: "20px" }}>
            <strong style={{ color: "#F472B6" }}>Puyatan.GG</strong> is for respectful anonymous conversations. Harassment, threats, explicit sexual
            content, hate speech, doxxing, spam, and attempts to exploit the platform are not allowed.
          </p>
          <p style={{ marginBottom: "20px" }}>
            You are responsible for what you send. Accounts are not required, but abusive behavior can still
            be rate limited, logged, blocked, or reported through moderation systems.
          </p>
          <p style={{ margin: 0 }}>
            The service may remove access, end chats, or retain moderation records when needed to protect the
            community and the platform.
          </p>
        </div>
      </main>
    </div>
  );
}
