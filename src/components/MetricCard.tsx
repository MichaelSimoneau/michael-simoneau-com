interface MetricCardProps {
  label: string;
  value: string;
  description: string;
}

export function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <div
      style={{
        borderRadius: "24px",
        background: "var(--bg-panel-strong)",
        padding: "28px",
        border: "1px solid rgba(59, 140, 201, 0.4)",
        minWidth: "220px",
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 20px 36px rgba(1, 17, 35, 0.5)",
      }}
    >
      <span
        style={{
          color: "var(--accent)",
          fontSize: "0.9rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <strong style={{ fontSize: "2.5rem", letterSpacing: "-0.03em" }}>
        {value}
      </strong>
      <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
        {description}
      </p>
    </div>
  );
}
