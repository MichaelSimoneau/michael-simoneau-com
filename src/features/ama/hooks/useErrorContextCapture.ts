import { useEffect } from "react";

const MAX_ERRORS = 12;
const errorBuffer: string[] = [];

function pushError(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return;
  errorBuffer.unshift(normalized.slice(0, 320));
  if (errorBuffer.length > MAX_ERRORS) {
    errorBuffer.length = MAX_ERRORS;
  }
}

export function getRecentAmaErrorContext(limit = 5): string[] {
  return errorBuffer.slice(0, Math.max(1, Math.min(limit, MAX_ERRORS)));
}

export function useErrorContextCapture(): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onError = (event: ErrorEvent) => {
      const source = event.filename ? ` @ ${event.filename}` : "";
      pushError(`${event.message}${source}`);
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        typeof event.reason === "string"
          ? event.reason
          : event.reason instanceof Error
            ? event.reason.message
            : JSON.stringify(event.reason);
      pushError(`UnhandledRejection: ${reason}`);
    };

    const onAppError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      if (customEvent.detail?.message) {
        pushError(`AppError: ${customEvent.detail.message}`);
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("app:error", onAppError as EventListener);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("app:error", onAppError as EventListener);
    };
  }, []);
}
