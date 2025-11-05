import { capabilityPillars } from "../data/metlifeContent";
import { SectionHeader } from "../components/SectionHeader";

export function CapabilitiesSection() {
  return (
    <section id="capabilities">
      <SectionHeader
        eyebrow="Platform pillars"
        title="Where MetLife is compounding advantage"
        description="Each pillar combines deep actuarial heritage with adaptive digital experiences so every policyholder, employer, and advisor feels known."
      />
      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {capabilityPillars.map((pillar) => (
          <article
            key={pillar.title}
            style={{
              borderRadius: "24px",
              padding: "28px",
              display: "grid",
              gap: "16px",
              background:
                "linear-gradient(135deg, rgba(0, 160, 223, 0.2) 0%, rgba(4, 12, 24, 0.92) 55%, rgba(4, 8, 14, 0.95) 100%)",
              border: "1px solid rgba(59, 140, 201, 0.45)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{pillar.title}</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              {pillar.description}
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                display: "grid",
                gap: "10px",
                color: "var(--text-muted)",
              }}
            >
              {pillar.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
