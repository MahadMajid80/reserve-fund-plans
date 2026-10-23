"use client";

import { useEffect, useState } from "react";
import { org } from "@/lib/site";

/** The email address is assembled in the browser, so it never appears in the HTML for scrapers. */
export function Email({ className }: { className?: string }) {
  const [addr, setAddr] = useState("");
  useEffect(() => setAddr(`${org.emailUser}@${org.emailDomain}`), []);
  if (!addr) return <span className={className}>our office email</span>;
  return (
    <a href={`mailto:${addr}`} className={className}>
      {addr}
    </a>
  );
}
