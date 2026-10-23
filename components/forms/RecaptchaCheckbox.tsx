"use client";

import { useEffect, useRef, useState } from "react";
import { grecaptcha, loadRecaptcha, RECAPTCHA_SITE_KEY, withTimeout } from "@/lib/recaptcha";

/** reCAPTCHA v2 checkbox. Calls onToken with the token when ticked, and "" when it expires or fails. */
export function RecaptchaCheckbox({ onToken, widgetId, error }: { onToken: (t: string) => void; widgetId: React.RefObject<number | null>; error?: string }) {
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
          sitekey: RECAPTCHA_SITE_KEY,
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
      {failed && <p className="mt-2 text-sm text-graphite">The “I’m not a robot” check couldn’t load. Check your connection or ad blocker, or call us instead.</p>}
      {error && (
        <p id="q-captcha-err" className="mt-2 text-sm font-semibold text-ochre-deep">
          {error}
        </p>
      )}
    </div>
  );
}
