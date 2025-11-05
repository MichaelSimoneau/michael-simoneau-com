import { ContactSection } from "./sections/ContactSection";
import { HeroSection } from "./sections/HeroSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { TransformationSection } from "./sections/TransformationSection";
import { ProgramsSection } from "./sections/ProgramsSection";
import { PrinciplesSection } from "./sections/PrinciplesSection";

export default function App() {
  return (
    <main
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "80px clamp(16px, 6vw, 48px)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <HeroSection />
      <CapabilitiesSection />
      <TransformationSection />
      <ProgramsSection />
      <PrinciplesSection />
      <ContactSection />
      <footer
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          padding: "24px 0 0",
        }}
      >
        © {new Date().getFullYear()} Michael Simoneau • MetLife Digital
        Platform Initiative
      </footer>
    </main>
  );
}
