// Google reCAPTCHA, browser side. Two modes, chosen by which keys are set in Vercel:
//
//   "checkbox"  reCAPTCHA v2 "I'm not a robot" tickbox, shown on the last step of the quote form.
//               Keys: NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY + RECAPTCHA_CHECKBOX_SECRET_KEY (v2 Checkbox type)
//   "v3"        invisible, score-based.
//               Keys: NEXT_PUBLIC_RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY (Score based / v3 type)
//
// If the checkbox keys are set, the checkbox is used. The Google script is loaded only when a visitor starts
// using the form, so it never slows down page loads.

export const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();
export const RECAPTCHA_CHECKBOX_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY || "").trim();
export const RECAPTCHA_MODE: "checkbox" | "v3" | "off" = RECAPTCHA_CHECKBOX_SITE_KEY ? "checkbox" : RECAPTCHA_SITE_KEY ? "v3" : "off";

export type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (key: string, opts: { action: string }) => Promise<string>;
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};
export const grecaptcha = () => (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;

let loading: Promise<void> | null = null;

/** Loads the reCAPTCHA script once. Safe to call many times. */
export function loadRecaptcha(): Promise<void> {
  if (RECAPTCHA_MODE === "off" || typeof window === "undefined") return Promise.resolve();
  if (!loading)
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        RECAPTCHA_MODE === "checkbox"
          ? "https://www.google.com/recaptcha/api.js?render=explicit"
          : `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null;
        s.remove();
        reject(new Error("recaptcha_load_failed"));
      };
      document.head.appendChild(s);
    });
  return loading;
}

export const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("recaptcha_timeout")), ms))]);

/** A fresh token for one submit (tokens expire after 2 minutes, so this runs at submit time). "" when off or unavailable. */
export async function recaptchaToken(action: string): Promise<string> {
  if (RECAPTCHA_MODE !== "v3") return "";
  try {
    await withTimeout(loadRecaptcha(), 8000);
    const g = grecaptcha();
    if (!g) return "";
    await withTimeout(new Promise<void>((r) => g.ready(r)), 8000);
    return await withTimeout(g.execute(RECAPTCHA_SITE_KEY, { action }), 8000);
  } catch (err) {
    // visible in the browser's DevTools console, to help diagnose a blocked script or a key/domain problem
    console.warn("[reCAPTCHA] no token:", err instanceof Error ? err.message : err);
    return "";
  }
}
