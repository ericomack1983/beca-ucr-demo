"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Line,
  ResponsiveContainer,
} from "recharts";
import {
  ContentCard, ContentCardBody, Typography, Table, TableWrapper,
  Thead, Tbody, Tr, Th, Td, Select, InputContainer, VisaLogo,
} from "@visa/nova-react";
import { PROGRAMS } from "@/lib/mock-programs";
import {
  VisaTransactionsLow, VisaAccountLow, VisaAnalyticsLow, VisaGovernmentLow,
} from "@visa/nova-icons-react";

// ── Custom tooltip for donut ──────────────────────────────────────────────────

function PieTooltipContent({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: { color } } = payload[0];
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.10)", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{name}</span>
      <span style={{ fontSize: 13, color: "#64748B" }}>{value}%</span>
    </div>
  );
}

// ── Custom tooltip for area chart ─────────────────────────────────────────────

function AreaTooltipContent({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,.10)", minWidth: 160 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.dataKey}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>₡ {p.value}M</span>
        </div>
      ))}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const BLUE = "#1434CB";
const GRAY = "#94A3B8";

const MCC_CATS = [
  { name: "Supermercados",     color: "#1434CB" },
  { name: "Panaderías",        color: "#F59E0B" },
  { name: "Verdulerías",       color: "#10B981" },
  { name: "Carnicerías",       color: "#8B5CF6" },
  { name: "Electrónica",       color: "#EF4444" },
  { name: "Reparaciones Auto", color: "#F97316" },
  { name: "Compañías Aéreas",  color: "#06B6D4" },
  { name: "Apuestas / Juegos", color: "#EC4899" },
  { name: "Farmacias",         color: "#14B8A6" },
  { name: "Otros",             color: "#94A3B8" },
];
const MCC_YOY = ["+11,2%", "+8,7%", "+14,5%", "+5,3%", "+18,4%", "+6,1%", "+22,3%", "+31,7%", "+9,8%", "+2,1%"];
const MCC_PROFILES: Record<string, number[]> = {
  food:      [28, 14, 11, 8, 9, 7, 6, 5, 7, 5],
  education: [18, 9, 7, 5, 14, 6, 4, 3, 10, 24],
  mixed:     [22, 11, 9, 9, 11, 8, 6, 5, 9, 10],
};

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May"];
const MONTHLY_SHAPE = [12.4, 14.2, 16.8, 15.3, 18.1];

type Seed = { totalM: number; cards: number; cantones: number; mcc: keyof typeof MCC_PROFILES };

const PROGRAM_SEEDS: Record<string, Seed> = {
  "39201": { totalM: 17960, cards: 38214, cantones: 82, mcc: "food"      },
  "39202": { totalM: 6200,  cards: 14820, cantones: 64, mcc: "mixed"     },
  "39203": { totalM: 9800,  cards: 21450, cantones: 71, mcc: "food"      },
  "39204": { totalM: 4300,  cards: 9870,  cantones: 48, mcc: "mixed"     },
  "39206": { totalM: 5100,  cards: 12300, cantones: 53, mcc: "education" },
  "39207": { totalM: 7400,  cards: 16980, cantones: 67, mcc: "food"      },
  "39208": { totalM: 2400,  cards: 6540,  cantones: 39, mcc: "education" },
  "39210": { totalM: 13900, cards: 31200, cantones: 79, mcc: "food"      },
  "39211": { totalM: 3100,  cards: 28900, cantones: 75, mcc: "mixed"     },
  "39236": { totalM: 180,   cards: 320,   cantones: 6,  mcc: "mixed"     },
  "39237": { totalM: 95,    cards: 140,   cantones: 4,  mcc: "mixed"     },
};
const DEFAULT_SEED: Seed = { totalM: 5000, cards: 10000, cantones: 50, mcc: "mixed" };

const ANALYTICS_PROGRAMS = PROGRAMS.filter((p) => p.active);

const fmtM = (m: number) => `₡${Math.round(m).toLocaleString("es-CR")}M`;

function buildAnalytics(programId: string) {
  const s = PROGRAM_SEEDS[programId] ?? DEFAULT_SEED;
  const factor = s.totalM / 17960;

  const monthly = MONTHS.map((mes, i) => ({
    mes,
    "2026": Math.round(MONTHLY_SHAPE[i] * factor * 100) / 100,
    "2025": Math.round(MONTHLY_SHAPE[i] * factor * 0.82 * 100) / 100,
  }));

  const weights = MCC_PROFILES[s.mcc];
  const mcc = MCC_CATS.map((c, i) => ({ ...c, value: weights[i] }));
  const mccTable = MCC_CATS.map((c, i) => ({ cat: c.name, total: fmtM((s.totalM * weights[i]) / 100), yoy: MCC_YOY[i] }));

  const kpis = {
    total: fmtM(s.totalM),
    cards: s.cards.toLocaleString("es-CR"),
    avg: fmtM(s.totalM / 5),
    cantones: String(s.cantones),
  };

  return { monthly, mcc, mccTable, kpis };
}

const KPI_META = [
  { key: "total"    as const, label: "Total Desembolsado", sub: "Ene–May 2026",          icon: VisaTransactionsLow },
  { key: "cards"    as const, label: "Tarjetas Activas",   sub: "Beneficiarios activos", icon: VisaAccountLow      },
  { key: "avg"      as const, label: "Promedio Mensual",   sub: "Por mes",               icon: VisaAnalyticsLow    },
  { key: "cantones" as const, label: "Cantones Activos",   sub: "Costa Rica",            icon: VisaGovernmentLow   },
];

export default function AnalyticsPage() {
  const [programId, setProgramId] = useState(ANALYTICS_PROGRAMS[0]?.id ?? "39201");
  const data = buildAnalytics(programId);

  const KPIS = KPI_META.map((m) => ({ ...m, value: data.kpis[m.key] }));
  const MONTHLY = data.monthly;
  const MCC_DATA = data.mcc;
  const MCC_TABLE = data.mccTable;

  return (
    <div className="v-flex v-flex-col v-gap-8">

      <div className="v-flex v-align-items-end v-justify-between v-gap-4" style={{ flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <VisaLogo style={{ height: 26, width: "auto" }} aria-label="Visa" />
          <div style={{ width: 1, height: 28, background: "#D4D9E2" }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#8A94A6" }}>
              Banco de Costa Rica
            </span>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#1A1F71", letterSpacing: "-0.01em" }}>
              Analítica de Becas
            </span>
          </div>
        </div>
        <div className="v-flex v-flex-col" style={{ gap: 6, width: 280, marginLeft: "auto" }}>
          <Typography style={{ fontSize: 13, color: "#64748B" }}>Programa</Typography>
          <InputContainer>
            <Select aria-label="Programa" value={programId} onChange={(e) => setProgramId(e.target.value)}>
              {ANALYTICS_PROGRAMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · ID {p.id}</option>
              ))}
            </Select>
          </InputContainer>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: "16px" }}>
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <ContentCard key={k.label} style={{ flex: 1 }}>
              <ContentCardBody>
                <div className="v-flex v-align-items-center v-justify-between v-mb-3">
                  <Typography className="v-typography-overline">{k.label}</Typography>
                  <Icon />
                </div>
                <Typography tag="p" className="v-typography-headline-1" style={{ whiteSpace: "nowrap" }}>{k.value}</Typography>
                <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 4 }}>{k.sub}</Typography>
              </ContentCardBody>
            </ContentCard>
          );
        })}
      </div>

      {/* Monthly area chart */}
      <ContentCard>
        <ContentCardBody>
          <div className="v-flex v-align-items-center v-justify-between v-mb-4">
            <div>
              <Typography tag="h2" className="v-typography-headline-4">Desembolso Mensual</Typography>
              <Typography className="v-typography-label v-typography-color-subtle">Ene–May 2026 vs 2025</Typography>
            </div>
            <div className="v-flex v-gap-4">
              <div className="v-flex v-align-items-center v-gap-1">
                <div style={{ width: 24, height: 2, background: BLUE, borderRadius: 1 }} />
                <Typography className="v-typography-label">2026</Typography>
              </div>
              <div className="v-flex v-align-items-center v-gap-1">
                <div style={{ width: 24, height: 2, background: GRAY, borderRadius: 1 }} />
                <Typography className="v-typography-label">2025</Typography>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.013,
              y: -4,
              boxShadow: "0 12px 36px rgba(20,52,203,0.10)",
              transition: { type: "spring", stiffness: 320, damping: 22 },
            }}
            style={{ borderRadius: 8, transformOrigin: "center center" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad26" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BLUE} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }}
                  tickFormatter={(v) => `₡${v}M`} />
                <Tooltip content={<AreaTooltipContent />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="2026" stroke={BLUE} strokeWidth={2.5}
                  fill="url(#grad26)" dot={{ r: 4, fill: BLUE, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: BLUE, strokeWidth: 2, stroke: "#fff" }}
                  animationBegin={0} animationDuration={1200} />
                <Line type="monotone" dataKey="2025" stroke={GRAY} strokeWidth={1.5}
                  strokeDasharray="5 4" dot={false}
                  animationBegin={200} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </ContentCardBody>
      </ContentCard>

      {/* Donut + MCC table */}
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

        <ContentCard style={{ flex: "0 0 360px" }}>
          <ContentCardBody>
            <Typography tag="h2" className="v-typography-headline-4" style={{ marginBottom: 4 }}>
              Gasto por Categoría MCC
            </Typography>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 16 }}>
              Distribución Mayo 2026
            </Typography>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.07,
                filter: "drop-shadow(0 8px 24px rgba(20,52,203,0.18))",
                transition: { type: "spring", stiffness: 300, damping: 18 },
              }}
              style={{ transformOrigin: "center center", cursor: "pointer" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={MCC_DATA} cx="50%" cy="50%"
                    innerRadius={56} outerRadius={88}
                    dataKey="value" nameKey="name"
                    paddingAngle={3}
                    animationBegin={0} animationDuration={1000}
                    strokeWidth={0}
                  >
                    {MCC_DATA.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Legend */}
            <div className="v-flex v-flex-col" style={{ marginTop: 14, gap: 8 }}>
              {MCC_DATA.map((d) => (
                <div key={d.name} className="v-flex v-align-items-center v-justify-between">
                  <div className="v-flex v-align-items-center" style={{ gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <Typography className="v-typography-label">{d.name}</Typography>
                  </div>
                  <Typography className="v-typography-label v-typography-color-subtle" style={{ marginLeft: 12 }}>
                    {d.value}%
                  </Typography>
                </div>
              ))}
            </div>
          </ContentCardBody>
        </ContentCard>

        <ContentCard style={{ flex: 1 }}>
          <ContentCardBody>
            <div className="v-flex v-align-items-center v-justify-between" style={{ marginBottom: 16 }}>
              <Typography tag="h2" className="v-typography-headline-4">Detalle por MCC</Typography>
              <Typography className="v-typography-label v-typography-color-subtle">Var. interanual</Typography>
            </div>
            <TableWrapper>
              <Table tableSize="small">
                <Thead>
                  <Tr><Th>Categoría</Th><Th>Total</Th><Th>YOY</Th><Th>Participación</Th></Tr>
                </Thead>
                <Tbody>
                  {MCC_TABLE.map((row, i) => (
                    <Tr key={row.cat}>
                      <Td>
                        <div className="v-flex v-align-items-center v-gap-2">
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: MCC_DATA[i].color, flexShrink: 0 }} />
                          <Typography className="v-typography-body-2-bold">{row.cat}</Typography>
                        </div>
                      </Td>
                      <Td><Typography className="v-typography-body-2">{row.total}</Typography></Td>
                      <Td>
                        <Typography className="v-typography-body-2" style={{ color: "#16A34A" }}>{row.yoy}</Typography>
                      </Td>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${MCC_DATA[i].value}%`, height: "100%", background: MCC_DATA[i].color, borderRadius: 3 }} />
                          </div>
                          <Typography className="v-typography-label" style={{ minWidth: 28, textAlign: "right" }}>
                            {MCC_DATA[i].value}%
                          </Typography>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>
          </ContentCardBody>
        </ContentCard>
      </div>

    </div>
  );
}
