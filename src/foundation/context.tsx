import { Appearance } from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultFoundationConfig } from './defaultConfig';
import type {
  Foundation,
  FoundationBoundary,
  FoundationProviderProps,
} from './types';
import { resolveDefaultRuntime } from './runtime';
import { deepMerge } from './utils';

const FoundationContext = createContext<Foundation>(defaultFoundationConfig);

export const FoundationProvider = ({
  config,
  children,
}: FoundationProviderProps) => {
  const [boundaries, setBoundaries] = useState<FoundationBoundary[]>([]);
  const [runtime, setRuntime] = useState(() => resolveDefaultRuntime());

  const mergedConfig = useMemo(() => {
    return deepMerge(defaultFoundationConfig, {
      ...config,
      runtime,
    });
  }, [config, runtime]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setRuntime((current) => ({
        ...current,
        colorScheme: colorScheme ?? current.colorScheme,
      }));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const registerBoundary = useCallback<Foundation['registerBoundary']>(
    (boundary) => {
      setBoundaries((current) => {
        const existingIndex = current.findIndex(
          (item) => item.id === boundary.id,
        );
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = { ...next[existingIndex], ...boundary };
          return next;
        }
        return [...current, boundary];
      });
    },
    [],
  );

  const value = useMemo<Foundation>(
    () => ({
      ...mergedConfig,
      boundaries,
      registerBoundary,
    }),
    [mergedConfig, boundaries, registerBoundary],
  );

  return (
    <FoundationContext.Provider value={value}>
      {children}
    </FoundationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hooks can share the provider file
export const useFoundation = () => {
  const context = useContext(FoundationContext);
  if (!context) {
    throw new Error('useFoundation must be used inside a FoundationProvider');
  }
  return context;
};
