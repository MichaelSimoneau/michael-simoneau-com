declare module 'expo-router' {
  import type { ComponentType, MouseEventHandler, ReactNode } from 'react';

  export type Href = string | { pathname: string; params?: Record<string, string | number | undefined> };

  export interface LinkProps {
    href: Href;
    asChild?: boolean;
    className?: string;
    style?: any;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  }

  export const Link: ComponentType<LinkProps>;
  export const Slot: ComponentType<any>;
  export const Redirect: ComponentType<{ href: Href }>;

  export const usePathname: () => string;
  export const useRouter: () => {
    push: (href: Href) => void;
    replace: (href: Href) => void;
    back: () => void;
  };
  export const useLocalSearchParams: <T extends Record<string, string | undefined> = Record<string, string | undefined>>() => T;
}
