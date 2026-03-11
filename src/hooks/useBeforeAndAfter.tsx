import React, { createContext } from "react";

const MARCH_12_2026_9_15_AM = new Date(2026, 2, 12, 9, 30, 0, 0);
const MARCH_12_2026_12_00_PM = new Date(2026, 2, 12, 12, 0, 0, 0);

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
function beforeAndAfter<T extends string | Record<string, string>>({
  when = MARCH_12_2026_9_15_AM,
  before,
  after,
  start,
  end,
}: {
  when?: Date;
  before: T;
  after: T;
  start?: T;
  end?: T;
}): T {
  const now = new Date();
  const value = now.getTime() < when.getTime() ? before : after;
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

type BeforeAndAfterValue = string | Record<string, string>;

type BeforeAndAfterContextValue = {
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

const BeforeAndAfterContext = createContext<BeforeAndAfterContextValue | undefined>(undefined);

const BeforeAndAfterProvider = ({ children }: { children: React.ReactNode }) => {
  const [when, _setWhen] = React.useState(MARCH_12_2026_9_15_AM);
  const [before, _setBefore] = React.useState<BeforeAndAfterValue>("");
  const [after, _setAfter] = React.useState<BeforeAndAfterValue>("");
  const [start, _setStart] = React.useState<BeforeAndAfterValue>("");
  const [end, _setEnd] = React.useState<BeforeAndAfterValue>("");
  const setWhen = React.useCallback((when: Date) => {
    _setWhen(when);
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
  React.useEffect(() => {
    const interval = setInterval(() => {
      _setWhen(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const value = React.useMemo(() => ({
    when,
    before,
    after,
    start,
    end,
    setWhen,
    setBefore,
    setAfter,
    setStart,
    setEnd,
  }), [when, before, after, start, end, setWhen, setBefore, setAfter, setStart, setEnd]);
  return <BeforeAndAfterContext.Provider value={value}>{children}</BeforeAndAfterContext.Provider>;
};

const useBeforeAndAfter = () => {
  const context = React.useContext(BeforeAndAfterContext);
  if (!context) {
    throw new Error("useBeforeAndAfter must be used within a BeforeAndAfterProvider");
  }
  return context;
};

export { 
    beforeAndAfter, 
    MARCH_12_2026_9_15_AM, 
    MARCH_12_2026_12_00_PM,
    BeforeAndAfterProvider,
    useBeforeAndAfter,
};
