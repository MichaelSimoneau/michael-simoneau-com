import { Redirect, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { useFoundationBoundary, useFoundationPageView } from '../src/foundation';

export default function NotFound() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/+$/, '').toLowerCase();
  const shouldRedirectToMelindaRoute = normalizedPath.match(/\/(dr\.)?melinda(francis)?(\.com)?/ig);

  const boundary = useMemo(
    () => ({
      id: 'not-found',
      label: 'Signal Lost',
      description: 'Fallback route presented when no Expo Router path resolves.',
      href: '/',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView(
    'page:view:not-found',
    {
      pathname,
    },
    {
      deps: [pathname],
    },
  );

  if (shouldRedirectToMelindaRoute) {
    return <Redirect href="/Dr.MelindaFrancis.com" />;
  }

  return <Redirect href="/" />;
}
