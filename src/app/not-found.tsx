import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "70dvh",
        display: "grid",
        placeItems: "center",
        padding: "6rem 1rem",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            color: "var(--accent)",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          ERR · 404
        </p>
        <h1 style={{ maxWidth: "18ch", margin: "0 auto 1.5rem" }}>
          Signal lost in the noise floor.
        </h1>
        <p style={{ color: "var(--fg-muted)", marginBottom: "2rem" }}>
          The page you&rsquo;re looking for isn&rsquo;t here. Try going back.
        </p>
        <Link href="/" className="link-inline">
          ← home
        </Link>
      </div>
    </section>
  );
}
