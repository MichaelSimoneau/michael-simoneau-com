import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function ButtonLink({
  children,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 28px",
    borderRadius: "999px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "0.85rem",
    transition:
      "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
    border: "1px solid transparent",
  };

  const variants: Record<typeof variant, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(120deg, #00a0df 0%, #3bc6ff 100%)",
      color: "#011223",
      boxShadow: "0 18px 32px rgba(0, 160, 223, 0.35)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid rgba(59, 140, 201, 0.65)",
      backdropFilter: "blur(12px)",
    },
  };

  return (
    <a
      {...props}
      style={{
        ...baseStyle,
        ...variants[variant],
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}
