declare module 'expo-router' {
  import * as React from 'react';

  export type Href<TPath extends string = string> = TPath;

  export type LinkProps = {
    href: Href<string>;
    asChild?: boolean;
    children?: React.ReactNode;
    style?: unknown;
  } & Record<string, unknown>;

  export const Link: React.ComponentType<LinkProps>;
  export const Stack: React.ComponentType<{
    screenOptions?: Record<string, unknown>;
  }>;

  export function useLocalSearchParams<
    T extends Record<string, string | string[] | undefined>,
  >(): T;
  export function useRouter(): { replace: (path: string) => void };
  export function usePathname(): string;
}
