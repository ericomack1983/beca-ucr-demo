/**
 * Costa Rica flag icon — 5-stripe horizontal layout (blue/white/red/white/blue)
 * Standard ratio 5:3 (width:height). Renders as a sleek rounded badge.
 */
export function CRFlag({ width = 38 }: { width?: number }) {
  const h = Math.round(width * 3 / 5);
  const p = h / 6; // one stripe unit

  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: 3,
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none">
        {/* Blue base covers top + bottom stripe */}
        <rect width={width} height={h} fill="#003DA5" />
        {/* White stripe 2 */}
        <rect y={p} width={width} height={p} fill="#FFFFFF" />
        {/* Red center (2 units) */}
        <rect y={p * 2} width={width} height={p * 2} fill="#CE1126" />
        {/* White stripe 4 */}
        <rect y={p * 4} width={width} height={p} fill="#FFFFFF" />
        {/* Bottom blue = base rect */}
        {/* Subtle top-left shine */}
        <rect
          width={width}
          height={h}
          fill="url(#cr-shine)"
        />
        <defs>
          <linearGradient id="cr-shine" x1="0" y1="0" x2={width} y2={h} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="0.12" />
            <stop offset="60%"  stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
