"use client";

import React, { useEffect, useState } from "react";
import {
  ContentCard, ContentCardBody, Typography, SectionMessage, SectionMessageContent,
  Table, TableWrapper, Thead, Tbody, Tr, Th, Td, ProgressLinear,
} from "@visa/nova-react";
import {
  VisaTransactionsLow, VisaWarningLow, VisaAnalyticsLow,
  VisaCheckmarkLow, VisaTrendingLow,
} from "@visa/nova-icons-react";
import { formatCRC } from "@/lib/config";

// Program budget consumption — amounts in millions of colones (₡…M),
// matching the dashboard's "₡17.960M" convention.
const PROGRAM_PERFORMANCE = [
  { name: "Beca Socioeconómica",              consumed: 17960, total: 45000 },
  { name: "Beca Alimentación", consumed: 13900, total: 15000 },
  { name: "Beca de Equidad Regional",   consumed: 9800,  total: 12000 },
  { name: "Horas Estudiante",               consumed: 6200,  total: 8500  },
  { name: "Residencias Estudiantiles",           consumed: 5100,  total: 9200  },
  { name: "Beca de Estímulo",  consumed: 2400,  total: 6000  },
];

const fmtMillions = (m: number) => `₡${m.toLocaleString("es-CR")}M`;

const STATIC_STATS = [
  {
    label: "Desembolso total",
    value: "₡17.960M",
    sub: "+8% vs 2025 · Visa Direct",
    icon: VisaTransactionsLow,
  },
];

const RECENT_ALERTS = [
  { id: "a1", beneficiary: "María Fernández Rojas",    canton: "Desamparados",  amount: 85000, lastDisbursement: "20/04/2026", nextDisbursement: "20/05/2026", date: "12/04/2026", status: "declined" as const, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "a2", beneficiary: "Roberto Rodríguez Ugalde", canton: "Alajuela",      amount: 55000, lastDisbursement: "18/04/2026", nextDisbursement: "18/05/2026", date: "10/04/2026", status: "declined" as const, photo: "https://randomuser.me/api/portraits/men/45.jpg"   },
  { id: "a3", beneficiary: "Francisca Solano Quesada", canton: "Cartago",       amount: 42000, lastDisbursement: "15/04/2026", nextDisbursement: "15/05/2026", date: "08/04/2026", status: "approved" as const, photo: "https://randomuser.me/api/portraits/women/55.jpg" },
  { id: "a4", beneficiary: "Luisa Brenes Mora",        canton: "Limón",         amount: 55000, lastDisbursement: "12/04/2026", nextDisbursement: "12/05/2026", date: "05/04/2026", status: "declined" as const, photo: "https://randomuser.me/api/portraits/women/31.jpg" },
  { id: "a5", beneficiary: "Pedro Herrera Campos",     canton: "San Carlos",    amount: 22000, lastDisbursement: "10/04/2026", nextDisbursement: "10/05/2026", date: "03/04/2026", status: "declined" as const, photo: "https://randomuser.me/api/portraits/men/62.jpg"   },
  { id: "a6", beneficiary: "Concepción Alvarado Ríos", canton: "Golfito",       amount: 55000, lastDisbursement: "08/04/2026", nextDisbursement: "08/05/2026", date: "01/04/2026", status: "approved" as const, photo: "https://randomuser.me/api/portraits/women/77.jpg" },
];

const CANTON_DATA = [
  { name: "San José",      students: 28420, disbursed: "₡1.562M", pct: 98 },
  { name: "Alajuela",      students: 19840, disbursed: "₡1.091M", pct: 97 },
  { name: "Cartago",       students: 14230, disbursed: "₡783M",   pct: 96 },
  { name: "Heredia",       students: 12610, disbursed: "₡694M",   pct: 95 },
  { name: "Guanacaste",    students: 18980, disbursed: "₡1.044M", pct: 93 },
  { name: "Puntarenas",    students: 22210, disbursed: "₡1.221M", pct: 91 },
  { name: "Limón",         students: 19840, disbursed: "₡1.091M", pct: 90 },
  { name: "Brunca",        students: 16870, disbursed: "₡928M",   pct: 88 },
  { name: "Huetar Norte",  students: 14540, disbursed: "₡800M",   pct: 87 },
  { name: "Chorotega",     students: 18120, disbursed: "₡997M",   pct: 85 },
];

const BEAM_ANIM = `
@keyframes bbeam {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

function BorderBeamCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const flex = (style as React.CSSProperties & { flex?: string })?.flex;
  return (
    <div style={{ position: "relative", flex }}>
      <div style={{ position: "absolute", inset: -1.5, borderRadius: 13, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: "200%", height: "200%",
          background: "conic-gradient(from 0deg, transparent 0%, transparent 78%, rgba(0,61,165,.85) 83%, rgba(20,52,203,.75) 86%, rgba(255,255,255,.5) 88%, transparent 93%)",
          animation: "bbeam 4s linear infinite",
        }} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

const TOAST_ANIM = `
@keyframes toast-in  { from { transform: translateY(-16px) translateX(110%); opacity: 0; } to { transform: translateY(0) translateX(0); opacity: 1; } }
@keyframes toast-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-12px); } }
`;

const NEW_BENEFICIARIES = [
  { name: "Valeria Herrera Pérez",  canton: "Heredia",        photo: "https://i.pravatar.cc/40?u=nb1" },
  { name: "Diego Vargas Solano",    canton: "Alajuela",       photo: "https://i.pravatar.cc/40?u=nb2" },
  { name: "Sofía Jiménez Castro",   canton: "Pérez Zeledón",  photo: "https://i.pravatar.cc/40?u=nb3" },
];

export default function PortalPage() {
  const declinedCount = RECENT_ALERTS.filter((a) => a.status === "declined").length;
  const TARGET = 325660;

  const [count, setCount]               = useState(0);
  const [fraudAlerts, setFraudAlerts]   = useState(183);
  const [approvalRate, setApprovalRate] = useState(99.81);
  const [toast, setToast]               = useState<{ name: string; canton: string; photo?: string } | null>(null);
  const [toastOut, setToastOut]         = useState(false);

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * TARGET));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFraudAlerts((n) => n + Math.floor(Math.random() * 3) + 1), 4000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setApprovalRate((r) => {
        const delta = (Math.random() - 0.48) * 0.3;
        return Math.min(99.99, Math.max(97.4, +(r + delta).toFixed(2)));
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let idx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const show = () => {
      setToastOut(false);
      const ben = NEW_BENEFICIARIES[idx % NEW_BENEFICIARIES.length];
      setToast(ben);
      idx++;
      window.dispatchEvent(new CustomEvent("new-beneficiary"));
      timers.push(setTimeout(() => setToastOut(true), 3000));
      timers.push(setTimeout(() => setToast(null), 3400));
    };
    const DELAYS = [3000, 5000, 15000];
    let cumulative = 0;
    DELAYS.forEach((d) => { cumulative += d; timers.push(setTimeout(show, cumulative)); });
    const interval = setInterval(show, cumulative + 15000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <div className="v-flex v-flex-col v-gap-8">
      <style>{BEAM_ANIM}</style>

      <SectionMessage className="v-message-info">
        <SectionMessageContent>
          <Typography className="v-typography-body-2">
            Ciclo de mayo 2026 · <strong>7 sedes activas</strong> ·{" "}
            {declinedCount} alertas pendientes
          </Typography>
        </SectionMessageContent>
      </SectionMessage>

      <div>
        <Typography tag="h1" className="v-typography-headline-1">Resumen General</Typography>
        <Typography className="v-typography-subtitle-2">Beca Socioeconómica · UCR × Banco de Costa Rica × Visa · Mayo 2026</Typography>
      </div>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>
        <BorderBeamCard style={{ flex: "2 0 0" }}>
          <ContentCard style={{ flex: "2 0 0", background: "var(--v-nav-background)" }}>
            <ContentCardBody>
              <Typography tag="p" className="v-typography-display-1" style={{ color: "var(--v-nav-foreground)" }}>
                {count.toLocaleString("es-CR")}
              </Typography>
              <Typography className="v-typography-subtitle-1" style={{ color: "var(--v-nav-foreground)", marginTop: "6px", opacity: 0.9 }}>
                Estudiantes activos en Beca Socioeconómica
              </Typography>
              <div className="v-flex v-align-items-center v-gap-1" style={{ marginTop: "20px", opacity: 0.7 }}>
                <VisaTrendingLow style={{ color: "var(--v-nav-foreground)" }} />
                <Typography className="v-typography-label" style={{ color: "var(--v-nav-foreground)" }}>
                  +6.1% este ciclo · 7 sedes · 18 facultades
                </Typography>
              </div>
            </ContentCardBody>
          </ContentCard>
        </BorderBeamCard>

        {[
          ...STATIC_STATS,
          { label: "Alertas de fraude", value: String(fraudAlerts), sub: `${(fraudAlerts / 325660 * 100).toFixed(2)}% del total · Visa Risk Manager`, icon: VisaWarningLow },
          { label: "Tasa de aprobación", value: `${approvalRate.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, sub: "Visa Risk Manager activo", icon: VisaAnalyticsLow },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <ContentCard key={stat.label} style={{ flex: "1 0 0" }}>
              <ContentCardBody>
                <Typography tag="p" className="v-typography-headline-1" style={{ whiteSpace: "nowrap" }}>{stat.value}</Typography>
                <div className="v-flex v-align-items-center v-gap-1" style={{ marginTop: "8px" }}>
                  <Icon />
                  <Typography className="v-typography-body-2">{stat.label}</Typography>
                </div>
                <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: "4px" }}>{stat.sub}</Typography>
              </ContentCardBody>
            </ContentCard>
          );
        })}
      </div>

      {/* Tables */}
      <div style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>
        <ContentCard style={{ flex: 1 }}>
          <ContentCardBody>
            <Typography tag="h2" className="v-typography-headline-4" style={{ marginBottom: "4px" }}>
              Rendimiento de Programas
            </Typography>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: "18px" }}>
              Ejecución presupuestaria · consumido del monto total
            </Typography>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {PROGRAM_PERFORMANCE.map((p) => {
                const pct = Math.round((p.consumed / p.total) * 100);
                return (
                  <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                      <Typography className="v-typography-body-2-bold">{p.name}</Typography>
                      <Typography className="v-typography-label v-typography-color-subtle" style={{ whiteSpace: "nowrap" }}>
                        {fmtMillions(p.consumed)} / {fmtMillions(p.total)}
                      </Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <ProgressLinear value={pct} max={100} completed={pct >= 90} style={{ flex: 1, minWidth: "56px" }} />
                      <Typography className="v-typography-label" style={{ minWidth: "38px", textAlign: "right", fontWeight: 600 }}>
                        {pct}%
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentCardBody>
        </ContentCard>

        <ContentCard style={{ flex: 1 }}>
          <ContentCardBody>
            <Typography tag="h2" className="v-typography-headline-4" style={{ marginBottom: "16px" }}>
              Top Regiones por Desembolso
            </Typography>
            <TableWrapper>
              <Table tableSize="small">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Provincia / Región</Th>
                    <Th>Estudiantes</Th>
                    <Th>Desembolso</Th>
                    <Th>Cobertura</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {CANTON_DATA.map((canton, i) => (
                    <Tr key={canton.name}>
                      <Td><Typography className="v-typography-label">{i + 1}</Typography></Td>
                      <Td><Typography className="v-typography-body-2-bold">{canton.name}</Typography></Td>
                      <Td><Typography className="v-typography-body-2">{canton.students.toLocaleString("es-CR")}</Typography></Td>
                      <Td><Typography className="v-typography-body-2">{canton.disbursed}</Typography></Td>
                      <Td>
                        <div className="v-flex v-align-items-center v-gap-2">
                          <ProgressLinear value={canton.pct} max={100} completed={canton.pct >= 98} style={{ flex: 1, minWidth: "56px" }} />
                          <Typography className="v-typography-label" style={{ minWidth: "34px", textAlign: "right" }}>{canton.pct}%</Typography>
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

      {/* Toast */}
      <style>{TOAST_ANIM}</style>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: "#fff", borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06)",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
          minWidth: 320, maxWidth: 380,
          animation: `${toastOut ? "toast-out" : "toast-in"} .4s cubic-bezier(.22,.61,.36,1) forwards`,
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={toast.photo} alt={toast.name}
              style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid #E2E8F0", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <VisaCheckmarkLow style={{ color: "#fff", width: 7, height: 7 }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>
              Nuevo estudiante inscrito
            </div>
            <div style={{ fontSize: 12, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {toast.name} · {toast.canton} — Costa Rica
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0, fontWeight: 500 }}>ahora</div>
        </div>
      )}
    </div>
  );
}
