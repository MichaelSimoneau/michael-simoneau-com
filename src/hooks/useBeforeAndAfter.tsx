import React, { createContext, RefObject, useMemo, useRef } from "react";
import { BlogData } from "../features/blog/data/posts";

export type BeforeAndAfterValue = string | Record<string, string> | BlogData;

const MARCH_12_2026_9_15_AM = new Date(2026, 2, 12, 9, 30, 0, 0);
const MARCH_17_2026_10_00_AM = new Date(2026, 2, 17, 10, 0, 0, 0);

/**
 * useBeforeAndAfter
 *
 * Returns either the `before` or `after` string, depending on whether the current time
 * is before or after the provided `when` timestamp (local time).
 *
 * @param when - The Date or timestamp to compare against (default: March 12th 2026, 9:15AM local time)
 * @param before - The string to return if the current time is BEFORE the `when` date
 * @param after - The string to return if the current time is AFTER the `when` date
 *
 * Usage:
 *   const message = useBeforeAndAfter({
 *     when: new Date(2026, 2, 12, 9, 15), // Months are zero-indexed
 *     before: 'Not time yet!',
 *     after: 'It happened!',
 *   });
 */
function beforeAndAfter<
  T extends string | Record<string, string> | (() => void),
>({
  when = { current: MARCH_12_2026_9_15_AM } as RefObject<Date>,
  before,
  after,
  start,
  end,
}: {
  when?: RefObject<Date>;
  before: T;
  after: T;
  start?: T;
  end?: T;
}): T {
  const now = new Date();
  const value = now.getTime() < when.current.getTime() ? before : after;
  if (typeof value === "string") {
    if (start && end) {
      return `${start} ${value} ${end}` as T;
    }
    if (start) {
      return `${start} ${value}` as T;
    }
    if (end) {
      return `${value} ${end}` as T;
    }
    return value as T;
  }
  const objStart = start ?? {};
  const objEnd = end ?? {};
  const objValue = value as Record<string, string>;
  if (start && end) {
    return { ...objStart, ...objValue, ...objEnd } as T;
  }
  if (start) {
    return { ...objStart, ...objValue } as T;
  }
  if (end) {
    return { ...objValue, ...objEnd } as T;
  }
  return { ...objStart, ...objValue, ...objEnd } as T;
}

export type BeforeAndAfterContext<T extends BeforeAndAfterValue> = {
  output: T;
  when: Date;
  before: BeforeAndAfterValue;
  after: BeforeAndAfterValue;
  start: BeforeAndAfterValue;
  end: BeforeAndAfterValue;
  setWhen: (when: Date) => void;
  setBefore: (before: BeforeAndAfterValue) => void;
  setAfter: (after: BeforeAndAfterValue) => void;
  setStart: (start: BeforeAndAfterValue) => void;
  setEnd: (end: BeforeAndAfterValue) => void;
};

const BeforeAndAfterContext = createContext<BeforeAndAfterContext<BeforeAndAfterValue> | undefined>(
  undefined,
);

const BeforeAndAfterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const whenRef = useRef<Date>(MARCH_12_2026_9_15_AM);
  const [output, _setOutput] = React.useState<BeforeAndAfterValue>(null as unknown as BeforeAndAfterValue);
  const [before, _setBefore] = React.useState<BeforeAndAfterValue>("");
  const [after, _setAfter] = React.useState<BeforeAndAfterValue>("");
  const [start, _setStart] = React.useState<BeforeAndAfterValue>("");
  const [end, _setEnd] = React.useState<BeforeAndAfterValue>("");
  const setWhen = React.useCallback((when: Date) => {
    whenRef.current = when;
    _setOutput(getOutput());
  }, []);
  const setBefore = React.useCallback((before: BeforeAndAfterValue) => {
    _setBefore(before);
  }, []);
  const setAfter = React.useCallback((after: BeforeAndAfterValue) => {
    _setAfter(after);
  }, []);
  const setStart = React.useCallback((start: BeforeAndAfterValue) => {
    _setStart(start);
  }, []);
  const setEnd = React.useCallback((end: BeforeAndAfterValue) => {
    _setEnd(end);
  }, []);
  const getOutput = React.useCallback(() => {
    return new Date() < whenRef.current ? before : after;
  }, [before, after]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (whenRef.current < new Date()) {
        _setOutput(getOutput());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getOutput, _setOutput]);
  const value = useMemo(
    () => ({
      output,
      when: whenRef.current,
      before,
      after,
      start,
      end,
      setWhen,
      setBefore,
      setAfter,
      setStart,
      setEnd,
    }),
    [
      output,
      before,
      after,
      start,
      end,
      setWhen,
      setBefore,
      setAfter,
      setStart,
      setEnd,
    ],
  );
  return (
    <BeforeAndAfterContext.Provider value={value}>
      {children}
    </BeforeAndAfterContext.Provider>
  );
};

const useBeforeAndAfter = <T extends BeforeAndAfterValue>(): BeforeAndAfterContext<T> => {
  const context = React.useContext(BeforeAndAfterContext)
  if (!context) {
    throw new Error(
      "useBeforeAndAfter must be used within a BeforeAndAfterProvider",
    );
  }
  if (null === (context as BeforeAndAfterContext<T>)) {
    throw new Error(
      `${typeof context} is not a BeforeAndAfterContext<T>`,
    );
  }
  return context as BeforeAndAfterContext<T>;
};

export {
  beforeAndAfter,
  MARCH_12_2026_9_15_AM,
  MARCH_17_2026_10_00_AM as MARCH_17_2026_10_00_AM,
  BeforeAndAfterProvider,
  useBeforeAndAfter,
};
