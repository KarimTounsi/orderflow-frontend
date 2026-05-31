
import { useSyncExternalStore } from "react";

const SESSION_KEY = "orderflow_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useSessionId(): string {
  return useSyncExternalStore(
    () => () => {},        // subscribe: sessionId nie zmienia się w trakcie życia strony
    () => getSessionId(),  // snapshot klienta
    () => "",              // snapshot serwera (SSR)
  );
}
