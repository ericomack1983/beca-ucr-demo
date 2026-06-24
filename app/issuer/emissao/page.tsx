"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ContentCard, ContentCardBody, Typography, Button,
  Switch, Divider, Chip, Label, Select, InputContainer,
} from "@visa/nova-react";
import { VisaLogo as IssuerVisaLogo } from "@/components/issuer/VisaLogo";
import { PROGRAMS } from "@/lib/mock-programs";
import {
  VisaCardGenericLow, VisaDeviceMobileLow, VisaCardManageLow,
  VisaCheckmarkLow, VisaArrowLeftLow, VisaArrowRightLow,
  VisaGovernmentLow, VisaAccountLockLow, VisaDeviceServerLow,
  VisaCloseLow, VisaAttachmentLow,
} from "@visa/nova-icons-react";

function AppleLogo({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill={color}>
      <path d="M14.828 11.701c-.021-2.399 1.956-3.556 2.046-3.613-1.12-1.634-2.862-1.858-3.474-1.878-1.479-.149-2.894.871-3.645.871-.752 0-1.907-.851-3.14-.827-1.614.024-3.1.942-3.933 2.389-1.68 2.914-.432 7.227 1.207 9.591.802 1.156 1.752 2.452 3.008 2.405 1.208-.05 1.665-.784 3.126-.784 1.462 0 1.873.784 3.14.76 1.297-.022 2.121-1.177 2.918-2.337.921-1.34 1.298-2.636 1.318-2.704-.029-.014-2.536-.977-2.571-3.873zM12.306 4.198c.667-.808 1.117-1.929.993-3.048-.961.039-2.119.64-2.807 1.447-.617.715-1.157 1.854-1.012 2.947 1.073.082 2.16-.546 2.826-1.346z" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const CARD_TYPES = [
  { id: "debit",   label: "Débito Visa",    desc: "Asociada a cuenta bancaria BCR",   Icon: VisaCardGenericLow },
  { id: "prepaid", label: "Prepagada Visa", desc: "Saldo precargado — sin cuenta bancaria", Icon: VisaCardManageLow },
];

const VALIDITY_LABELS: Record<string, string> = {
  monthly:   "Mensual (30 días)",
  quarterly: "Trimestral (90 días)",
  semestral: "Semestral (6 meses)",
  annual:    "Anual (12 meses)",
};

const ALL_MCCS = [
  "Supermercados y mercados",
  "Panaderías y reposterías",
  "Ferias del Agricultor",
  "Carnicerías y pescaderías",
  "Verdulerías y hortalizas",
  "Electrónica",
  "Compañías Aéreas",
  "Reparaciones Automotrices",
];

const FUNDING_ACCOUNTS = [
  {
    id: "imas",
    name: "Universidad de Costa Rica",
    acronym: "OBAS · Oficina de Becas y Atención Socioeconómica",
    account: "AG 0011  ••••  3829",
    balance: 14_500_000,
    color: "#003DA5",
  },
  {
    id: "fodesaf",
    name: "Fondo Especial para la Educación Superior",
    acronym: "FEES — CONARE",
    account: "AG 0042  ••••  7104",
    balance: 58_200_000,
    color: "#059669",
  },
  {
    id: "mdhis",
    name: "Comisión Nacional de Préstamos para Educación",
    acronym: "CONAPE — Préstamos Estudiantiles",
    account: "AG 0001  ••••  4823",
    balance: 1_850_000,
    color: "#7C3AED",
  },
];

function VisaBadge() {
  return (
    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "5px 10px 4px", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
      <IssuerVisaLogo color="#1434CB" height={14} />
    </div>
  );
}

function VisaLogo() { return <IssuerVisaLogo color="#1434CB" height={18} />; }

const CARD_INFO_ROWS = (mccRestrict: boolean, validity: string, selectedMccs: string[], atmRestrict: boolean) => [
  { label: "Emisor",           node: <VisaLogo /> },
  { label: "Programa",         value: "Beca Socioeconómica UCR" },
  { label: "Restricción MCC",  value: mccRestrict ? `${selectedMccs.length} categoría${selectedMccs.length !== 1 ? "s" : ""}` : "Inactiva" },
  { label: "Retiro ATM",       value: atmRestrict ? "Bloqueado" : "Permitido" },
  { label: "Vigencia",         value: VALIDITY_LABELS[validity] ?? "Mensual" },
] as Array<{ label: string; value?: string; node?: React.ReactNode }>;

// ── Page ─────────────────────────────────────────────────────────────────────

const ISSUABLE_PROGRAMS = PROGRAMS.filter((p) => p.active);

export default function EmissaoPage() {
  const [view, setView]                 = useState<"form" | "confirm" | "sending" | "done">("form");
  const [programId, setProgramId]       = useState(ISSUABLE_PROGRAMS[0]?.id ?? "");
  const [cardType, setCardType]         = useState<"debit" | "prepaid">("prepaid");
  const [delivery, setDelivery]         = useState<string[]>(["digital"]);
  const [mccRestrict, setMccRestrict]   = useState(true);
  const [selectedMccs, setSelectedMccs] = useState<string[]>(ALL_MCCS.slice(0, 5));
  const [atmRestrict, setAtmRestrict]   = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState("55000");
  const [dailyLimit, setDailyLimit]     = useState("55000");
  const [validity, setValidity]         = useState("monthly");
  const [smsNotif, setSmsNotif]         = useState(true);
  const [cardHovered, setCardHovered]   = useState(false);
  const [fundingAccount, setFundingAccount]       = useState("");
  const [geoFence, setGeoFence]                   = useState(false);
  const [depositDay, setDepositDay]               = useState(20);
  const [depositRecurrence, setDepositRecurrence] = useState<"monthly" | "biweekly" | "twice">("monthly");
  const [geoFiles, setGeoFiles]                   = useState<string[]>([]);
  const geoInputRef = useRef<HTMLInputElement>(null);

  const toggleMcc      = (cat: string) => setSelectedMccs((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]);
  const toggleDelivery = (id: string)  => setDelivery((p) => p.includes(id) ? p.filter((d) => d !== id) : [...p, id]);

  const deliveryLabel = delivery.includes("digital") ? "Digital" : delivery.includes("physical") ? "Física" : "Digital";

  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #003DA5 0%, #001d6c 100%)",
    borderRadius: 18, padding: "24px 22px", color: "#fff",
    position: "relative", aspectRatio: "1.586",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    overflow: "hidden", transition: "transform .35s ease, box-shadow .35s ease",
    transform: cardHovered
      ? "perspective(1200px) rotateX(2deg) rotateY(-4deg) scale(1.03)"
      : "perspective(1200px) rotateX(7deg) rotateY(-12deg)",
    boxShadow: cardHovered
      ? "10px 18px 50px rgba(0,61,165,.45)"
      : "22px 32px 72px rgba(0,61,165,.55), 4px 6px 18px rgba(0,61,165,.25)",
    cursor: "pointer",
  };

  const searchParams = useSearchParams();
  const familiesCount = Math.max(1, Number(searchParams.get("families") || TOTAL_GUARDIANS));

  const selectedProgram = ISSUABLE_PROGRAMS.find((p) => p.id === programId);

  const confirmProps = {
    cardType, delivery, monthlyLimit, validity, mccRestrict, selectedMccs, atmRestrict, familiesCount,
    programName: selectedProgram?.name ?? "—",
    programMeta: selectedProgram ? `ID ${selectedProgram.id} · ${selectedProgram.type}` : "",
    onBack: () => setView("form"), onSend: () => setView("sending"),
  };

  if (view === "confirm") return <ConfirmView {...confirmProps} />;
  if (view === "sending") return <SendingView familiesCount={familiesCount} onDone={() => setView("done")} />;
  if (view === "done")    return <DoneView monthlyLimit={monthlyLimit} familiesCount={familiesCount} onBack={() => setView("form")} />;

  return (
    <div className="v-flex v-flex-col v-gap-6">
      <div>
        <Typography tag="h1" className="v-typography-headline-1">Emisión de Tarjetas</Typography>
        <Typography className="v-typography-subtitle-2">
          Configuración Tarjeta {selectedProgram?.name ?? "Beca Socioeconómica"} Visa · BCR × UCR
        </Typography>
      </div>

      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
        {/* ── Left column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* 0. Program selector */}
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 6 }}>Programa</Typography>
              <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 14 }}>
                Programa registrado para el cual se emitirán las tarjetas
              </Typography>
              <InputContainer>
                <Select aria-label="Programa" value={programId} onChange={(e) => setProgramId(e.target.value)}>
                  {ISSUABLE_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} · ID {p.id} · {p.type}</option>
                  ))}
                </Select>
              </InputContainer>
            </ContentCardBody>
          </ContentCard>

          {/* 1. Card type */}
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 18 }}>Tipo de Tarjeta</Typography>
              <div style={{ display: "flex", gap: 14 }}>
                {CARD_TYPES.map(({ id, label, desc, Icon }) => {
                  const sel = cardType === id;
                  return (
                    <div key={id} onClick={() => setCardType(id as "debit" | "prepaid")}
                      style={{ flex: 1, padding: "18px 16px", borderRadius: 12, cursor: "pointer", border: sel ? "2px solid #003DA5" : "2px solid #E2E8F0", background: sel ? "#EEF2FF" : "#fff", transition: "all .15s ease" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon style={{ color: "#003DA5" }} />
                      </div>
                      <Typography className="v-typography-body-2-bold">{label}</Typography>
                      <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 4 }}>{desc}</Typography>
                    </div>
                  );
                })}
              </div>
            </ContentCardBody>
          </ContentCard>

          {/* 2. MCC restriction */}
          <ContentCard>
            <ContentCardBody>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <Typography className="v-typography-overline">Categorías de Comercio (MCC)</Typography>
                  <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 6 }}>
                    {mccRestrict ? `${selectedMccs.length} de ${ALL_MCCS.length} categorías activas` : "Sin restricción — todas las categorías permitidas"}
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginTop: 2 }}>
                  <Typography className="v-typography-label">Restringir MCC</Typography>
                  <Switch id="mcc-toggle" checked={mccRestrict} onChange={(e) => setMccRestrict(e.target.checked)} />
                </div>
              </div>

              {mccRestrict && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {ALL_MCCS.map((cat) => {
                    const active = selectedMccs.includes(cat);
                    return (
                      <button key={cat} onClick={() => toggleMcc(cat)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, cursor: "pointer", border: active ? "1px solid #C7D2FE" : "1px solid #E2E8F0", background: active ? "#EEF2FF" : "#F8FAFC", transition: "all .12s ease" }}>
                        {active
                          ? <VisaCheckmarkLow style={{ color: "#003DA5", width: 14, height: 14 }} />
                          : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid #CBD5E1" }} />}
                        <Typography className="v-typography-label" style={{ color: active ? "#003DA5" : "#94A3B8" }}>{cat}</Typography>
                      </button>
                    );
                  })}
                </div>
              )}

              <Divider style={{ margin: "16px 0" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <Typography className="v-typography-body-2-bold">Bloqueo de Retiro ATM</Typography>
                  <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 2 }}>Impide retiros en cajeros automáticos</Typography>
                </div>
                <Switch id="atm-toggle" checked={atmRestrict} onChange={(e) => setAtmRestrict(e.target.checked)} />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Geo Fence */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Typography className="v-typography-body-2-bold">Geo Fence</Typography>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: 999, background: "#F0F4FF", color: "#003DA5", border: "1px solid #C7D2FE" }}>OPCIONAL</span>
                    </div>
                    <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 2 }}>Restringe el uso de la tarjeta a comercios autorizados específicos</Typography>
                  </div>
                  <Switch id="geo-toggle" checked={geoFence} onChange={(e) => setGeoFence(e.target.checked)} />
                </div>

                {geoFence && (
                  <div style={{ marginTop: 16 }}>
                    <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 10 }}>
                      Cargue la lista de Card Acceptors (comercios permitidos). La tarjeta solo procesará transacciones en los terminales registrados.
                    </Typography>
                    <input ref={geoInputRef} type="file" multiple accept=".csv,.json,.xlsx" style={{ display: "none" }}
                      onChange={(e) => { if (!e.target.files) return; setGeoFiles((p) => [...p, ...Array.from(e.target.files!).map((f) => f.name)]); }} />
                    <div onClick={() => geoInputRef.current?.click()}
                      style={{ border: "2px dashed #C7D2FE", borderRadius: 12, padding: "22px 20px", background: "#F8FAFF", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", transition: "all .12s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF2FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#F8FAFF")}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EEF2FF", border: "1.5px solid #C7D2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <VisaAttachmentLow style={{ color: "#003DA5", width: 22, height: 22 }} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <Typography className="v-typography-body-2-bold" style={{ color: "#003DA5" }}>Cargar lista de Card Acceptors</Typography>
                        <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 3 }}>CSV · JSON · XLSX — cada fila: terminal_id, nombre, ciudad</Typography>
                      </div>
                    </div>
                    {geoFiles.length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                        {geoFiles.map((name, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #6EE7B7" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <VisaCheckmarkLow style={{ color: "#10B981", width: 13, height: 13, flexShrink: 0 }} />
                              <Typography className="v-typography-label" style={{ color: "#065F46" }}>{name}</Typography>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setGeoFiles((p) => p.filter((_, idx) => idx !== i)); }}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 0 }}>
                              <VisaCloseLow style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        ))}
                        <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 4 }}>
                          {geoFiles.length} archivo{geoFiles.length !== 1 ? "s" : ""} cargado{geoFiles.length !== 1 ? "s" : ""}
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ContentCardBody>
          </ContentCard>

          {/* 3. Funding account */}
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 4 }}>Cuenta de Origen</Typography>
              <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 18 }}>Seleccione la cuenta de fondeo para este lote de tarjetas</Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FUNDING_ACCOUNTS.map((acc) => {
                  const sel = fundingAccount === acc.id;
                  const batchCost = familiesCount * Number(monthlyLimit);
                  const hasFunds  = acc.balance >= batchCost;
                  return (
                    <div key={acc.id} onClick={() => setFundingAccount(acc.id)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, cursor: "pointer", border: sel ? "2px solid #003DA5" : "1.5px solid #E2E8F0", background: sel ? "#EEF2FF" : "#fff", transition: "all .15s ease" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: `${acc.color}14`, border: `1.5px solid ${acc.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <VisaGovernmentLow style={{ color: acc.color, width: 22, height: 22 }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography className="v-typography-body-2-bold" style={{ color: sel ? "#003DA5" : "#1E293B" }}>{acc.name}</Typography>
                        <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                          <Typography className="v-typography-label v-typography-color-subtle">{acc.acronym}</Typography>
                          <Typography className="v-typography-label v-typography-color-subtle" style={{ fontFamily: "monospace" }}>{acc.account}</Typography>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: hasFunds ? "#1E293B" : "#EF4444", lineHeight: 1 }}>
                          ₡{acc.balance.toLocaleString("es-CR")}
                        </div>
                        <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 2 }}>disponible</Typography>
                      </div>
                    </div>
                  );
                })}
              </div>
              {fundingAccount && (() => {
                const acc = FUNDING_ACCOUNTS.find((a) => a.id === fundingAccount)!;
                const batchCost = familiesCount * Number(monthlyLimit);
                const hasFunds  = acc.balance >= batchCost;
                return (
                  <div style={{ marginTop: 16, padding: "11px 16px", borderRadius: 10, background: hasFunds ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${hasFunds ? "#6EE7B7" : "#FECACA"}`, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: hasFunds ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {hasFunds ? <VisaCheckmarkLow style={{ color: "#fff", width: 12, height: 12 }} /> : <VisaCloseLow style={{ color: "#fff", width: 12, height: 12 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Typography className="v-typography-body-2-bold" style={{ color: hasFunds ? "#065F46" : "#991B1B" }}>
                        {hasFunds ? "Fondos disponibles para este lote" : "Fondos insuficientes"}
                      </Typography>
                      <Typography className="v-typography-label" style={{ color: hasFunds ? "#047857" : "#B91C1C", marginTop: 2 }}>
                        {hasFunds
                          ? `Saldo: ₡${acc.balance.toLocaleString("es-CR")} · Costo del lote: ₡${batchCost.toLocaleString("es-CR")}`
                          : `Necesario: ₡${batchCost.toLocaleString("es-CR")} · Saldo disponible: ₡${acc.balance.toLocaleString("es-CR")}`}
                      </Typography>
                    </div>
                  </div>
                );
              })()}
            </ContentCardBody>
          </ContentCard>

          {/* 4. Amounts + Deposit Schedule */}
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 18 }}>Montos y Límites</Typography>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <Label htmlFor="monthly">Monto de desembolso mensual</Label>
                  <input id="monthly" value={`₡${monthlyLimit}`}
                    onChange={(e) => setMonthlyLimit(e.target.value.replace(/\D/g, ""))}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: 14, marginTop: 6, boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Label htmlFor="daily">Límite diario de transacciones</Label>
                  <input id="daily" value={`₡${dailyLimit}`}
                    onChange={(e) => setDailyLimit(e.target.value.replace(/\D/g, ""))}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: 14, marginTop: 6, boxSizing: "border-box" }} />
                </div>
              </div>

              <Divider style={{ margin: "20px 0" }} />

              {/* Deposit schedule */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg viewBox="0 0 18 18" width="16" height="16" fill="none"><rect x="1" y="3" width="16" height="14" rx="2.5" stroke="#003DA5" strokeWidth="1.5"/><path d="M1 7h16" stroke="#003DA5" strokeWidth="1.5"/><path d="M5 1v3M13 1v3" stroke="#003DA5" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <Typography className="v-typography-overline" style={{ letterSpacing: "0.06em" }}>Programación del Depósito</Typography>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 10 }}>Recurrencia</Typography>
                  <div style={{ display: "flex", gap: 8 }}>
                    {([
                      { id: "monthly",  label: "Mensual",       sub: "1× por mes" },
                      { id: "biweekly", label: "Quincenal",     sub: "2× por mes" },
                      { id: "twice",    label: "2 fechas fijas", sub: "Días 1 y 15" },
                    ] as const).map(({ id, label, sub }) => {
                      const sel = depositRecurrence === id;
                      return (
                        <button key={id} onClick={() => setDepositRecurrence(id)}
                          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: sel ? "2px solid #003DA5" : "1.5px solid #E2E8F0", background: sel ? "#EEF2FF" : "#F8FAFC", textAlign: "center", transition: "all .14s ease" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: sel ? "#003DA5" : "#1E293B", marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 10, color: sel ? "#4F7EFF" : "#94A3B8" }}>{sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {depositRecurrence !== "twice" && (
                  <div style={{ marginBottom: 16 }}>
                    <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 10 }}>Día del mes para crédito</Typography>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
                        const sel = depositDay === d;
                        return (
                          <button key={d} onClick={() => setDepositDay(d)}
                            style={{ height: 34, borderRadius: 8, cursor: "pointer", border: sel ? "2px solid #003DA5" : "1px solid #E2E8F0", background: sel ? "#003DA5" : "#F8FAFC", color: sel ? "#fff" : "#1E293B", fontSize: 12, fontWeight: sel ? 700 : 400, transition: "all .12s ease" }}>
                            {d}
                          </button>
                        );
                      })}
                      {[29, 30, 31].map((d) => {
                        const sel = depositDay === d;
                        return (
                          <button key={d} onClick={() => setDepositDay(d)}
                            style={{ height: 34, borderRadius: 8, cursor: "pointer", border: sel ? "2px solid #003DA5" : "1px dashed #CBD5E1", background: sel ? "#003DA5" : "#fff", color: sel ? "#fff" : "#94A3B8", fontSize: 12, fontWeight: sel ? 700 : 400, transition: "all .12s ease" }}>
                            {d}
                          </button>
                        );
                      })}
                    </div>
                    <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 6, fontSize: 10 }}>
                      * Los días 29–31 se acreditarán el último día hábil del mes cuando no existan
                    </Typography>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "#F0F4FF", border: "1px solid #C7D2FE" }}>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><circle cx="8" cy="8" r="7" stroke="#003DA5" strokeWidth="1.5"/><path d="M8 4.5v4l2.5 1.5" stroke="#003DA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <Typography className="v-typography-label" style={{ color: "#003DA5" }}>
                    {depositRecurrence === "twice"
                      ? "Próximos depósitos: día 1 y día 15 de cada mes"
                      : depositRecurrence === "biweekly"
                      ? `Próximos depósitos: día ${depositDay} y día ${Math.min(depositDay + 15, 28)} de cada mes`
                      : `Próximo depósito: día ${String(depositDay).padStart(2, "0")} de cada mes`}
                  </Typography>
                </div>
              </div>
            </ContentCardBody>
          </ContentCard>

          {/* 5. Delivery type */}
          <ContentCard>
            <ContentCardBody>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Typography className="v-typography-overline">Tipo de Entrega</Typography>
                <Chip>{delivery.length} seleccionado{delivery.length !== 1 ? "s" : ""}</Chip>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { id: "digital",   label: "Solo Digital",         desc: "Tarjeta virtual inmediata",    iconEl: <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}><VisaDeviceMobileLow style={{ color: "#64748B" }} /></div> },
                  { id: "applepay",  label: "Apple Pay",            desc: "Agregar a Apple Wallet",       iconEl: <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}><AppleLogo color="#64748B" /></div> },
                  { id: "googlepay", label: "Google Pay",           desc: "Agregar a Google Wallet",      iconEl: <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#4285F4" }}>G</div> },
                  { id: "physical",  label: "Tarjeta Física",       desc: "Tarjeta plástica vía correo",  iconEl: <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}><VisaCardManageLow style={{ color: "#64748B" }} /></div> },
                ].map(({ id, label, desc, iconEl }) => {
                  const sel = delivery.includes(id);
                  return (
                    <div key={id} onClick={() => toggleDelivery(id)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, cursor: "pointer", border: "1.5px solid #E2E8F0", background: sel ? "#EEF2FF" : "#fff", transition: "all .12s ease" }}>
                      {iconEl}
                      <div style={{ flex: 1 }}>
                        <Typography className="v-typography-body-2-bold">{label}</Typography>
                        <Typography className="v-typography-label v-typography-color-subtle">{desc}</Typography>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ContentCardBody>
          </ContentCard>

          {/* 6. Validity & notifications */}
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 18 }}>Vigencia y Notificaciones</Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 8 }}>Vigencia de la tarjeta</Typography>
                  <select value={validity} onChange={(e) => setValidity(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", fontSize: 14, color: "#1E293B", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
                    <option value="monthly">Mensual (30 días)</option>
                    <option value="quarterly">Trimestral (90 días)</option>
                    <option value="semestral">Semestral (6 meses)</option>
                    <option value="annual">Anual (12 meses)</option>
                  </select>
                </div>
                <Divider />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <Typography className="v-typography-body-2-bold">Notificaciones SMS/Push</Typography>
                    <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 2 }}>Alertas de transacción y saldo</Typography>
                  </div>
                  <Switch id="sms" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} />
                </div>
              </div>
            </ContentCardBody>
          </ContentCard>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button className="v-action-primary" onClick={() => setView("confirm")}>
              <VisaCardManageLow /> Emitir Tarjetas
            </Button>
          </div>
        </div>

        {/* ── Right column: card preview (sticky) ── */}
        <div style={{ width: 300, flexShrink: 0, position: "sticky", top: 24 }}>
          <ContentCard>
            <ContentCardBody>
              <Typography className="v-typography-overline" style={{ marginBottom: 20 }}>Vista Previa de la Tarjeta</Typography>
              <div style={cardStyle} onMouseEnter={() => setCardHovered(true)} onMouseLeave={() => setCardHovered(false)}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: "linear-gradient(135deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.04) 45%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, borderRadius: "50%", border: "50px solid rgba(255,255,255,.05)", pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                      {cardType === "prepaid" ? "Prepagada" : "Débito"}
                    </div>
                    <div style={{ width: 32, height: 24, borderRadius: 4, background: "linear-gradient(135deg, #D4A017 0%, #F0C040 50%, #C28800 100%)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)" }} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", letterSpacing: "-0.5px", lineHeight: 1, textShadow: "0 1px 4px rgba(0,0,0,.2)" }}>VISA</div>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ color: "rgba(255,255,255,.45)", letterSpacing: "0.22em", fontSize: 13, marginBottom: 14 }}>•••• •••• •••• 0000</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Monto Mensual</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>₡{Number(monthlyLimit).toLocaleString("es-CR")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Entrega</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{deliveryLabel}</div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: -18, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #CE1126, #ff1a35, #CE1126)" }} />
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #E2E8F0", display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 10, columnGap: 16 }}>
                {CARD_INFO_ROWS(mccRestrict, validity, selectedMccs, atmRestrict).map(({ label, value, node }) => (
                  <React.Fragment key={label}>
                    <Typography className="v-typography-label v-typography-color-subtle">{label}</Typography>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      {node ?? <Typography className="v-typography-label">{value}</Typography>}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {mccRestrict && selectedMccs.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selectedMccs.map((cat) => (
                    <span key={cat} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#EEF2FF", color: "#003DA5", border: "1px solid #C7D2FE", lineHeight: "18px" }}>{cat}</span>
                  ))}
                </div>
              )}
            </ContentCardBody>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation view ─────────────────────────────────────────────────────────

const CANTONS = [
  { name: "Desamparados", count: 3 },
  { name: "Liberia",      count: 2 },
  { name: "Alajuela",     count: 2 },
  { name: "Cartago",      count: 1 },
  { name: "Limón",        count: 1 },
  { name: "Golfito",      count: 1 },
];
const TOTAL_GUARDIANS = CANTONS.reduce((s, c) => s + c.count, 0);

const PRE_SEND_CHECKS = [
  "Sin registros duplicados (Sistema de Becas + Alias Directory)",
  "Todos los datos completos",
  "Montos dentro del límite (₡22.000 — ₡85.000)",
  "Configuración MCC válida — restricciones activas",
  "Verificación biométrica Visa Ready completada",
];

function ConfirmView({ cardType, delivery, monthlyLimit, validity, mccRestrict, selectedMccs, atmRestrict, familiesCount, programName, programMeta, onBack, onSend }: {
  cardType: string; delivery: string[]; monthlyLimit: string; validity: string;
  mccRestrict: boolean; selectedMccs: string[]; atmRestrict: boolean;
  familiesCount: number; programName: string; programMeta: string; onBack: () => void; onSend: () => void;
}) {
  const [cantonBreakdown, setCantonBreakdown] = useState<{ name: string; count: number }[]>([]);
  const [checkedCount, setCheckedCount]       = useState(0);

  useEffect(() => {
    if (checkedCount >= PRE_SEND_CHECKS.length) return;
    const t = setTimeout(() => setCheckedCount((c) => c + 1), 520);
    return () => clearTimeout(t);
  }, [checkedCount]);

  useEffect(() => {
    try {
      const stored: { canton: string }[] = JSON.parse(sessionStorage.getItem("emissao_families") || "[]");
      if (stored.length > 0) {
        const counts: Record<string, number> = {};
        stored.forEach((f) => { counts[f.canton] = (counts[f.canton] || 0) + 1; });
        setCantonBreakdown(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
      } else {
        setCantonBreakdown(CANTONS);
      }
    } catch { setCantonBreakdown(CANTONS); }
  }, []);

  const total         = familiesCount * Number(monthlyLimit);
  const deliveryLabel = delivery.includes("digital") ? "Solo Digital" : delivery.includes("physical") ? "Tarjeta Física" : "Digital";
  const cardLabel     = cardType === "prepaid" ? "Prepagada Visa" : "Débito Visa";
  const validityLabel = VALIDITY_LABELS[validity] ?? "Mensual";
  const maxCount      = Math.max(...cantonBreakdown.map((c) => c.count), 1);

  const stats = [
    { label: "Programa",              value: programName,                               sub: programMeta },
    { label: "Hogares aprobados",     value: String(familiesCount),                    sub: "en el lote" },
    { label: "Monto total del lote",  value: `₡${total.toLocaleString("es-CR")}`,      sub: `₡${Number(monthlyLimit).toLocaleString("es-CR")} / hogar` },
    { label: "Tipo de tarjeta",       value: cardLabel,                                 sub: "Visa" },
    { label: "Tipo de entrega",       value: deliveryLabel,                             sub: validityLabel },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#003DA5", color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>4</div>
        <div>
          <Typography tag="h1" className="v-typography-headline-1">Pre-aprobación y lote bancario</Typography>
          <Typography className="v-typography-subtitle-2">Revise el lote antes de enviar al emisor BCR</Typography>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {stats.map(({ label, value, sub }) => (
          <ContentCard key={label}>
            <ContentCardBody style={{ padding: "18px 18px 14px" }}>
              <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 8 }}>{label}</Typography>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#1E293B", lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
              <Typography className="v-typography-label v-typography-color-subtle">{sub}</Typography>
            </ContentCardBody>
          </ContentCard>
        ))}
      </div>

      <ContentCard>
        <ContentCardBody>
          <Typography className="v-typography-overline" style={{ marginBottom: 18 }}>Composición por Cantón</Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cantonBreakdown.map(({ name, count }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Typography className="v-typography-body-2" style={{ width: 130, flexShrink: 0 }}>{name}</Typography>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#EEF2FF", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 999, background: "#003DA5", width: `${(count / maxCount) * 100}%`, transition: "width .4s ease" }} />
                </div>
                <Typography className="v-typography-body-2-bold" style={{ width: 20, textAlign: "right", flexShrink: 0 }}>{count}</Typography>
              </div>
            ))}
          </div>
        </ContentCardBody>
      </ContentCard>

      <ContentCard>
        <ContentCardBody>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <Typography className="v-typography-overline">Validación Pre-Envío</Typography>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#003DA5", background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 999, padding: "2px 10px" }}>
              {checkedCount}/{PRE_SEND_CHECKS.length}
            </span>
          </div>
          <motion.div style={{ display: "flex", flexDirection: "column", gap: 12 }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.18 } } }}>
            {PRE_SEND_CHECKS.map((check, i) => {
              const isChecked = i < checkedCount;
              const isPending = i === checkedCount;
              return (
                <motion.div key={check} variants={{ hidden: { opacity: 0, x: -18 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AnimatePresence mode="wait">
                    {isChecked ? (
                      <motion.div key="checked" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "#D1FAE5", border: "1.5px solid #6EE7B7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 12 10" width="11" height="9" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </motion.div>
                    ) : (
                      <motion.div key="pending" initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: isPending ? "#FEF3C7" : "#F1F5F9", border: `1.5px solid ${isPending ? "#FCD34D" : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isPending && <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #F59E0B", borderTopColor: "transparent", animation: "spin .65s linear infinite" }} />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Typography className="v-typography-body-2" style={{ flex: 1, color: isChecked ? "#1E293B" : isPending ? "#92400E" : "#94A3B8", transition: "color .3s ease" }}>
                    {check}
                  </Typography>
                  <AnimatePresence>
                    {isChecked && (
                      <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}
                        style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7", flexShrink: 0 }}>
                        Verificado
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </ContentCardBody>
      </ContentCard>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
        <Button className="v-action-secondary" onClick={onBack}><VisaArrowLeftLow /> Volver</Button>
        <Button className="v-action-primary" onClick={onSend}><VisaArrowRightLow /> Enviar al banco</Button>
      </div>
    </div>
  );
}

// ── Confetti burst ────────────────────────────────────────────────────────────

function ConfettiBlast() {
  useEffect(() => {
    let cancelled = false;
    const COLORS = ["#003DA5", "#CE1126", "#ffffff", "#10B981", "#7C3AED", "#F5A300"];
    async function burst() {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      confetti({ particleCount: 90, angle: 90, spread: 75, startVelocity: 45, origin: { x: 0.5, y: 0.55 }, colors: COLORS, zIndex: 9999 });
      setTimeout(() => { if (cancelled) return; confetti({ particleCount: 55, angle: 65, spread: 55, startVelocity: 40, origin: { x: 0.15, y: 0.6 }, colors: COLORS, zIndex: 9999 }); confetti({ particleCount: 55, angle: 115, spread: 55, startVelocity: 40, origin: { x: 0.85, y: 0.6 }, colors: COLORS, zIndex: 9999 }); }, 280);
      setTimeout(() => { if (cancelled) return; confetti({ particleCount: 40, angle: 90, spread: 120, startVelocity: 25, gravity: 0.7, origin: { x: 0.5, y: 0.4 }, colors: COLORS, zIndex: 9999 }); }, 600);
    }
    burst();
    return () => { cancelled = true; };
  }, []);
  return null;
}

// ── Sending animation ─────────────────────────────────────────────────────────

const SEND_STEPS  = ["Generando archivo", "Validando registros", "Enviando al Emisor", "Procesando en BCR", "Lote procesado"];
const SEND_ANIM   = `@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}} @keyframes popIn{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`;
const ANIM_STATUS = ["Cargando datos de los beneficiarios...", "Cifrando lote AES-256...", "Enrutando por Red Visa...", "Provisionando tarjetas...", "Procesado con éxito", "Procesado con éxito"];
const ANIM_PHASE_DURATIONS = [900, 900, 1900, 900, 950, 1900];

const UCR_SVG = (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="8" y="18" width="24" height="19" rx="1" fill="#003DA5" opacity="0.85"/>
    <polygon points="4,19 20,5 36,19" fill="#0047BE"/>
    <rect x="15" y="26" width="10" height="11" rx="1" fill="#001d6c"/>
    <rect x="10" y="22" width="5" height="5" rx="0.5" fill="rgba(255,255,255,.35)"/>
    <rect x="25" y="22" width="5" height="5" rx="0.5" fill="rgba(255,255,255,.35)"/>
  </svg>
);

function DarkPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#05091A", borderRadius: 16, padding: "36px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

function NodeLabel({ title, sub, subColor }: { title: string; sub: string; subColor?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 10, color: subColor ?? "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>{sub}</div>
    </div>
  );
}

function AnimatedConnectionLine({ active, color, particleColor }: { active: boolean; color: string; particleColor: string }) {
  return (
    <div style={{ flex: 1, alignSelf: "center", position: "relative", height: 20, minWidth: 16 }}>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5, transform: "translateY(-50%)", backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.1) 55%, transparent 55%)", backgroundSize: "8px 1.5px" }} />
      <motion.div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)", background: `linear-gradient(90deg, ${color}, ${particleColor})`, boxShadow: `0 0 6px ${color}`, transformOrigin: "left center" }}
        initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ duration: 0.75, ease: "easeInOut" }} />
      {active && [0, 1, 2].map((i) => (
        <motion.div key={i} style={{ position: "absolute", top: "50%", marginTop: -4, width: 8, height: 8, borderRadius: "50%", background: particleColor, boxShadow: `0 0 10px 3px ${particleColor}` }}
          animate={{ left: ["0%", "100%"] }} transition={{ duration: 1.8 + i * 0.45, delay: i * 0.55, repeat: Infinity, ease: "linear" }} />
      ))}
    </div>
  );
}

function BatchTransferAnimation({ familiesCount }: { familiesCount: number }) {
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => {
    if (animPhase >= 5) return;
    const timer = setTimeout(() => setAnimPhase((p) => p + 1), ANIM_PHASE_DURATIONS[animPhase]);
    return () => clearTimeout(timer);
  }, [animPhase]);

  const visible       = (minPhase: number) => animPhase >= minPhase;
  const issuerComplete = animPhase >= 3;
  const showSuccess    = animPhase >= 4;

  const nodeBase: React.CSSProperties = { backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 20, padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 112, zIndex: 2, flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" };

  return (
    <div style={{ background: "linear-gradient(135deg, #021224 0%, #000814 100%)", borderRadius: 24, position: "relative", overflow: "hidden", padding: "36px 44px 28px" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.055, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div style={{ position: "absolute", top: "15%", left: "6%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,61,165,0.2) 0%, transparent 70%)", filter: "blur(44px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", right: "6%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)", filter: "blur(44px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", left: "42%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(206,17,38,0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 4 }}>Enviando Lote al Emisor</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", letterSpacing: "0.03em" }}>
            Procesando {familiesCount} hogar{familiesCount !== 1 ? "es" : ""} · Beca Socioeconómica UCR
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", minHeight: 168 }}>
          {/* Node 1: UCR */}
          <motion.div style={{ ...nodeBase, background: "rgba(0,61,165,0.12)", border: "1px solid rgba(0,61,165,0.28)", boxShadow: "0 0 30px rgba(0,61,165,0.3), 0 8px 24px rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}>
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
              <VisaGovernmentLow style={{ color: "#5B8CFF", width: 34, height: 34 }} />
            </motion.div>
            <NodeLabel title="UCR Costa Rica" sub={`${familiesCount} Hogar${familiesCount !== 1 ? "es" : ""}`} />
          </motion.div>

          <AnimatedConnectionLine active={visible(1)} color="#003DA5" particleColor="#7EB5FF" />

          {/* Node 2: Encrypted Batch */}
          <motion.div style={{ ...nodeBase, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)", boxShadow: "0 0 28px rgba(124,58,237,0.25), 0 8px 24px rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0, y: 18, scale: 0.88 }} animate={{ opacity: visible(1) ? 1 : 0, y: visible(1) ? 0 : 18, scale: visible(1) ? 1 : 0.88 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <motion.div animate={visible(1) ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <VisaAccountLockLow style={{ color: "#A78BFA", width: 34, height: 34 }} />
            </motion.div>
            <NodeLabel title="Encrypted Batch" sub="AES-256 Secured" />
          </motion.div>

          <AnimatedConnectionLine active={visible(2)} color="#7C3AED" particleColor="#C4B5FD" />

          {/* Node 3: Visa Network */}
          <motion.div style={{ ...nodeBase, background: "rgba(0,61,165,0.1)", border: "1px solid rgba(245,163,0,0.22)", boxShadow: "0 0 28px rgba(0,61,165,0.22), 0 0 60px rgba(245,163,0,0.07), 0 8px 24px rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0, y: 18, scale: 0.88 }} animate={{ opacity: visible(2) ? 1 : 0, y: visible(2) ? 0 : 18, scale: visible(2) ? 1 : 0.88 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div style={{ position: "relative", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div animate={visible(2) ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#F5A300", borderRightColor: "rgba(245,163,0,0.25)", borderBottomColor: "rgba(245,163,0,0.08)" }} />
              <div style={{ fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "#fff", letterSpacing: "-0.5px", textShadow: "0 0 12px rgba(255,255,255,0.3)" }}>VISA</div>
            </div>
            <NodeLabel title="Visa Network" sub="Alias Directory Service" />
          </motion.div>

          <AnimatedConnectionLine active={visible(3)} color={issuerComplete ? "#10B981" : "#003DA5"} particleColor={issuerComplete ? "#34D399" : "#7EB5FF"} />

          {/* Node 4: BCR Issuer */}
          <motion.div style={{ ...nodeBase, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", position: "relative" }}
            initial={{ opacity: 0, y: 18, scale: 0.88 }} animate={{ opacity: visible(3) ? 1 : 0, y: visible(3) ? 0 : 18, scale: visible(3) ? 1 : 0.88 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <motion.div animate={{ opacity: issuerComplete ? 1 : 0 }} transition={{ duration: 0.65 }}
              style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.45)", boxShadow: "0 0 40px rgba(16,185,129,0.45)" }} />
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
              <VisaDeviceServerLow style={{ color: issuerComplete ? "#34D399" : "#6EE7B7", width: 34, height: 34 }} />
            </motion.div>
            <NodeLabel title="BCR Emisor" sub={issuerComplete ? "Tarjetas Emitidas ✓" : "Provisionando Tarjetas"} subColor={issuerComplete ? "#34D399" : undefined} />
          </motion.div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5 }}
              style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 60, height: 40, flexShrink: 0 }}>
                {[2, 1, 0].map((i) => (
                  <motion.div key={i} initial={{ y: 0, opacity: 0 }} animate={{ y: -(i * 5), opacity: 1 }} transition={{ delay: (2 - i) * 0.1, duration: 0.4, ease: "easeOut" }}
                    style={{ position: "absolute", left: i * 3, top: i * 2, width: 50, height: 32, borderRadius: 5, background: `linear-gradient(135deg, ${["#003DA5", "#0047BE", "#0052CC"][i]} 0%, #001d6c 100%)`, boxShadow: "0 2px 10px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", left: 4, top: 5, width: 8, height: 6, borderRadius: 1.5, background: "linear-gradient(135deg, #C8960C, #F0C040)", opacity: 0.85 }} />
                    <div style={{ position: "absolute", bottom: 4, right: 4, fontSize: "5.5px", fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}>VISA</div>
                  </motion.div>
                ))}
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    style={{ width: 22, height: 22, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 12 10" width="11" height="9" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>
                    {familiesCount} Tarjeta{familiesCount !== 1 ? "s" : ""} Emitida{familiesCount !== 1 ? "s" : ""} con Éxito
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", paddingLeft: 30, letterSpacing: "0.02em" }}>Beca Socioeconómica · UCR × BCR × Visa</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <motion.span key={animPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ fontSize: 10, color: animPhase >= 4 ? "rgba(16,185,129,0.65)" : "rgba(255,255,255,0.28)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600 }}>
            {ANIM_STATUS[animPhase]}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ── SendingView ───────────────────────────────────────────────────────────────

interface IssuedGuardian { id?: string; name: string; canton: string; last4: string; }

function SendingView({ onDone, familiesCount = TOTAL_GUARDIANS }: { onDone: () => void; familiesCount?: number }) {
  const router = useRouter();
  const [progress, setProgress]               = useState(0);
  const [done, setDone]                       = useState(false);
  const [issuedGuardians, setIssuedGuardians] = useState<IssuedGuardian[]>([]);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const stored: IssuedGuardian[] = JSON.parse(sessionStorage.getItem("emissao_families") || "[]");
      setIssuedGuardians(stored.length > 0 ? stored.slice(0, familiesCount) : SAMPLE_ISSUED.slice(0, familiesCount));
    } catch { setIssuedGuardians(SAMPLE_ISSUED.slice(0, familiesCount)); }
  }, [familiesCount]);

  useEffect(() => {
    raf.current = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(raf.current!); setDone(true); return 100; } return p + 1; });
    }, 80);
    return () => clearInterval(raf.current!);
  }, []);

  const stepIdx       = progress < 20 ? 0 : progress < 40 ? 1 : progress < 65 ? 2 : progress < 90 ? 3 : 4;
  const processedCount = Math.floor((progress / 100) * familiesCount);

  return (
    <>
      <style>{SEND_ANIM}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn .4s ease" }}>
        <div>
          <Typography tag="h1" className="v-typography-headline-1">Enviando lote al banco emisor</Typography>
          <Typography className="v-typography-subtitle-2">Procesando {familiesCount} hogares · Beca Socioeconómica UCR × BCR</Typography>
        </div>

        <BatchTransferAnimation familiesCount={familiesCount} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          {SEND_STEPS.map((step, i) => {
            const completed = done || i < stepIdx;
            const current   = !done && i === stepIdx;
            return (
              <React.Fragment key={step}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: current ? "#FEF3C7" : "transparent" }}>
                  {completed && <svg viewBox="0 0 12 10" width="11" height="9" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {current   && <div style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid #F59E0B", borderTopColor: "transparent", animation: "spin .8s linear infinite", flexShrink: 0 }} />}
                  <span style={{ fontSize: 12, fontWeight: current ? 700 : completed ? 600 : 400, color: current ? "#92400E" : completed ? "#10B981" : "#94A3B8" }}>{step}</span>
                </div>
                {i < SEND_STEPS.length - 1 && <div style={{ width: 18, height: 1, background: "#E2E8F0", flexShrink: 0 }} />}
              </React.Fragment>
            );
          })}
        </div>

        <ContentCard>
          <ContentCardBody style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <Typography className="v-typography-label v-typography-color-subtle">
                {done ? "Lote procesado con éxito" : SEND_STEPS[stepIdx] + "..."}
              </Typography>
              <Typography className="v-typography-label" style={{ fontWeight: 700, color: done ? "#10B981" : "#003DA5" }}>{progress}%</Typography>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: "#E2E8F0", overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", borderRadius: 999, width: `${progress}%`, background: done ? "#10B981" : "#003DA5", transition: "width .08s linear, background .4s ease" }} />
            </div>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ fontFamily: "monospace", fontSize: 11 }}>
              Procesando registro <strong>{processedCount}</strong> de <strong>{familiesCount}</strong>
            </Typography>
          </ContentCardBody>
        </ContentCard>

        {done && (() => {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn .6s ease" }}>
              <ConfettiBlast />
              <div style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #DDE7FF 100%)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#003DA5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", animation: "popIn .5s cubic-bezier(.36,.07,.19,.97) forwards" }}>
                  <svg viewBox="0 0 16 13" width="20" height="16" fill="none"><path d="M1 6.5l5 5L15 1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#003DA5", marginBottom: 8 }}>¡Lote emitido con éxito!</div>
                <div style={{ fontSize: 13, color: "#4B5563", marginBottom: 28 }}>Todas las tarjetas Beca Socioeconómica Visa han sido enviadas a los hogares beneficiarios</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 72 }}>
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#003DA5", lineHeight: 1 }}>{issuedGuardians.length}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Tarjetas emitidas</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#CE1126", lineHeight: 1 }}>
                      ₡{(issuedGuardians.length * 55000).toLocaleString("es-CR")}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>Total desembolsado</div>
                  </div>
                </div>
              </div>

              <ContentCard>
                <ContentCardBody>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <Typography className="v-typography-body-2-bold">Estado de emisión individual</Typography>
                      <Typography className="v-typography-label v-typography-color-subtle">{issuedGuardians.length} de {issuedGuardians.length} tarjetas emitidas</Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 100, height: 5, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: "100%", background: "#10B981", borderRadius: 999 }} />
                      </div>
                      <Typography className="v-typography-label" style={{ fontWeight: 700, color: "#10B981" }}>100%</Typography>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {issuedGuardians.map((g, idx) => (
                      <div key={g.last4 + idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#F8FAFC" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#D1FAE5", border: "1.5px solid #6EE7B7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg viewBox="0 0 12 10" width="10" height="8" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography className="v-typography-body-2-bold" style={{ fontSize: 13 }}>{g.name}</Typography>
                          <Typography className="v-typography-label v-typography-color-subtle">{g.canton} · Costa Rica</Typography>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <VisaBadge />
                          <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>•••• {g.last4}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#065F46", background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 999, padding: "2px 8px" }}>✓ Confirmado</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ContentCardBody>
              </ContentCard>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 4 }}>
                <Button className="v-action-primary" onClick={() => router.push("/issuer/analytics")}><VisaArrowRightLow /> Ver Analytics</Button>
                <Button className="v-action-secondary">↓ Descargar reporte</Button>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}

// ── DoneView ──────────────────────────────────────────────────────────────────

const SAMPLE_ISSUED: IssuedGuardian[] = [
  { name: "María Fernández Rojas",    canton: "Desamparados",  last4: "7291" },
  { name: "Carlos Mora Quesada",      canton: "Liberia",       last4: "4853" },
  { name: "Ana Jiménez Solano",       canton: "Pérez Zeledón", last4: "3302" },
  { name: "Roberto Rodríguez Ugalde", canton: "Alajuela",      last4: "8847" },
  { name: "Francisca Solano Quesada", canton: "Cartago",       last4: "6614" },
  { name: "Raimunda Vargas Castro",   canton: "Nicoya",        last4: "2239" },
  { name: "Pedro Herrera Campos",     canton: "San Carlos",    last4: "9918" },
  { name: "Luisa Brenes Mora",        canton: "Limón",         last4: "5575" },
  { name: "Manuel Araya Quesada",     canton: "Quepos",        last4: "1163" },
  { name: "Concepción Alvarado Ríos", canton: "Golfito",       last4: "4428" },
];

function DoneView({ monthlyLimit, familiesCount = TOTAL_GUARDIANS, onBack }: { monthlyLimit: string; familiesCount?: number; onBack: () => void }) {
  const router = useRouter();
  const total  = familiesCount * Number(monthlyLimit);

  return (
    <>
      <style>{SEND_ANIM}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn .4s ease" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>5</div>
          <div>
            <Typography tag="h1" className="v-typography-headline-1">Emisión digital e integración</Typography>
            <Typography className="v-typography-subtitle-2">Tarjetas Beca Socioeconómica Visa emitidas con éxito · UCR × BCR × Visa</Typography>
          </div>
        </div>

        <DarkPanel>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <svg viewBox="0 0 152 48" width="48" height="15" xmlns="http://www.w3.org/2000/svg">
                <path fill="#10B981" d="M57.8 47.3 68 1.1h16.2L73.9 47.3H57.8zm65.5-45.1c-3.2-1.2-8.2-2.5-14.4-2.5-15.9 0-27.1 8.1-27.2 19.8-.1 8.6 8 13.4 14.1 16.3 6.2 2.9 8.4 4.8 8.3 7.4-.1 4-5 5.8-9.6 5.8-6.4 0-9.8-0.9-15.1-3.1l-2.1-0.9-2.2 13.1c3.7 1.6 10.5 3.1 17.6 3.1 16.6 0 27.4-7.9 27.5-20.2.1-6.7-4.2-11.8-13.3-16-5.5-2.7-8.9-4.5-8.9-7.3 0-2.4 2.9-5 9.1-5 5.2-0.1 9 1.1 11.9 2.3l1.4 0.7 2.9-13.5zM152 1.1h-12.4c-3.8 0-6.7 1.1-8.4 5L108 47.3h16.6s2.7-7.2 3.3-8.8h20.3c.5 2 2 8.8 2 8.8H165L152 1.1zm-19.5 26.6c1.3-3.4 6.3-16.4 6.3-16.4-.1.1 1.3-3.4 2.1-5.6l1.1 5.1 3.6 16.9h-13.1zM44.8 1.1L29.3 32.6 27.6 24C24.5 14.1 14.9 3.4 4.1.4L18.2 47.2h16.7L52 1.1H44.8z"/>
              </svg>
              <div style={{ fontSize: 11, color: "#10B981", marginTop: 6, fontWeight: 600 }}>Visa Emisor</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ height: 1, width: 120, backgroundImage: "linear-gradient(90deg, rgba(0,61,165,.4) 55%, transparent 55%)", backgroundSize: "10px 1px" }} />
              <svg viewBox="0 0 8 12" width="8" height="12" fill="none"><path d="M1 1l6 5-6 5" stroke="rgba(0,61,165,.6)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,61,165,.2)", border: "1.5px solid rgba(0,61,165,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {UCR_SVG}
              </div>
              <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#003DA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{TOTAL_GUARDIANS}</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", textAlign: "center", marginTop: 6 }}>UCR Costa Rica</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 28, borderRadius: 5, background: "linear-gradient(135deg, #003DA5, #001d6c)", position: "relative", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", left: 5, top: 7, width: 9, height: 6, borderRadius: 1.5, background: "linear-gradient(135deg, #C8960C, #F0C040)" }} />
              <div style={{ position: "absolute", bottom: 4, right: 5, fontSize: "6px", fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,.95)" }}>VISA</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>María Fernández Rojas</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 2 }}>•••• 7291 · Beca Socioeconómica Visa</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#F5A300" }}>₡{Number(monthlyLimit).toLocaleString("es-CR")}</div>
              <div style={{ fontSize: 11, color: "#10B981", marginTop: 2 }}>✓ UCR Costa Rica</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.07)" }}>
            {["Lote recibido", `${TOTAL_GUARDIANS}/${TOTAL_GUARDIANS} emitidas`, "Portal notificado"].map((t) => (
              <span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </DarkPanel>

        <div style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #DDE7FF 100%)", borderRadius: 16, padding: "44px 32px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#003DA5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn .5s cubic-bezier(.36,.07,.19,.97) forwards" }}>
            <svg viewBox="0 0 16 13" width="20" height="16" fill="none"><path d="M1 6.5l5 5L15 1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#003DA5", marginBottom: 10 }}>¡Lote emitido con éxito!</div>
          <div style={{ fontSize: 14, color: "#4B5563", marginBottom: 32 }}>Todas las tarjetas Beca Socioeconómica Visa han sido enviadas a los hogares beneficiarios de Costa Rica</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 80 }}>
            <div>
              <div style={{ fontSize: 40, fontWeight: 900, color: "#003DA5", lineHeight: 1 }}>{TOTAL_GUARDIANS}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Tarjetas emitidas</div>
            </div>
            <div>
              <div style={{ fontSize: 40, fontWeight: 900, color: "#CE1126", lineHeight: 1 }}>₡{total.toLocaleString("es-CR")}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Total desembolsado</div>
            </div>
          </div>
        </div>

        <ContentCard>
          <ContentCardBody>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <Typography className="v-typography-body-2-bold">Estado de emisión individual</Typography>
                <Typography className="v-typography-label v-typography-color-subtle">{TOTAL_GUARDIANS} de {TOTAL_GUARDIANS} tarjetas emitidas</Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 120, height: 5, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: "#10B981", borderRadius: 999 }} />
                </div>
                <Typography className="v-typography-label" style={{ fontWeight: 700, color: "#10B981" }}>100%</Typography>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SAMPLE_ISSUED.map((g) => (
                <div key={g.last4} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#F8FAFC" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#D1FAE5", border: "1.5px solid #6EE7B7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 12 10" width="10" height="8" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography className="v-typography-body-2-bold" style={{ fontSize: 13 }}>{g.name}</Typography>
                    <Typography className="v-typography-label v-typography-color-subtle">{g.canton} · Costa Rica</Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <VisaBadge />
                    <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>•••• {g.last4}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#065F46", background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 999, padding: "2px 8px" }}>✓ Confirmado</span>
                  </div>
                </div>
              ))}
            </div>
          </ContentCardBody>
        </ContentCard>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
          <Button className="v-action-secondary" onClick={onBack}><VisaArrowLeftLow /> Volver</Button>
          <div style={{ display: "flex", gap: 12 }}>
            <Button className="v-action-primary" onClick={() => router.push("/issuer/analytics")}><VisaArrowRightLow /> Ver Analytics</Button>
            <Button className="v-action-secondary">↓ Descargar reporte</Button>
          </div>
        </div>
      </div>
    </>
  );
}
