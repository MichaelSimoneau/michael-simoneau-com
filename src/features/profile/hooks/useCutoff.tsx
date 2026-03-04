import React from "react";
import { toDate } from "date-fns-tz";

export const melindaContext = React.createContext<{
  cutoff: React.RefObject<boolean | null>;
}>({
  cutoff: React.createRef<boolean | null>(),
});

export const MelindaMessageCutoffProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const melindaMessageCutoff = React.useMemo(
    () =>
      toDate(new Date("2026-03-05T09:30:00"), { timeZone: "America/New_York" }),
    [],
  );
  const cutoff = React.useRef<boolean | null>(null);
  cutoff.current = new Date() > melindaMessageCutoff;
  React.useEffect(() => {
    const interval = setInterval(() => {
      cutoff.current = new Date() > melindaMessageCutoff;
    }, 1000);
    return () => clearInterval(interval);
  }, [melindaMessageCutoff]);
  return (
    <melindaContext.Provider value={{ cutoff }}>
      {children}
    </melindaContext.Provider>
  );
};

export const useAfterCutoff: () => boolean | null = () => {
  if (!React.useContext(melindaContext)) {
    throw new Error("useCutoff must be used within a MelindaMessageCutoffProvider");
  }
  return React.useContext(melindaContext).cutoff.current;
};
