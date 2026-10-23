// Google reCAPTCHA v2 "I'm not a robot" checkbox, browser side. Switched on by NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY.
// The Google script loads only when the visitor reaches the review step, so it never slows down page loads.

export const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY || "").trim();

type Grecaptcha = {
  ready: (cb: () => void) => void;
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};
export const grecaptcha = () => (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;

let loading: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") return Promise.resolve();
  if (!loading)
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
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

export const withTimeout = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("recaptcha_timeout")), ms))]);
