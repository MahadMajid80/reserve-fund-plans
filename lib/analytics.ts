// Thin GA4 wrapper. Does nothing until NEXT_PUBLIC_GA_ID is set (see components/Analytics.tsx).
type Gtag = (...args: unknown[]) => void;

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (g) g("event", event, params);
}
