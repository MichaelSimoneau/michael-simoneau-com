/**
 * Shim that maps react-router-dom APIs to expo-router equivalents.
 * Metro config aliases 'react-router-dom' to this file so the original
 * DOM-based components work under Expo Router without source changes.
 */
import { usePathname, useRouter, useLocalSearchParams, Slot } from 'expo-router';
import React, { forwardRef, useCallback } from 'react';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children?: React.ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function ShimLink({ to, onClick, children, ...rest }, ref) {
    const router = useRouter();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(e);
        if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
          e.preventDefault();
          router.push(to as any);
        }
      },
      [onClick, router, to],
    );

    return (
      <a href={to} onClick={handleClick} ref={ref} {...rest}>
        {children}
      </a>
    );
  },
);

export function useLocation() {
  const pathname = usePathname();
  return { pathname, search: '', hash: '', state: null, key: 'default' };
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      router.back();
    } else if (options?.replace) {
      router.replace(to as any);
    } else {
      router.push(to as any);
    }
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  return useLocalSearchParams() as unknown as T;
}

export function useRouteError() {
  return null;
}

export { Slot as Outlet };

export const ScrollRestoration: React.FC = () => null;
