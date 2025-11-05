import { contactContent } from "../data/metlifeContent";
import { ButtonLink } from "../components/ButtonLink";
import { SectionHeader } from "../components/SectionHeader";

export function ContactSection() {
  return (
    <section id="contact">
      <SectionHeader
        eyebrow="Engage"
        title={contactContent.heading}
        description={contactContent.copy}
        align="center"
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        {contactContent.actions.map((action) => (
          <ButtonLink
            key={action.label}
            href={action.href}
            variant={
              action.label.includes("Download") ? "secondary" : "primary"
            }
          >
            {action.label}
          </ButtonLink>
        ))}
      </div>
    </section>
  );
}
