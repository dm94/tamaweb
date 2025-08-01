import { useEffect } from "react";
import { config } from '@/config';

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> },
    ) => void;
  }
}

// Type for event props
interface EventProps {
  [key: string]: string | number | boolean | Record<string, unknown>;
}

export const initPlausible = (): void => {
  const PLAUSIBLE_URL = config.PLAUSIBLE_URL;

  if (!PLAUSIBLE_URL || PLAUSIBLE_URL.length <= 0) {
    return;
  }

  const script = document.querySelector(`script[src*="${PLAUSIBLE_URL}"]`);
  if (script) {
    return;
  }

  const element = document.createElement("script");
  element.src = PLAUSIBLE_URL;
  element.defer = true;
  element.setAttribute("data-domain", document.location.hostname);
  document.head.appendChild(element);
};

export const usePageTracking = (): void => {
  useEffect(() => {
    initPlausible();
  }, []);
};

export enum AnalyticsEvent {
  SHARE = "share",
  SEARCH = "search",
  MODAL = "modal",
}

/**
 * Send an event to Plausible analytics
 * @param eventName - The name of the event
 * @param options - Optional event properties
 */
export const sendEvent = (
  eventName: AnalyticsEvent,
  props?: EventProps,
): void => {
  initPlausible();

  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, { props });
  }
};
