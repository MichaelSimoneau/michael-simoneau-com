import React from "react";
import { MainNav } from "../layout/MainNav";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { Seo } from "../foundation/seo/Seo";
import { MainPageSections } from "./main-page/MainPageSections";
import { useMainPageController } from "./main-page/useMainPageController";

export const MainPage: React.FC = () => {
  const {
    contactSectionRef,
    footerExpansionFactor,
    footerInitialHeightPx,
    keywords,
    latestBlog,
    mainScrollContainerId,
    scrollContainerRef,
    sectionWrapperClasses,
    structuredData,
  } = useMainPageController();

  return (
    <>
      <Seo
        title="Michael Simoneau | Architect of Zeroth Theory (#ZerothTheory)"
        description="From enterprise architecture at JPMorgan and StoneX to building The Human Dollar (#THD): The Anti-Currency that does not replace money, costs $1, and preserves your $1 principal via a redemption floor. Built on Zeroth Theory and Crypto Fabric."
        canonicalUrl="https://www.michaelsimoneau.com/"
        keywords={keywords}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={[
          ...structuredData,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.michaelsimoneau.com/",
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Enigma Key Industries, LLC",
            url: "https://www.michaelsimoneau.com/",
            logo: "https://www.michaelsimoneau.com/profile-image.png",
            founder: {
              "@type": "Person",
              name: "Michael Simoneau",
            },
            foundingDate: "2019",
            description:
              "Enigma Key Industries, LLC — founded by Michael Simoneau — is the parent entity behind The Human Dollar (#THD), Zeroth Theory, and Crypto Fabric.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Los Angeles",
              addressRegion: "CA",
              addressCountry: "US",
            },
          },
        ]}
      />
      <AnimatedBackground />
      <div
        ref={scrollContainerRef}
        id={mainScrollContainerId}
        className="text-white h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10"
      >
        <MainNav scrollContainerId={mainScrollContainerId} />
        <MainPageSections
          contactSectionRef={contactSectionRef}
          footerExpansionFactor={footerExpansionFactor}
          footerInitialHeightPx={footerInitialHeightPx}
          latestBlog={latestBlog}
          sectionWrapperClasses={sectionWrapperClasses}
        />
      </div>
    </>
  );
};
