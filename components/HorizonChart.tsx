/**
 * The homepage's signature graphic: an illustrative ten-year reserve fund, drawn in SVG (no chart library).
 * Columns are yearly contributions; ochre blocks are planned capital works; the line is the fund balance.
 * It is labelled as illustrative so it is never read as real figures.
 */
const years = Array.from({ length: 10 }, (_, i) => i + 1);
const contrib = 10; // steady yearly contribution (arbitrary units)
const works: Record<number, number> = { 3: 18, 6: 26, 9: 22 }; // planned spend in years 3, 6 and 9
const balance = years.reduce<number[]>((acc, y) => [...acc, (acc.at(-1) ?? 8) + contrib - (works[y] ?? 0)], []);

export function HorizonChart() {
  const W = 520;
  const H = 300;
  const left = 34;
  const base = 230;
  const step = (W - left - 16) / 10;
  const scale = 4.2;
  const pts = balance.map((b, i) => `${left + step * i + step / 2},${base - b * scale}`).join(" ");

  return (
    <figure className="relative border border-line bg-white p-5 shadow-[0_30px_60px_-30px_rgb(18_48_42/0.35)] sm:p-7">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="kicker text-eucalypt">A 10-year plan, at a glance</span>
        <span className="text-xs text-mute">Years 1–10 · illustrative only</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-labelledby="hc-t hc-d">
        <title id="hc-t">Illustrative ten-year reserve fund</title>
        <desc id="hc-d">
          Steady yearly contributions build the fund, which pays for planned capital works in years three, six and nine without a special levy.
        </desc>
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1={left} x2={W - 10} y1={base - g * 50} y2={base - g * 50} stroke="#1b201e" strokeOpacity={g ? 0.08 : 0.4} />
        ))}
        {years.map((y, i) => {
          const x = left + step * i + step * 0.22;
          const w = step * 0.56;
          const spend = works[y];
          return (
            <g key={y}>
              <rect className="chart-bar" style={{ animationDelay: `${i * 60}ms` }} x={x} y={base - contrib * scale} width={w} height={contrib * scale} fill="#9db3a5" />
              {spend && <rect className="chart-bar" style={{ animationDelay: `${300 + i * 60}ms` }} x={x} y={base + 6} width={w} height={spend * 1.5} fill="#b5562e" />}
              <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#5e6762" fontFamily="var(--font-instrument), sans-serif">
                {y}
              </text>
            </g>
          );
        })}
        <polyline className="chart-line" pathLength={1} points={pts} fill="none" stroke="#1f4a40" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {balance.map((b, i) => (
          <circle key={i} cx={left + step * i + step / 2} cy={base - b * scale} r="3.5" fill="#fff" stroke="#1f4a40" strokeWidth="2" />
        ))}
        <text x={left - 6} y={base + 4} textAnchor="end" fontSize="11" fill="#5e6762">
          0
        </text>
      </svg>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-graphite">
        <li className="flex items-center gap-2">
          <span className="size-3 bg-sage" aria-hidden="true" /> Yearly contributions
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 bg-ochre" aria-hidden="true" /> Planned capital works
        </li>
        <li className="flex items-center gap-2">
          <span className="h-[3px] w-4 bg-eucalypt" aria-hidden="true" /> Fund balance
        </li>
      </ul>
    </figure>
  );
}
