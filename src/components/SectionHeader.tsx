import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <header style={{ textAlign: align, marginBottom: "32px" }}>
      {eyebrow ? (
        <p
          style={{
            color: "var(--accent)",
            fontSize: "0.85rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
            marginBottom: "12px",
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        style={{
          fontSize: "clamp(1.75rem, 3vw, 2.6rem)",
          margin: 0,
          marginBottom: description ? "16px" : 0,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {description ? (
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: align === "center" ? "720px" : "640px",
            margin: align === "center" ? "0 auto" : 0,
            lineHeight: 1.7,
            fontSize: "1rem",
          }}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
