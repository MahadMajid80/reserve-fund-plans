"use client";

import { useEffect, useRef, useState } from "react";
import { grecaptcha, loadRecaptcha, RECAPTCHA_CHECKBOX_SITE_KEY, withTimeout } from "@/lib/recaptcha";

/**
 * Google reCAPTCHA v2 "I'm not a robot" tickbox. Calls onToken with the response token when ticked,
 * and with "" when it expires or errors. widgetId lets the form reset it after each submit (tokens are single-use).
 */
export function RecaptchaCheckbox({ onToken, widgetId, error }: { onToken: (t: string) => void; widgetId: React.MutableRefObject<number | null>; error?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    withTimeout(loadRecaptcha(), 10000)
      .then(() => withTimeout(new Promise<void>((r) => grecaptcha()!.ready(r)), 10000))
      .then(() => {
        const box = el.current;
        if (cancelled || !box || box.childElementCount) return;
        widgetId.current = grecaptcha()!.render(box, {
          sitekey: RECAPTCHA_CHECKBOX_SITE_KEY,
          // the full-size widget is 304px wide; use the compact one on very narrow phones
          size: box.offsetWidth < 304 ? "compact" : "normal",
          callback: (t: string) => onToken(t),
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      widgetId.current = null;
      onToken("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8">
      <div ref={el} id="q-captcha" tabIndex={-1} className="min-h-[78px] outline-none" aria-describedby={error ? "q-captcha-err" : undefined} />
      {failed && (
        <p className="mt-2 text-sm text-graphite">The “I’m not a robot” check couldn’t load. Please check your connection or ad blocker, or call us instead.</p>
      )}
      {error && (
        <p id="q-captcha-err" className="mt-2 text-sm font-semibold text-oxblood">
          {error}
        </p>
      )}
    </div>
  );
}
