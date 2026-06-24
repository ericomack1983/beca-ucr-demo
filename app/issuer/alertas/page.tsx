"use client";

import { motion } from "framer-motion";
import {
  ContentCard, ContentCardBody, Typography,
} from "@visa/nova-react";
import {
  VisaWarningLow,
  VisaDeviceSecureLow,
  VisaSecurityLockLow,
  VisaMapLocationLow,
} from "@visa/nova-icons-react";
import { formatCRC } from "@/lib/utils";

const VISA_BLUE = "#1434CB";

const ALERTS = [
  {
    id: "A001",
    beneficiary: "María Fernández Rojas",
    cedula: "•-••••-•291",
    canton: "Desamparados",
    region: "Sede Rodrigo Facio",
    merchant: "Electrónica Gollo",
    mcc: "5732",
    mccLabel: "Electrónica",
    amount: 85000,
    date: "12/05/2026 15:23",
    severity: "high" as const,
    status: "notified" as const,
    visaCode: "DECLINE-05",
    alertType: "Comercio no autorizado",
  },
  {
    id: "A002",
    beneficiary: "Carlos Mora Quesada",
    cedula: "•-••••-•345",
    canton: "Liberia",
    region: "Sede Chorotega",
    merchant: "Distribuidora Electrónica Norte",
    mcc: "5734",
    mccLabel: "Software / Electrónica",
    amount: 42000,
    date: "10/05/2026 11:05",
    severity: "high" as const,
    status: "notified" as const,
    visaCode: "DECLINE-VEL",
    alertType: "Alerta de velocidad",
  },
  {
    id: "A003",
    beneficiary: "Ana Jiménez Solano",
    cedula: "•-••••-•456",
    canton: "Pérez Zeledón",
    region: "Sede Brunca",
    merchant: "Restaurante Vista del Sur",
    mcc: "5812",
    mccLabel: "Restaurante",
    amount: 12500,
    date: "05/05/2026 19:40",
    severity: "medium" as const,
    status: "under_review" as const,
    visaCode: "DECLINE-GEO",
    alertType: "Fuera de geo-cerca",
  },
  {
    id: "A004",
    beneficiary: "Roberto Rodríguez Ugalde",
    cedula: "•-••••-•567",
    canton: "Alajuela",
    region: "Sede de Occidente",
    merchant: "MaxiPali Alajuela",
    mcc: "5411",
    mccLabel: "Supermercado",
    amount: 28000,
    date: "03/05/2026 10:20",
    severity: "low" as const,
    status: "cleared" as const,
    visaCode: "APPROVE-00",
    alertType: "Identidad verificada",
  },
  {
    id: "A005",
    beneficiary: "Raimunda Vargas Castro",
    cedula: "•-••••-•678",
    canton: "Nicoya",
    region: "Sede Chorotega",
    merchant: "Estación RECOPE Nicoya",
    mcc: "5541",
    mccLabel: "Combustible",
    amount: 18500,
    date: "01/05/2026 08:15",
    severity: "high" as const,
    status: "notified" as const,
    visaCode: "DECLINE-MCC",
    alertType: "MCC restringido",
  },
];

const severityConfig = {
  high:   { label: "Alta",  color: "#CE1126" },
  medium: { label: "Media", color: "#B26A00" },
  low:    { label: "Baja",  color: "#16834A" },
};

const statusConfig = {
  notified:     { label: "Gov. Notificado", fg: "#AD2929", bg: "#ffd6e9" },
  under_review: { label: "En Revisión",     fg: "#875903", bg: "#ffef99" },
  cleared:      { label: "Liberado",        fg: "#2C6849", bg: "#d6f2c4" },
};

function Pill({ fg, bg, children }: { fg: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 700, lineHeight: 1,
      color: fg, background: bg, padding: "4px 9px", borderRadius: 999,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Field({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ minWidth: 0 }}>
      <Typography className="v-typography-label v-typography-color-subtle" style={{ textTransform: "uppercase", letterSpacing: ".04em", fontSize: 10 }}>
        {label}
      </Typography>
      <Typography className={bold ? "v-typography-body-2-bold" : "v-typography-body-2"} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </Typography>
    </div>
  );
}

export default function AlertasPage() {
  const totalDeclined = ALERTS.filter((a) => a.status !== "cleared").length;
  const totalAmount = ALERTS.filter((a) => a.status !== "cleared").reduce((s, a) => s + a.amount, 0);

  return (
    <div className="v-flex v-flex-col v-gap-8">
      <div>
        <Typography tag="h1" className="v-typography-headline-1">Alertas de Riesgo</Typography>
        <Typography className="v-typography-subtitle-2">Interceptaciones de Visa Risk Manager · Mayo 2026</Typography>
      </div>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">Intentos rechazados</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ color: "#CE1126", marginTop: 4 }}>{totalDeclined}</Typography>
          </ContentCardBody>
        </ContentCard>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">Monto bloqueado</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ marginTop: 4, whiteSpace: "nowrap" }}>{formatCRC(totalAmount)}</Typography>
          </ContentCardBody>
        </ContentCard>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">Visa Risk Manager</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ color: VISA_BLUE, marginTop: 4 }}>ACTIVO</Typography>
          </ContentCardBody>
        </ContentCard>
      </div>

      {/* Alert list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ALERTS.map((alert, i) => {
          const sev = severityConfig[alert.severity];
          const stat = statusConfig[alert.status];
          const cleared = alert.status === "cleared";
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -1 }}
            >
              <ContentCard style={{ borderLeft: `4px solid ${sev.color}` }}>
                <ContentCardBody>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: cleared ? "#d6f2c4" : "#ffd6e9",
                    }}>
                      {cleared
                        ? <VisaDeviceSecureLow style={{ color: "#16834A" }} />
                        : <VisaSecurityLockLow style={{ color: "#CE1126" }} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <Typography className="v-typography-body-2-bold">{alert.beneficiary}</Typography>
                        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{alert.cedula}</span>
                        <Pill fg={stat.fg} bg={stat.bg}>{stat.label}</Pill>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
                        <Field label="Comercio" value={alert.merchant} />
                        <Field label="MCC" value={`${alert.mcc} · ${alert.mccLabel}`} />
                        <Field label="Monto" value={formatCRC(alert.amount)} bold />
                        <Field label="Fecha / Hora" value={alert.date} />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <VisaMapLocationLow style={{ width: 13, height: 13, color: "#94a3b8" }} />
                          <Typography className="v-typography-label v-typography-color-subtle">{alert.canton} · {alert.region}</Typography>
                        </span>
                        <span style={{
                          fontSize: 10, fontFamily: "monospace", color: VISA_BLUE,
                          background: "rgba(20,52,203,.08)", padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                        }}>
                          Visa {alert.visaCode}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <VisaWarningLow style={{ width: 13, height: 13, color: sev.color }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: sev.color }}>
                            {alert.alertType} · Severidad {sev.label}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </ContentCardBody>
              </ContentCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
