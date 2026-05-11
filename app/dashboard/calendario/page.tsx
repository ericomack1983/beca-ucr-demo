"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { DEMO_DATE } from "@/lib/config";

// ── Enrollment periods ────────────────────────────────────────────────────────

const CONVOCATORIAS = [
  {
    id: "conv_1",
    short: "Beca Honor",
    program: "Beca de Honor — Grado",
    faculty: "Todas las facultades",
    openDate: "2026-04-01",
    closeDate: "2026-05-31",
    decisionDate: "2026-06-15",
    status: "open",
    color: { bg: "#10B981", light: "#ECFDF5", text: "#065F46", border: "#6EE7B7", dot: "#10B981" },
  },
  {
    id: "conv_2",
    short: "Beca Trabajo",
    program: "Beca de Trabajo — Semestral",
    faculty: "Todas las facultades",
    openDate: "2026-04-15",
    closeDate: "2026-05-15",
    decisionDate: "2026-06-01",
    status: "closing_soon",
    color: { bg: "#3B82F6", light: "#EFF6FF", text: "#1E40AF", border: "#93C5FD", dot: "#3B82F6" },
  },
  {
    id: "conv_3",
    short: "Préstamo",
    program: "Préstamo Estudiantil — II Ciclo 2026",
    faculty: "Ingenierías y Ciencias",
    openDate: "2026-05-20",
    closeDate: "2026-06-30",
    decisionDate: "2026-07-15",
    status: "upcoming",
    color: { bg: "#F59E0B", light: "#FFFBEB", text: "#92400E", border: "#FCD34D", dot: "#F59E0B" },
  },
  {
    id: "conv_4",
    short: "Posgrado",
    program: "Beca Posgrado — Internacional",
    faculty: "Posgrados",
    openDate: "2026-06-01",
    closeDate: "2026-07-15",
    decisionDate: "2026-08-01",
    status: "upcoming",
    color: { bg: "#8B5CF6", light: "#F5F3FF", text: "#5B21B6", border: "#C4B5FD", dot: "#8B5CF6" },
  },
];

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const TODAY = DEMO_DATE; // 2026-05-11

// ── Helpers ───────────────────────────────────────────────────────────────────

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function toMidnight(iso: string) {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getCalendarCells(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), current: false });
  }
  return cells;
}

function getActiveConvs(date: Date) {
  return CONVOCATORIAS.filter((c) => {
    const open  = toMidnight(c.openDate);
    const close = toMidnight(c.closeDate);
    return date >= open && date <= close;
  });
}

function isOpenDate(date: Date) {
  return CONVOCATORIAS.some((c) => sameDay(toMidnight(c.openDate), date));
}

function isCloseDate(date: Date) {
  return CONVOCATORIAS.some((c) => sameDay(toMidnight(c.closeDate), date));
}

function getDaysLeft(closeDate: string) {
  const ms = toMidnight(closeDate).getTime() - TODAY.getTime();
  return Math.ceil(ms / 86_400_000);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarioPage() {
  const [viewYear,  setViewYear]  = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selected,  setSelected]  = useState<Date | null>(TODAY);

  const cells = getCalendarCells(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const selectedConvs = selected ? getActiveConvs(selected) : [];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">Calendario de Becas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Períodos de inscripción · Ciclo lectivo 2026
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {CONVOCATORIAS.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
            style={{ background: c.color.light, borderColor: c.color.border, color: c.color.text }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: c.color.bg }} />
            {c.short}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Calendar grid ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <motion.h2
              key={`${viewYear}-${viewMonth}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-bold text-[#0B2A5B]"
            >
              {MONTHS_ES[viewMonth]} {viewYear}
            </motion.h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS_ES.map((d) => (
              <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewYear}-${viewMonth}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-7"
            >
              {cells.map((cell, idx) => {
                const isToday   = sameDay(cell.date, TODAY);
                const isSel     = selected ? sameDay(cell.date, selected) : false;
                const activeC   = getActiveConvs(cell.date);
                const isOpen    = isOpenDate(cell.date);
                const isClose   = isCloseDate(cell.date);
                const isLast    = idx % 7 === 6;
                const isBottom  = idx >= 35;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelected(cell.date)}
                    className={[
                      "relative flex flex-col items-center pt-2 pb-2.5 min-h-[72px] transition-colors",
                      !isLast && "border-r border-slate-50",
                      !isBottom && "border-b border-slate-50",
                      !cell.current && "bg-slate-50/40",
                      isSel && !isToday && "bg-[#0B2A5B]/5",
                      !isSel && cell.current && activeC.length > 0 && "hover:bg-slate-50",
                      !isSel && !isToday && "hover:bg-slate-50",
                    ].filter(Boolean).join(" ")}
                  >
                    {/* Day number */}
                    <span className={[
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium leading-none transition-colors",
                      isToday
                        ? "bg-[#0B2A5B] text-white font-bold"
                        : isSel
                        ? "bg-[#0B2A5B]/10 text-[#0B2A5B] font-semibold"
                        : !cell.current
                        ? "text-slate-300"
                        : "text-slate-700",
                    ].join(" ")}>
                      {cell.date.getDate()}
                    </span>

                    {/* Open / close markers */}
                    {(isOpen || isClose) && cell.current && (
                      <div className="absolute top-1.5 right-1.5 flex gap-0.5">
                        {isOpen  && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Apertura" />}
                        {isClose && <div className="w-1.5 h-1.5 rounded-full bg-rose-400" title="Cierre" />}
                      </div>
                    )}

                    {/* Enrollment dots */}
                    {activeC.length > 0 && cell.current && (
                      <div className="flex gap-1 mt-1.5 flex-wrap justify-center px-1">
                        {activeC.map((c) => (
                          <div
                            key={c.id}
                            className="h-1.5 rounded-full"
                            style={{
                              background: c.color.bg,
                              width: activeC.length === 1 ? "28px" : "12px",
                              opacity: 0.85,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Side panel: selected day detail ── */}
        <div className="space-y-3 lg:sticky lg:top-6">
          {selected && (
            <motion.div
              key={selected.toISOString()}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
                  {selected.toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long" })}
                </span>
                {sameDay(selected, TODAY) && (
                  <span className="ml-auto text-[10px] font-bold text-[#0B2A5B] bg-[#0B2A5B]/8 px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                )}
              </div>

              {selectedConvs.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Sin convocatorias activas este día.</p>
              ) : (
                <div className="space-y-2">
                  {selectedConvs.map((c) => {
                    const daysLeft = getDaysLeft(c.closeDate);
                    return (
                      <div
                        key={c.id}
                        className="rounded-xl border p-3 space-y-1"
                        style={{ background: c.color.light, borderColor: c.color.border }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color.bg }} />
                          <span className="text-xs font-bold" style={{ color: c.color.text }}>{c.short}</span>
                        </div>
                        <p className="text-xs" style={{ color: c.color.text }}>{c.program}</p>
                        {daysLeft > 0 ? (
                          <p className="text-[11px] font-semibold" style={{ color: c.color.text }}>
                            Cierra en {daysLeft} día{daysLeft !== 1 ? "s" : ""}
                          </p>
                        ) : daysLeft === 0 ? (
                          <p className="text-[11px] font-semibold text-rose-600">Cierra hoy</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Upcoming key dates */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Próximas fechas clave</p>
            <div className="space-y-2">
              {[
                { date: "2026-05-15", label: "Cierre — Beca de Trabajo", urgency: "red" },
                { date: "2026-05-20", label: "Apertura — Préstamo II Ciclo", urgency: "blue" },
                { date: "2026-05-31", label: "Cierre — Beca de Honor Grado", urgency: "amber" },
                { date: "2026-06-01", label: "Apertura — Beca Posgrado", urgency: "purple" },
              ].map((item) => {
                const days = getDaysLeft(item.date);
                const colorMap = {
                  red:    "text-rose-600 bg-rose-50 border-rose-200",
                  blue:   "text-blue-600 bg-blue-50 border-blue-200",
                  amber:  "text-amber-700 bg-amber-50 border-amber-200",
                  purple: "text-purple-600 bg-purple-50 border-purple-200",
                } as const;
                return (
                  <div key={item.date} className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border min-w-[52px] text-center ${colorMap[item.urgency as keyof typeof colorMap]}`}>
                      {days > 0 ? `${days}d` : days === 0 ? "Hoy" : "Pasó"}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Enrollment timeline bars ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0B2A5B]">Períodos de inscripción</h3>
          <p className="text-xs text-slate-400 mt-0.5">Abril — Agosto 2026</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Month ruler */}
          <TimelineRuler />

          {/* Bars per convocatoria */}
          {CONVOCATORIAS.map((c) => (
            <TimelineBar key={c.id} conv={c} />
          ))}
        </div>
      </div>

      {/* ── Convocatoria cards ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detalle de convocatorias</h3>
        {CONVOCATORIAS.map((c, i) => {
          const daysLeft   = getDaysLeft(c.closeDate);
          const isActive   = c.status === "open" || c.status === "closing_soon";
          const isUpcoming = c.status === "upcoming";

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Colored top bar */}
              <div className="h-1" style={{ background: c.color.bg }} />
              <div className="px-6 py-5 flex items-start gap-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: c.color.light, border: `1px solid ${c.color.border}` }}
                >
                  {isActive ? (
                    <Sparkles className="w-4 h-4" style={{ color: c.color.bg }} />
                  ) : isUpcoming ? (
                    <Clock className="w-4 h-4" style={{ color: c.color.bg }} />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.program}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{c.faculty}</p>
                    </div>
                    <StatusChip status={c.status} daysLeft={daysLeft} color={c.color} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Apertura", value: fmtDate(c.openDate) },
                      { label: "Cierre",   value: fmtDate(c.closeDate) },
                      { label: "Resolución", value: fmtDate(c.decisionDate) },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="text-xs font-medium text-slate-700 mt-0.5 leading-snug">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">
        <p className="text-xs text-blue-700">
          <strong>Nota:</strong> Fechas correspondientes al ciclo lectivo 2026. Para información oficial actualizada consulte el{" "}
          <a href="#" className="underline">Reglamento de Becas UCR</a>.
        </p>
      </div>
    </div>
  );
}

// ── Status chip ───────────────────────────────────────────────────────────────

function StatusChip({
  status, daysLeft, color,
}: {
  status: string;
  daysLeft: number;
  color: { bg: string; light: string; text: string; border: string };
}) {
  if (status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Cerrada
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
        style={{ background: color.light, color: color.text, borderColor: color.border }}
      >
        <Clock className="w-3 h-3" /> Próxima
      </span>
    );
  }
  const urgent = daysLeft <= 10;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
      style={{
        background: urgent ? "#FEF2F2" : color.light,
        color:      urgent ? "#B91C1C" : color.text,
        borderColor: urgent ? "#FECACA" : color.border,
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: urgent ? "#EF4444" : color.bg }}
      />
      {daysLeft > 0
        ? `${daysLeft} día${daysLeft !== 1 ? "s" : ""} restantes`
        : "Cierra hoy"}
    </span>
  );
}

// ── Timeline ruler (Apr–Aug) ──────────────────────────────────────────────────

const RULER_MONTHS = [
  { label: "Abr", year: 2026, month: 3 },
  { label: "May", year: 2026, month: 4 },
  { label: "Jun", year: 2026, month: 5 },
  { label: "Jul", year: 2026, month: 6 },
  { label: "Ago", year: 2026, month: 7 },
];
const RULER_START = new Date(2026, 3, 1);  // Apr 1
const RULER_END   = new Date(2026, 8, 1);  // Sep 1 (exclusive)
const RULER_TOTAL_DAYS = (RULER_END.getTime() - RULER_START.getTime()) / 86_400_000;

function dateToPercent(iso: string) {
  const d = toMidnight(iso);
  const clamped = Math.max(RULER_START.getTime(), Math.min(RULER_END.getTime(), d.getTime()));
  return ((clamped - RULER_START.getTime()) / 86_400_000 / RULER_TOTAL_DAYS) * 100;
}

function TimelineRuler() {
  const todayPct = dateToPercent(TODAY.toISOString().split("T")[0]);

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex mb-1.5">
        {RULER_MONTHS.map((m) => (
          <div key={m.label} className="flex-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
            {m.label}
          </div>
        ))}
      </div>
      {/* Baseline */}
      <div className="h-px bg-slate-100 relative">
        {/* Today marker */}
        <div
          className="absolute -top-2 w-px h-3 bg-[#0B2A5B]"
          style={{ left: `${todayPct}%` }}
        />
        <div
          className="absolute -top-4 text-[9px] font-bold text-[#0B2A5B] -translate-x-1/2"
          style={{ left: `${todayPct}%` }}
        >
          Hoy
        </div>
      </div>
    </div>
  );
}

function TimelineBar({ conv }: { conv: typeof CONVOCATORIAS[0] }) {
  const left  = dateToPercent(conv.openDate);
  const right = dateToPercent(conv.closeDate);
  const width = Math.max(right - left, 1);

  return (
    <div className="relative h-7">
      {/* Track */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center">
        <div className="w-full h-px bg-slate-50" />
      </div>

      {/* Label */}
      <div className="absolute left-0 inset-y-0 flex items-center pr-4 w-[80px] shrink-0">
        <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">{conv.short}</span>
      </div>

      {/* Bar */}
      <div className="absolute inset-y-0 flex items-center" style={{ left: "80px", right: "0" }}>
        <div className="relative w-full h-5">
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="absolute inset-y-0 rounded-full flex items-center px-2"
            style={{
              left:       `${left}%`,
              width:      `${width}%`,
              background: conv.color.bg,
              opacity:    conv.status === "closed" ? 0.35 : 0.85,
            }}
          >
            <span className="text-white text-[9px] font-bold truncate opacity-90">
              {conv.status === "upcoming" ? "Próxima" : conv.status === "closed" ? "Cerrada" : "Abierta"}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
