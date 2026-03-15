import React from "react";
import { AnimatedBackground } from "../../backgrounds/AnimatedBackground";
import { HeroSection } from "../../features/profile/components/HeroSection";
import { MainNav } from "../../layout/MainNav";

const LEGAL_SCROLL_CONTAINER_ID = "new-main-page-scroll-container";

interface LegalPageFrameProps {
  children: React.ReactNode;
}

export const LegalPageFrame: React.FC<LegalPageFrameProps> = ({ children }) => {
  return (
    <>
      <AnimatedBackground />
      <div
        id={LEGAL_SCROLL_CONTAINER_ID}
        className="text-white h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10"
      >
        <MainNav scrollContainerId={LEGAL_SCROLL_CONTAINER_ID} />
        <HeroSection />
        <section className="relative z-10 px-4 pb-20">
          {children}
        </section>
      </div>
    </>
  );
};
