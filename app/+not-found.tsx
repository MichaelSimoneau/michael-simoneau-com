import { Redirect, usePathname } from "expo-router";
import { useMemo } from "react";
import {
  useFoundationBoundary,
  useFoundationPageView,
} from "../src/foundation";

export default function NotFound() {
  const pathname = usePathname();
  const matchesMelindaPattern = /.*(melinda|francis).*/ig.test(pathname);
  const shouldRedirectToMelindaRoute = matchesMelindaPattern;
  const redirectTarget = shouldRedirectToMelindaRoute
    ? "/melinda"
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
