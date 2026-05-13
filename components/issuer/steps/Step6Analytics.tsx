'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { FlowStudent, CardConfig } from '@/types/issuer-flow';

/* ─── helpers ─── */

function fmt(n: number) {
  return `₡${n.toLocaleString('es-CR')}`;
}
function fmtM(n: number) {
  if (n >= 1_000_000) return `₡${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₡${Math.round(n / 1_000)}K`;
  return fmt(n);
}

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const GAP = 2;
  const s = polarXY(cx, cy, r, a0 + GAP / 2);
  const e = polarXY(cx, cy, r, a1 - GAP / 2);
  const large = a1 - a0 - GAP > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/* ─── categories ─── */

const CATS = [
  { id: 'edu',   label: 'Educación',    color: '#1434CB', pct: 35, yoy: +8.2  },
  { id: 'food',  label: 'Alimentación', color: '#FCC015', pct: 28, yoy: +12.4 },
  { id: 'trx',   label: 'Transporte',   color: '#3B82F6', pct: 18, yoy: +5.7  },
  { id: 'hlth',  label: 'Salud',        color: '#8B5CF6', pct: 12, yoy: +3.1  },
  { id: 'other', label: 'Otros',        color: '#94A3B8', pct: 7,  yoy: +1.5  },
];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const CUR_F  = [0.95, 1.02, 0.97, 1.06, 1.03, 1.09];
const PREV_F = [0.80, 0.83, 0.86, 0.84, 0.89, 0.91];

// percent-of-spend data per year
const PCT_DATA: Record<string, { y2024: number; y2025: number; y2026: number }> = {
  edu:   { y2024: 29, y2025: 32, y2026: 35 },
  food:  { y2024: 23, y2025: 26, y2026: 28 },
  trx:   { y2024: 15, y2025: 17, y2026: 18 },
  hlth:  { y2024: 10, y2025: 11, y2026: 12 },
  other: { y2024: 6,  y2025: 7,  y2026: 7  },
};

type ActiveYear = 2024 | 2025 | 2026 | null;

/* ─── AnimatedCounter ─── */

function AnimatedCounter({ to, format }: { to: number; format: (n: number) => string }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => format(Math.round(v)));
  useEffect(() => {
    const ctrl = animate(mv, to, { duration: 1.3, ease: [0.16, 1, 0.3, 1] });
    return () => ctrl.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return <motion.span>{display}</motion.span>;
}

/* ─── Line chart ─── */

const CW = 560; const CH = 155;
const PAD = { t: 14, r: 12, b: 28, l: 54 };
const PW = CW - PAD.l - PAD.r;
const PH = CH - PAD.t - PAD.b;

function pts2path(pts: [number, number][]) {
  return pts.reduce((acc, [x, y], i) => i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
}

function LineChart({ cur, prev }: { cur: number[]; prev: number[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);

  const maxV = Math.max(...cur, ...prev) * 1.18;
  const toXY = (data: number[]): [number, number][] =>
    data.map((v, i) => [
      PAD.l + (i / (data.length - 1)) * PW,
      PAD.t + PH - (v / maxV) * PH,
    ]);

  const curPts  = toXY(cur);
  const prevPts = toXY(prev);
  const gridY   = [0, 0.25, 0.5, 0.75, 1].map(p => ({ y: PAD.t + PH - p * PH, v: p * maxV }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    setMouseX(relX);
    const svgX = (relX / rect.width) * CW;
    const raw = (svgX - PAD.l) / (PW / (MONTHS.length - 1));
    setHoverIdx(Math.max(0, Math.min(MONTHS.length - 1, Math.round(raw))));
  };

  const hi = hoverIdx;
  const pct = hi !== null && prev[hi] > 0
    ? (((cur[hi] - prev[hi]) / prev[hi]) * 100).toFixed(1)
    : null;

  const tooltipX = hi !== null
    ? Math.min(Math.max(mouseX, 60), (containerRef.current?.clientWidth ?? 400) - 120)
    : 0;

  return (
    <div ref={containerRef} className="relative w-full select-none" style={{ height: 168 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1434CB" stopOpacity={0.13} />
            <stop offset="100%" stopColor="#1434CB" stopOpacity={0} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* grid */}
        {gridY.map(({ y, v }, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={CW - PAD.r} y2={y}
              stroke={i === 0 ? '#e2e8f0' : '#f1f5f9'}
              strokeWidth={i === 0 ? 1.5 : 0.8}
              strokeDasharray={i === 0 ? undefined : '4 3'} />
            {i > 0 && (
              <text x={PAD.l - 6} y={y + 4} textAnchor="end"
                fontSize={9} fill="#94a3b8" fontFamily="monospace">
                {fmtM(v)}
              </text>
            )}
          </g>
        ))}

        {/* month labels */}
        {MONTHS.map((m, i) => (
          <text key={m} x={PAD.l + (i / (MONTHS.length - 1)) * PW} y={CH - 5}
            textAnchor="middle" fontSize={9}
            fill={hi === i ? '#1434CB' : '#94a3b8'}
            fontWeight={hi === i ? '700' : '400'}>
            {m}
          </text>
        ))}

        {/* area fill */}
        <motion.path
          d={`${pts2path(curPts)} L ${curPts[curPts.length-1][0]} ${PAD.t+PH} L ${curPts[0][0]} ${PAD.t+PH} Z`}
          fill="url(#aGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }} />

        {/* hover area fill highlight */}
        {hi !== null && (
          <rect x={curPts[hi][0] - PW / (MONTHS.length - 1) / 2} y={PAD.t}
            width={PW / (MONTHS.length - 1)} height={PH}
            fill="#1434CB" fillOpacity={0.04} rx={2} />
        )}

        {/* prev line */}
        <motion.path d={pts2path(prevPts)} fill="none"
          stroke="#cbd5e1" strokeWidth={1.8} strokeDasharray="5 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />

        {/* current line */}
        <motion.path d={pts2path(curPts)} fill="none"
          stroke="#1434CB" strokeWidth={2.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} />

        {/* crosshair */}
        {hi !== null && (
          <line x1={curPts[hi][0]} y1={PAD.t} x2={curPts[hi][0]} y2={PAD.t + PH}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
        )}

        {/* dots – prev */}
        {prevPts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y}
            r={hi === i ? 5 : 2.5}
            fill={hi === i ? '#94a3b8' : '#cbd5e1'} stroke="white" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.2 + i * 0.06 }} />
        ))}

        {/* dots – current */}
        {curPts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y}
            r={hi === i ? 7 : 3.5}
            fill="#1434CB" stroke="white" strokeWidth={hi === i ? 2.5 : 1.5}
            filter={hi === i ? 'url(#glow)' : undefined}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.35 + i * 0.06 }} />
        ))}
      </svg>

      {/* Tooltip */}
      {hi !== null && (
        <div
          className="absolute pointer-events-none z-10 -translate-x-1/2"
          style={{ left: tooltipX, top: 4 }}
        >
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-3.5 py-2.5 min-w-[130px]">
            <p className="text-[10px] font-bold text-slate-700 mb-2">{MONTHS[hi]} 2026</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#1434CB]" />
                  <span className="text-[10px] text-slate-500">2026</span>
                </div>
                <span className="text-[11px] font-bold font-mono text-slate-900">{fmtM(cur[hi])}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-px bg-slate-400" style={{ borderTop: '2px dashed #94a3b8', height: 0 }} />
                  <span className="text-[10px] text-slate-500">2025</span>
                </div>
                <span className="text-[11px] font-bold font-mono text-slate-500">{fmtM(prev[hi])}</span>
              </div>
            </div>
            {pct !== null && (
              <div className={`mt-2 pt-2 border-t border-slate-100 text-[10px] font-bold text-right ${parseFloat(pct) >= 0 ? '' : ''}`} style={{ color: parseFloat(pct) >= 0 ? '#2C6849' : '#d65151' }}>
                {parseFloat(pct) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(pct))}% YoY
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Donut chart ─── */

function DonutChart({ total }: { total: number }) {
  const SIZE = 188; const CX = SIZE / 2; const CY = SIZE / 2;
  const R = 62; const SW = 22;
  const [hoverId, setHoverId] = useState<string | null>(null);

  const segs = useMemo(() => {
    let a = 0;
    return CATS.map(c => {
      const s = a; const e = a + (c.pct / 100) * 360; a = e;
      return { ...c, s, e };
    });
  }, []);

  const hovered = hoverId ? CATS.find(c => c.id === hoverId) : null;
  const centerAmt = hovered ? Math.round(total * hovered.pct / 100) : total;

  return (
    <div className="flex items-center gap-5">
      <div className="shrink-0 relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: 'visible' }}>
          <defs>
            <filter id="segGlow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={SW} />
          {segs.map((seg, i) => {
            const isHov = hoverId === seg.id;
            const isDim = hoverId && !isHov;
            return (
              <motion.path key={seg.id}
                d={arc(CX, CY, R, seg.s, seg.e)}
                fill="none"
                stroke={seg.color}
                strokeLinecap="butt"
                filter={isHov ? 'url(#segGlow)' : undefined}
                style={{ cursor: 'pointer' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isDim ? 0.3 : 1,
                  strokeWidth: isHov ? SW + 7 : SW,
                }}
                transition={{
                  pathLength: { duration: 0.75, delay: 0.25 + i * 0.1, ease: 'easeOut' },
                  opacity: { duration: 0.2 },
                  strokeWidth: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoverId(seg.id)}
                onMouseLeave={() => setHoverId(null)}
              />
            );
          })}
          {/* center label */}
          {hovered ? (
            <>
              <text x={CX} y={CY - 14} textAnchor="middle" fontSize={10} fill={hovered.color} fontWeight="700" fontFamily="system-ui">{hovered.label}</text>
              <text x={CX} y={CY + 4}  textAnchor="middle" fontSize={14} fill="#0f172a" fontWeight="800" fontFamily="monospace">{hovered.pct}%</text>
              <text x={CX} y={CY + 19} textAnchor="middle" fontSize={10} fill="#64748b" fontFamily="monospace">{fmtM(centerAmt)}</text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 7}  textAnchor="middle" fontSize={10} fill="#64748b" fontWeight="600" fontFamily="system-ui">Total</text>
              <text x={CX} y={CY + 9}  textAnchor="middle" fontSize={11} fill="#0f172a" fontWeight="700" fontFamily="monospace">{fmtM(total)}</text>
              <text x={CX} y={CY + 22} textAnchor="middle" fontSize={9}  fill="#94a3b8" fontFamily="system-ui">mensual</text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1 min-w-0">
        {CATS.map(c => {
          const isHov = hoverId === c.id;
          const isDim = hoverId && !isHov;
          return (
            <div key={c.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-pointer transition-all duration-150"
              style={{ background: isHov ? `${c.color}12` : 'transparent', opacity: isDim ? 0.4 : 1 }}
              onMouseEnter={() => setHoverId(c.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c.color }} />
              <span className={`text-[11px] flex-1 truncate transition-colors ${isHov ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{c.label}</span>
              <span className="text-[11px] font-bold font-mono" style={{ color: isHov ? c.color : '#94a3b8' }}>{c.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Category bar table ─── */

function CategoryTable({ total }: { total: number }) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 px-2">
        <span>Categoría MCC</span>
        <span className="text-right">Gasto</span>
        <span className="text-right w-16">Var. YoY</span>
      </div>
      {CATS.map((c, i) => {
        const amount = Math.round(total * c.pct / 100);
        const isHov = hoverId === c.id;
        return (
          <motion.div key={c.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="space-y-1.5 rounded-xl px-2 py-2 cursor-default transition-colors duration-150"
            style={{ background: isHov ? `${c.color}0d` : 'transparent' }}
            onMouseEnter={() => setHoverId(c.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center">
              <div className="flex items-center gap-2 min-w-0">
                <motion.div className="rounded-full shrink-0"
                  style={{ background: c.color }}
                  animate={{ width: isHov ? 10 : 8, height: isHov ? 10 : 8 }}
                  transition={{ duration: 0.15 }}
                />
                <span className={`text-[11px] truncate transition-all ${isHov ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{c.label}</span>
              </div>
              <span className={`text-[11px] font-bold font-mono text-right transition-colors ${isHov ? 'text-slate-900' : 'text-slate-600'}`}>
                {fmtM(amount)}
              </span>
              <span className="text-[11px] font-bold text-right w-16" style={{ color: c.yoy >= 0 ? '#2C6849' : '#d65151' }}>
                {c.yoy >= 0 ? '+' : ''}{c.yoy}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: c.color, boxShadow: isHov ? `0 0 6px ${c.color}80` : 'none' }}
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {isHov && (
              <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-[9px] text-slate-400 font-mono">
                <span>{c.pct}% del total mensual</span>
                <span style={{ color: '#2C6849' }}>↑ vs 2025</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Percent-of-spend dot-plot ─── */

const CW2 = 580; const LEFT2 = 130; const RIGHT2 = 16; const TOP2 = 36;
const ROW2 = 40; const PLOT2 = CW2 - LEFT2 - RIGHT2; const MAX_PCT = 40;

function PercentOfSpendChart() {
  const [active, setActive] = useState<ActiveYear>(null);

  const years: { key: 'y2024' | 'y2025' | 'y2026'; label: string; year: ActiveYear }[] = [
    { key: 'y2024', label: 'Ene (01) – Jun (06) 2024', year: 2024 },
    { key: 'y2025', label: 'Ene (01) – Jun (06) 2025', year: 2025 },
    { key: 'y2026', label: 'Ene (01) – Jun (06) 2026', year: 2026 },
  ];

  const xp = (pct: number) => LEFT2 + (pct / MAX_PCT) * PLOT2;
  const CHART_H = TOP2 + CATS.length * ROW2 + 8;
  const gridPcts = [0, 10, 20, 30, 40];

  function ShapeTooltip({ cx, cy, value }: { cx: number; cy: number; value: number }) {
    return (
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }} style={{ pointerEvents: 'none' }}>
        <rect x={cx - 17} y={cy - 30} width={34} height={15} rx={3} fill="#1e293b" opacity={0.88} />
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize={9} fill="white"
          fontFamily="monospace" fontWeight="600">{value}%</text>
      </motion.g>
    );
  }

  function Square({ cx, cy, fill, delay, value }: { cx: number; cy: number; fill: string; delay: number; value: number }) {
    const [hov, setHov] = useState(false);
    return (
      <g style={{ cursor: 'pointer' }}>
        <motion.rect x={cx - 5} y={cy - 5} width={10} height={10} fill={fill} rx={1}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
            hovered: { scale: 1.9, opacity: 1, transition: { type: 'spring' as const, stiffness: 380, damping: 16 } },
          }}
          initial="hidden" animate={hov ? 'hovered' : 'visible'}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        />
        {hov && <ShapeTooltip cx={cx} cy={cy} value={value} />}
      </g>
    );
  }
  function Circle({ cx, cy, fill, delay, value }: { cx: number; cy: number; fill: string; delay: number; value: number }) {
    const [hov, setHov] = useState(false);
    return (
      <g style={{ cursor: 'pointer' }}>
        <motion.circle cx={cx} cy={cy} r={5.5} fill={fill}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
            hovered: { scale: 1.9, opacity: 1, transition: { type: 'spring' as const, stiffness: 380, damping: 16 } },
          }}
          initial="hidden" animate={hov ? 'hovered' : 'visible'}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        />
        {hov && <ShapeTooltip cx={cx} cy={cy} value={value} />}
      </g>
    );
  }
  function Triangle({ cx, cy, fill, delay, value }: { cx: number; cy: number; fill: string; delay: number; value: number }) {
    const [hov, setHov] = useState(false);
    const pts = `${cx},${cy - 6.5} ${cx + 6},${cy + 5} ${cx - 6},${cy + 5}`;
    return (
      <g style={{ cursor: 'pointer' }}>
        <motion.polygon points={pts} fill={fill}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
            hovered: { scale: 1.9, opacity: 1, transition: { type: 'spring' as const, stiffness: 380, damping: 16 } },
          }}
          initial="hidden" animate={hov ? 'hovered' : 'visible'}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        />
        {hov && <ShapeTooltip cx={cx} cy={cy} value={value} />}
      </g>
    );
  }

  const isVisible = (yr: ActiveYear) => active === null || active === yr;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Porcentaje de gasto</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">Distribución por categoría MCC</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Porcentaje del gasto total acumulado por categoría. Haga clic en un año para resaltarlo.
          </p>
        </div>
        {/* Year selector */}
        <div className="shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Seleccionar año</p>
            {active !== null && (
              <button onClick={() => setActive(null)}
                className="text-[9px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider border border-slate-200 rounded px-2 py-0.5 transition-colors">
                Limpiar
              </button>
            )}
          </div>
          {[
            { year: 2024 as ActiveYear, label: 'Ene (01) – Jun (06) 2024', icon: <rect x="0" y="2" width="10" height="10" rx="1" fill="#94a3b8" /> },
            { year: 2025 as ActiveYear, label: 'Ene (01) – Jun (06) 2025', icon: <circle cx="5" cy="7" r="5" fill="#475569" /> },
            { year: 2026 as ActiveYear, label: 'Ene (01) – Jun (06) 2026', icon: <polygon points="5,0 11,12 -1,12" fill="#1434CB" /> },
          ].map(({ year, label, icon }) => (
            <button key={year} onClick={() => setActive(a => a === year ? null : year)}
              className={`flex items-center gap-2 text-xs transition-all rounded-lg px-2 py-1 w-full text-left ${
                active === year ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-500 hover:bg-slate-50'
              }`}>
              <svg width="12" height="14" viewBox="-2 0 14 14">{icon}</svg>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      <div className="w-full overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${CW2} ${CHART_H}`} preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: 360 }}>
          {/* Grid lines + top axis labels */}
          {gridPcts.map(pct => (
            <g key={pct}>
              <line x1={xp(pct)} y1={TOP2 - 6} x2={xp(pct)} y2={CHART_H - 4}
                stroke={pct === 0 ? '#e2e8f0' : '#f1f5f9'} strokeWidth={1} />
              <text x={xp(pct)} y={TOP2 - 10} textAnchor="middle"
                fontSize={10} fill="#94a3b8" fontFamily="monospace">
                {pct}%
              </text>
            </g>
          ))}

          {/* Rows */}
          {CATS.map((cat, i) => {
            const d = PCT_DATA[cat.id];
            const cy = TOP2 + i * ROW2 + ROW2 / 2;
            return (
              <g key={cat.id}>
                {/* Row separator */}
                <line x1={LEFT2} y1={cy + ROW2 / 2} x2={CW2 - RIGHT2} y2={cy + ROW2 / 2}
                  stroke="#f8fafc" strokeWidth={1} />

                {/* Label */}
                <text x={LEFT2 - 10} y={cy + 4} textAnchor="end"
                  fontSize={11} fill={active ? '#94a3b8' : '#475569'} fontWeight="500"
                  fontFamily="system-ui">
                  {cat.label}
                </text>

                {/* Horizontal track */}
                <line x1={xp(0)} y1={cy} x2={xp(MAX_PCT)} y2={cy}
                  stroke="#e2e8f0" strokeWidth={1} />

                {/* 2024 – square */}
                {isVisible(2024) && (
                  <Square cx={xp(d.y2024)} cy={cy} fill="#94a3b8"
                    delay={0.55 + i * 0.08} value={d.y2024} />
                )}
                {/* 2025 – circle */}
                {isVisible(2025) && (
                  <Circle cx={xp(d.y2025)} cy={cy} fill="#475569"
                    delay={0.6 + i * 0.08} value={d.y2025} />
                )}
                {/* 2026 – triangle */}
                {isVisible(2026) && (
                  <Triangle cx={xp(d.y2026)} cy={cy} fill="#1434CB"
                    delay={0.65 + i * 0.08} value={d.y2026} />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ─── KPI card ─── */

function KpiCard({
  label, to, format, sub, color, bgColor, icon, delay,
}: {
  label: string; to: number; format: (n: number) => string;
  sub: string; color: string; bgColor: string;
  icon: React.ReactNode; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
    >
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{label}</p>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bgColor }}>
          {icon}
        </div>
      </div>
      <p className={`text-xl font-black font-mono ${color}`}>
        <AnimatedCounter to={to} format={format} />
      </p>
      <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
    </motion.div>
  );
}

/* ─── Student detail table ─── */

function StudentTable({ students, monthly }: { students: FlowStudent[]; monthly: number }) {
  const issued = students.filter(s => s.issuanceStatus === 'active');
  const MONTHS_ELAPSED = 3;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Detalle por beneficiario</p>
          <p className="text-xs text-slate-400 mt-0.5">{issued.length} estudiantes · Semestre 2026</p>
        </div>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:block">3 meses transcurridos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
              <th className="text-left px-5 py-2.5">Estudiante</th>
              <th className="text-left px-3 py-2.5 hidden sm:table-cell">Programa</th>
              <th className="text-right px-3 py-2.5">Mensual</th>
              <th className="text-right px-5 py-2.5">Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {issued.map((s, i) => (
              <motion.tr key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-3">
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{s.carne}</p>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="text-xs text-slate-500">{s.program}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-xs font-mono font-bold text-slate-600">{fmt(monthly)}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs font-mono font-bold" style={{ color: '#2C6849' }}>{fmt(monthly * MONTHS_ELAPSED)}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td colSpan={2} className="px-5 py-3 text-xs font-bold text-slate-700 hidden sm:table-cell">Total</td>
              <td className="px-5 py-3 text-xs font-bold text-slate-700 sm:hidden">Total</td>
              <td className="px-3 py-3 text-right text-xs font-bold font-mono text-slate-700">{fmtM(monthly * issued.length)}</td>
              <td className="px-5 py-3 text-right text-xs font-bold font-mono" style={{ color: '#2C6849' }}>{fmtM(monthly * issued.length * MONTHS_ELAPSED)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ─── Main export ─── */

interface Props {
  students: FlowStudent[];
  cardConfig: CardConfig;
  onBack: () => void;
}

export function Step6Analytics({ students, cardConfig, onBack }: Props) {
  const issued = students.filter(s => s.issuanceStatus === 'active');
  const issuedCount = issued.length;
  const monthly = cardConfig.monthlyAmount;
  const semestralTotal = monthly * issuedCount * 6;
  const faculties = new Set(issued.map(s => s.faculty)).size;

  const curData  = CUR_F.map(f => Math.round(monthly * issuedCount * f));
  const prevData = PREV_F.map(f => Math.round(monthly * issuedCount * f));

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total desembolsado" to={semestralTotal} format={fmtM}
          sub="Semestre 2026" color="text-[#1434CB]" bgColor="#EEF1FB" delay={0}
          icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#1434CB" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M6 7h3.5a1.5 1.5 0 010 3H6"/></svg>} />
        <KpiCard label="Tarjetas activas" to={issuedCount} format={String}
          sub="Beneficiarios" color="text-blue-600" bgColor="#dbeafe" delay={0.07}
          icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="14" height="9" rx="1.5"/><path d="M1 7.5h14"/></svg>} />
        <KpiCard label="Promedio mensual" to={monthly} format={fmtM}
          sub="Por estudiante" color="text-amber-600" bgColor="#fef3c7" delay={0.14}
          icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"><path d="M2 11l4-4 3 3 5-6"/></svg>} />
        <KpiCard label="Facultades" to={faculties} format={String}
          sub="Unidades académicas" color="text-purple-600" bgColor="#ede9fe" delay={0.21}
          icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"><path d="M2 13V6l6-4 6 4v7"/><path d="M6 13V9h4v4"/></svg>} />
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Desembolso mensual</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">Ene – Jun 2026</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#1434CB" strokeWidth="2.5" /></svg>
              <span>2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 2" /></svg>
              <span>2025</span>
            </div>
          </div>
        </div>
        <LineChart cur={curData} prev={prevData} />
      </div>

      {/* Donut + category breakdown */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gasto por categoría</p>
          <DonutChart total={monthly * issuedCount} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Desglose por MCC</p>
            <span className="text-[9px] text-slate-400 font-mono">Var. interanual</span>
          </div>
          <CategoryTable total={monthly * issuedCount} />
        </div>
      </div>

      {/* Percent of spend dot-plot */}
      <PercentOfSpendChart />

      {/* Student detail */}
      <StudentTable students={students} monthly={monthly} />

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack}
          className="px-5 py-2.5 rounded-md border-2 border-[rgba(0,0,0,0.1)] text-sm font-semibold text-[#4a4a4a] hover:bg-[#f5f5f5] hover:border-[rgba(0,0,0,0.18)] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>
        <button
          onClick={() => {
            const rows = [
              'Nombre,Carné,Programa,Mensual,Acumulado (3 meses)',
              ...issued.map(s => `${s.name},${s.carne},${s.program},${monthly},${monthly * 3}`),
            ].join('\n');
            const url = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
            const a = document.createElement('a'); a.href = url;
            a.download = 'analytics-becas-2026.csv'; a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-2.5 bg-[#1434CB] text-white rounded-md font-semibold text-sm tracking-[0.25px] hover:bg-[#173be8] active:bg-[#0f2595] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 3v7M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exportar reporte
        </button>
      </div>
    </div>
  );
}
