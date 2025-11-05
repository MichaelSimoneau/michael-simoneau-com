declare namespace jest {
  interface Matchers<R> {
    toBeTruthy(): R;
    toEqual(expected: unknown): R;
  }
}

declare const expect: <T = unknown>(
  value: T,
) => {
  toBeTruthy(): void;
  toEqual(expected: unknown): void;
};

declare const jest: {
  fn<T extends (...args: unknown[]) => unknown>(implementation?: T): T;
};
