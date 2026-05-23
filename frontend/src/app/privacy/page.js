export const metadata = {
  title: "Privacy Policy | Puyatan.GG",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f8fafc", fontFamily: "'Figtree', sans-serif" }}>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", lineHeight: 1.8 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", letterSpacing: "0.1em", background: "linear-gradient(135deg, #38BDF8, #A78BFA)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: "32px" }}>
          PRIVACY POLICY
        </h1>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px", fontSize: "15px", color: "#cbd5e1" }}>
          <p style={{ marginBottom: "20px" }}>
            <strong style={{ color: "#38BDF8" }}>Puyatan.GG</strong> is an anonymous chat experience. We avoid asking for real names, but we may store
            basic operational data such as socket identifiers, IP addresses, ratings, and abuse reports to
            keep the service stable and safer for users.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Messages are relayed in real time. Reports, moderation events, and technical logs may be stored
            to investigate abuse, spam, or platform issues. Do not share private, financial, or highly
            sensitive information in chat.
          </p>
          <p style={{ margin: 0 }}>
            By using the service, you agree that operational logs may be used for moderation, abuse
            prevention, and service improvement.
          </p>
        </div>
      </main>
    </div>
  );
}
