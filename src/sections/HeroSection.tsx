import { heroContent, metrics } from "../data/metlifeContent";
import { ButtonLink } from "../components/ButtonLink";
import { MetricCard } from "../components/MetricCard";

export function HeroSection() {
  return (
    <section style={{ display: "grid", gap: "48px" }} id="top">
      <div
        style={{
          display: "grid",
          gap: "32px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: "20px" }}>
          <span
            style={{
              color: "var(--accent)",
              fontSize: "0.95rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {heroContent.eyebrow}
          </span>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {heroContent.title}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              margin: 0,
              maxWidth: "640px",
            }}
          >
            {heroContent.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <ButtonLink href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={heroContent.secondaryCta.href}
              variant="secondary"
            >
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(59, 140, 201, 0.5)",
            padding: "28px",
            display: "grid",
            gap: "18px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(0, 160, 223, 0.3), transparent 70%), rgba(7, 18, 36, 0.85)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
            }}
          >
            MetLife architecture guardrails
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: "12px",
            }}
          >
            <li style={{ color: "var(--text-muted)" }}>
              • Customer and advisor intelligence orchestrated by secure event
              streams.
            </li>
            <li style={{ color: "var(--text-muted)" }}>
              • Unified policy fabric powering underwriting, claims, and
              wellbeing ecosystems.
            </li>
            <li style={{ color: "var(--text-muted)" }}>
              • Cloud-native blueprint with compliance automation across 40+
              jurisdictions.
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}
