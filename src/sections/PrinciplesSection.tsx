import { partnershipPrinciples } from "../data/metlifeContent";
import { SectionHeader } from "../components/SectionHeader";

export function PrinciplesSection() {
  return (
    <section id="principles">
      <SectionHeader
        eyebrow="Partnership principles"
        title="How we sustain momentum together"
        description="Modernizing a global insurer requires synchronized leadership and durable habits. These principles keep transformation grounded in outcomes."
      />
      <ol
        style={{
          margin: 0,
          paddingLeft: "20px",
          display: "grid",
          gap: "16px",
          counterReset: "principle",
          listStyle: "none",
        }}
      >
        {partnershipPrinciples.map((principle) => (
          <li
            key={principle}
            style={{
              position: "relative",
              padding: "24px",
              borderRadius: "22px",
              border: "1px solid rgba(59, 140, 201, 0.4)",
              background: "rgba(3, 9, 18, 0.78)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "var(--accent-soft)",
                color: "var(--accent)",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              {String(partnershipPrinciples.indexOf(principle) + 1).padStart(
                2,
                "0",
              )}
            </span>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              {principle}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
