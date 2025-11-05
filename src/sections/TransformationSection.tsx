import { transformationThemes } from "../data/metlifeContent";
import { SectionHeader } from "../components/SectionHeader";

export function TransformationSection() {
  return (
    <section id="transformation">
      <SectionHeader
        eyebrow="Transformation themes"
        title="How the MetLife platform keeps evolving"
        description="The work does not stop at launch. Data, partners, and wellness programs continue to reshape how protection is experienced and measured."
      />
      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {transformationThemes.map((theme) => (
          <div
            key={theme.name}
            style={{
              display: "flex",
              gap: "20px",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid rgba(59, 140, 201, 0.4)",
              background: "rgba(5, 12, 23, 0.75)",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: "44px",
                height: "44px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "14px",
                background: "rgba(0, 160, 223, 0.18)",
                color: "var(--accent)",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              {theme.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>
                {theme.name}
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                {theme.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
