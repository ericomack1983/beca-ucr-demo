"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button, Label, Typography, Divider, ContentCard, ContentCardBody,
  Input, Select, InputContainer,
} from "@visa/nova-react";
import { VisaArrowLeftLow, VisaCheckmarkLow } from "@visa/nova-icons-react";

const VISA_BLUE = "#1434CB";
const VISA_NAVY = "#1A1F71";
const GREEN = "#16834A";

const STEPS = ["Detalles del programa", "Revisión"] as const;
const BACK_LABELS = ["Volver al panel", "Volver a Detalles del programa"] as const;

const GOV_DEPARTMENT_OPTIONS = [
  "UCR — Universidad de Costa Rica",
  "Ministerio de Hacienda",
  "Ministerio de Educación Pública (MEP)",
  "Ministerio de Salud",
  "Ministerio de Trabajo y Seguridad Social (MTSS)",
  "Caja Costarricense de Seguro Social (CCSS)",
];
const COUNTRY_OPTIONS = ["Costa Rica", "Panamá", "Nicaragua", "Guatemala"];
const CITY_OPTIONS = ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas", "Limón"];
const CURRENCY_OPTIONS = ["CRC — Colón costarricense", "USD — Dólar estadounidense"];
const FREQUENCY_OPTIONS = ["Único", "Semanal", "Quincenal", "Mensual", "Trimestral", "Anual"];
const METHOD_OPTIONS = [
  "Tarjeta prepago virtual (Visa)",
  "Tarjeta prepago física (Visa)",
  "Aprovisionamiento en wallet",
  "Transferencia bancaria / Visa Direct",
];

// ── Step indicator ───────────────────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", margin: "4px 0" }}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isDone = step < current;
        const isActive = step === current;
        const reached = step <= current;
        return (
          <div key={label} style={{ display: "flex", flex: i < STEPS.length - 1 ? 1 : "0 0 auto", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: `2px solid ${isDone ? GREEN : reached ? VISA_BLUE : "#D4D9E2"}`,
                  background: "#fff",
                  color: isDone ? GREEN : reached ? VISA_BLUE : "#94A3B8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 600, flexShrink: 0,
                  boxShadow: isActive ? `0 0 0 4px rgba(20,52,203,0.12)` : "none",
                }}
              >
                {isDone ? "✓" : step}
              </div>
              <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? VISA_BLUE : "#1E293B", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step < current ? VISA_BLUE : "#D4D9E2", marginTop: 17 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Form row: bold question on the left, field(s) on the right ────────────────
function FieldRow({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Typography
        tag="h2"
        style={{ flex: "0 0 260px", maxWidth: 260, fontSize: 16, fontWeight: 700, color: "#1E293B", paddingTop: 26 }}
      >
        {question}
      </Typography>
      <div style={{ flex: "1 1 380px", minWidth: 280 }}>{children}</div>
    </div>
  );
}

function FieldGroup({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 280px", minWidth: 240, maxWidth: 440 }}>
      <Label htmlFor={htmlFor} style={{ fontSize: 13, color: "#64748B" }}>{label}</Label>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Typography style={{ flex: "0 0 180px", fontSize: 14, color: "#64748B" }}>{label}</Typography>
      <Typography style={{ fontSize: 14, color: "#1E293B", fontWeight: 600 }}>{value}</Typography>
    </div>
  );
}

function CreateSuccessLightbox({ programName }: { programName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ width: 440, maxWidth: "92vw", background: "#fff", borderRadius: 20, padding: "40px 32px", boxShadow: "0 30px 80px rgba(10,22,40,0.35)", textAlign: "center" }}
      >
        <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0, 0.35].map((delay) => (
            <motion.div
              key={delay}
              initial={{ scale: 0.6, opacity: 0.5 }} animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity, delay }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #10B981" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
            style={{ width: 76, height: 76, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 8px 24px rgba(16,131,74,0.35)" }}
          >
            <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.28 }} style={{ display: "inline-flex" }}>
              <VisaCheckmarkLow style={{ width: 40, height: 40 }} />
            </motion.span>
          </motion.div>
        </div>

        <Typography tag="h2" className="v-typography-headline-3" style={{ color: VISA_NAVY }}>
          ¡Programa registrado!
        </Typography>
        <Typography className="v-typography-body-2" style={{ color: "#475569", marginTop: 6 }}>
          <strong>{programName || "El programa"}</strong> se ha registrado con éxito.
        </Typography>
        <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 18 }}>
          Redirigiendo a Programas…
        </Typography>
      </motion.div>
    </motion.div>
  );
}

export default function CreateProgramPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    aidName: "Beca Socioeconómica",
    govDepartment: "UCR — Universidad de Costa Rica",
    country: "Costa Rica",
    city: "San José",
    currency: "CRC — Colón costarricense",
    totalAmount: "45000000000",
    benefitAmount: "55000",
    frequency: "Mensual",
    beneficiaries: "325660",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    disbursementMethod: "Tarjeta prepago física (Visa)",
  });

  const setDetail = (key: keyof typeof details, value: string) =>
    setDetails((prev) => ({ ...prev, [key]: value }));

  const [creating, setCreating] = useState(false);

  const goManagement = () => router.push("/issuer/program-management");
  const startCreate = () => {
    setCreating(true);
    setTimeout(goManagement, 2200);
  };
  const next = () => (step < STEPS.length ? setStep((s) => s + 1) : startCreate());
  const back = () => (step > 1 ? setStep((s) => s - 1) : goManagement());

  return (
    <div className="v-flex v-flex-col v-gap-6">
      <AnimatePresence>
        {creating && <CreateSuccessLightbox programName={details.aidName} />}
      </AnimatePresence>

      {/* Back link */}
      <button
        onClick={back}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: VISA_BLUE, fontSize: 15, fontWeight: 500, cursor: "pointer", padding: 0,
        }}
      >
        <VisaArrowLeftLow /> {BACK_LABELS[step - 1]}
      </button>

      <Stepper current={step} />

      <ContentCard>
        <ContentCardBody>
          {/* ── Step 1: Program Details ────────────────────────────────────── */}
          {step === 1 && (
            <section>
              <Typography tag="h1" style={{ fontSize: 28, fontWeight: 600, color: VISA_NAVY, marginBottom: 16 }}>
                Detalles del programa
              </Typography>
              <Divider />

              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 28 }}>
                {/* Aid benefit name */}
                <FieldRow question="¿Cuál es el nombre del beneficio?">
                  <FieldGroup label="Nombre del beneficio" htmlFor="aid-name">
                    <InputContainer>
                      <Input
                        id="aid-name"
                        type="text"
                        value={details.aidName}
                        onChange={(e) => setDetail("aidName", e.target.value)}
                      />
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>

                {/* Gov Department */}
                <FieldRow question="Entidad responsable">
                  <FieldGroup label="Entidad responsable" htmlFor="gov-department">
                    <InputContainer>
                      <Select id="gov-department" value={details.govDepartment} onChange={(e) => setDetail("govDepartment", e.target.value)}>
                        <option value="">Seleccione una entidad</option>
                        {GOV_DEPARTMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </Select>
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>

                {/* Country & City */}
                <FieldRow question="País y ciudad">
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <FieldGroup label="País" htmlFor="country">
                      <InputContainer>
                        <Select id="country" value={details.country} onChange={(e) => setDetail("country", e.target.value)}>
                          <option value="">Seleccione un país</option>
                          {COUNTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </Select>
                      </InputContainer>
                    </FieldGroup>
                    <FieldGroup label="Ciudad" htmlFor="city">
                      <InputContainer>
                        <Select id="city" value={details.city} onChange={(e) => setDetail("city", e.target.value)}>
                          <option value="">Seleccione una ciudad</option>
                          {CITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </Select>
                      </InputContainer>
                    </FieldGroup>
                  </div>
                </FieldRow>

                {/* Currency */}
                <FieldRow question="Moneda">
                  <FieldGroup label="Moneda" htmlFor="currency">
                    <InputContainer>
                      <Select id="currency" value={details.currency} onChange={(e) => setDetail("currency", e.target.value)}>
                        <option value="">Seleccione una moneda</option>
                        {CURRENCY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </Select>
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>

                {/* Total Program Amount */}
                <FieldRow question="¿Cuál es el monto total del programa?">
                  <FieldGroup label="Monto total del programa" htmlFor="total-amount">
                    <InputContainer>
                      <Input
                        id="total-amount"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={details.totalAmount}
                        onChange={(e) => setDetail("totalAmount", e.target.value)}
                      />
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>

                {/* Benefit amount + frequency */}
                <FieldRow question="Desembolso por beneficiario">
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <FieldGroup label="Monto del beneficio" htmlFor="benefit-amount">
                      <InputContainer>
                        <Input
                          id="benefit-amount"
                          type="number"
                          min={0}
                          placeholder="0"
                          value={details.benefitAmount}
                          onChange={(e) => setDetail("benefitAmount", e.target.value)}
                        />
                      </InputContainer>
                    </FieldGroup>
                    <FieldGroup label="Frecuencia de desembolso" htmlFor="frequency">
                      <InputContainer>
                        <Select id="frequency" value={details.frequency} onChange={(e) => setDetail("frequency", e.target.value)}>
                          <option value="">Seleccione una frecuencia</option>
                          {FREQUENCY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </Select>
                      </InputContainer>
                    </FieldGroup>
                  </div>
                </FieldRow>

                {/* Estimated beneficiaries */}
                <FieldRow question="¿Cuántos beneficiarios?">
                  <FieldGroup label="Beneficiarios estimados" htmlFor="beneficiaries">
                    <InputContainer>
                      <Input
                        id="beneficiaries"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={details.beneficiaries}
                        onChange={(e) => setDetail("beneficiaries", e.target.value)}
                      />
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>

                {/* Disbursement period */}
                <FieldRow question="Período de desembolso">
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <FieldGroup label="Fecha de inicio" htmlFor="start-date">
                      <InputContainer>
                        <Input
                          id="start-date"
                          type="date"
                          value={details.startDate}
                          onChange={(e) => setDetail("startDate", e.target.value)}
                        />
                      </InputContainer>
                    </FieldGroup>
                    <FieldGroup label="Fecha de fin" htmlFor="end-date">
                      <InputContainer>
                        <Input
                          id="end-date"
                          type="date"
                          value={details.endDate}
                          onChange={(e) => setDetail("endDate", e.target.value)}
                        />
                      </InputContainer>
                    </FieldGroup>
                  </div>
                </FieldRow>

                {/* Disbursement method */}
                <FieldRow question="¿Cómo se desembolsan los fondos?">
                  <FieldGroup label="Método de desembolso" htmlFor="disbursement-method">
                    <InputContainer>
                      <Select id="disbursement-method" value={details.disbursementMethod} onChange={(e) => setDetail("disbursementMethod", e.target.value)}>
                        <option value="">Seleccione un método</option>
                        {METHOD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </Select>
                    </InputContainer>
                  </FieldGroup>
                </FieldRow>
              </div>
            </section>
          )}

          {/* ── Step 2: Review ─────────────────────────────────────────────── */}
          {step === 2 && (
            <section>
              <Typography tag="h1" style={{ fontSize: 28, fontWeight: 600, color: VISA_NAVY, marginBottom: 16 }}>
                Revisar y confirmar
              </Typography>
              <Divider />
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <ReviewItem label="Nombre del beneficio" value={details.aidName || "—"} />
                <ReviewItem label="Entidad responsable" value={details.govDepartment || "—"} />
                <ReviewItem label="País" value={details.country || "—"} />
                <ReviewItem label="Ciudad" value={details.city || "—"} />
                <ReviewItem label="Moneda" value={details.currency || "—"} />
                <ReviewItem label="Monto total del programa" value={details.totalAmount || "—"} />
                <ReviewItem label="Monto del beneficio" value={details.benefitAmount || "—"} />
                <ReviewItem label="Frecuencia de desembolso" value={details.frequency || "—"} />
                <ReviewItem label="Beneficiarios estimados" value={details.beneficiaries || "—"} />
                <ReviewItem label="Período de desembolso" value={details.startDate || details.endDate ? `${details.startDate || "—"} → ${details.endDate || "—"}` : "—"} />
                <ReviewItem label="Método de desembolso" value={details.disbursementMethod || "—"} />
              </div>
            </section>
          )}

          {/* Actions */}
          <div style={{ marginTop: 32 }}>
            <Divider />
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Button onClick={next}>
                {step < STEPS.length ? "Siguiente" : "Crear"}
              </Button>
              <Button colorScheme="secondary" onClick={back}>
                {step > 1 ? "Atrás" : "Cancelar"}
              </Button>
            </div>
          </div>
        </ContentCardBody>
      </ContentCard>
    </div>
  );
}
