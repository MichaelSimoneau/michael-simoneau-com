import { programs } from "../data/metlifeContent";
import { SectionHeader } from "../components/SectionHeader";

export function ProgramsSection() {
  return (
    <section id="programs">
      <SectionHeader
        eyebrow="Signature programs"
        title="Blueprints already reshaping the MetLife enterprise"
        description="Each initiative connected policyholder value, advisor enablement, and operational resilience in measurable ways."
      />
      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >
        {programs.map((program) => (
          <article
            key={program.title}
            style={{
              borderRadius: "24px",
              padding: "28px",
              background:
                "linear-gradient(140deg, rgba(0, 160, 223, 0.2) 0%, rgba(3, 10, 19, 0.9) 65%, rgba(3, 6, 12, 0.95) 100%)",
              border: "1px solid rgba(59, 140, 201, 0.45)",
              display: "grid",
              gap: "12px",
            }}
          >
            <header>
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{program.title}</h3>
            </header>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              {program.result}
            </p>
            <div
              style={{
                padding: "18px",
                borderRadius: "18px",
                background: "rgba(0, 160, 223, 0.12)",
                color: "#0e2135",
                fontWeight: 600,
              }}
            >
              <span style={{ color: "#0e2135" }}>{program.impact}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
