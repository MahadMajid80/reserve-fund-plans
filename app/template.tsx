import { PageCurtain } from "@/components/Chrome";

// Re-mounts on every navigation, so each page plays its entry curtain.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageCurtain>{children}</PageCurtain>;
}
