/** The mark: five rising ledger columns on a eucalypt tile, the last one in ochre: a plan that builds over time. */
export function Mark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="3" fill="#1f4a40" />
      <g fill="#f7f4ec">
        <rect x="8" y="24" width="3.5" height="6" />
        <rect x="13.5" y="21" width="3.5" height="9" />
        <rect x="19" y="18" width="3.5" height="12" />
        <rect x="24.5" y="14" width="3.5" height="16" />
      </g>
      <rect x="30" y="9" width="3.5" height="21" fill="#e07a4b" />
      <rect x="7" y="31.5" width="27.5" height="1.5" fill="#f7f4ec" opacity=".55" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Mark className="size-9 shrink-0 sm:size-10" />
      <span className={`flex flex-col leading-none ${light ? "text-white" : "text-eucalypt"}`}>
        <span className="display text-[1.15rem] font-semibold tracking-tight sm:text-[1.35rem]">Reserve Fund Plans</span>
        <span className={`mt-1 hidden text-[0.68rem] sm:block font-semibold tracking-[0.16em] uppercase ${light ? "text-white/70" : "text-mute"}`}>Strata compliance · Western Australia</span>
      </span>
    </span>
  );
}
