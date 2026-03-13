import { Redirect, usePathname } from "expo-router";
import { useMemo } from "react";
import {
  useFoundationBoundary,
  useFoundationPageView,
} from "../src/foundation";

export default function NotFound() {
  const pathname = usePathname();
  const normalizedPathname = pathname.toLowerCase();
  const hasMsPrefix = normalizedPathname.includes("ms.");
  const matchesMelindaPattern = /melinda.*(francis)?/.test(normalizedPathname);
  const shouldRedirectToMelindaRoute = hasMsPrefix || matchesMelindaPattern;
  const redirectTarget = shouldRedirectToMelindaRoute
    ? hasMsPrefix
      ? "/melinda"
      : "/Dr.MelindaFrancis.com"
    : "/";

  const boundary = useMemo(
    () => ({
      id: "not-found",
      label: "Signal Lost",
      description:
        "Fallback route presented when no Expo Router path resolves.",
      href: "/",
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    "page:view:not-found",
    {
      pathname,
    },
    {
      deps: [pathname, redirectTarget, shouldRedirectToMelindaRoute],
    },
  );

  return <Redirect href={redirectTarget} />;
}
