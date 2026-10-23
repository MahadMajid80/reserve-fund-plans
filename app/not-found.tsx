import type { Metadata } from "next";
import { NotFoundView } from "@/components/pages/NotFoundView";

export const metadata: Metadata = { title: { absolute: "Page not found | Reserve Fund Plans" }, robots: { index: false, follow: true } };

export default function NotFound() {
  return <NotFoundView />;
}
