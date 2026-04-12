export const metadata = {
  title: "Privacy Policy | Puyatan.GG",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px", lineHeight: 1.7 }}>
      <h1>Privacy Policy</h1>
      <p>
        Puyatan.GG is an anonymous chat experience. We avoid asking for real names, but we may store
        basic operational data such as socket identifiers, IP addresses, ratings, and abuse reports to
        keep the service stable and safer for users.
      </p>
      <p>
        Messages are relayed in real time. Reports, moderation events, and technical logs may be stored
        to investigate abuse, spam, or platform issues. Do not share private, financial, or highly
        sensitive information in chat.
      </p>
      <p>
        By using the service, you agree that operational logs may be used for moderation, abuse
        prevention, and service improvement.
      </p>
    </main>
  );
}
