"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UCR_FACULTIES, UCR_REGIONS, DEMO_DATE } from "@/lib/config";
import { scoreApplicant, type RiskInput } from "@/lib/risk-engine";
import { formatCRC } from "@/lib/utils";

const STEPS = [
  "Definir Objetivo",
  "Documentos",
  "Ventana de Postulación",
  "Evaluación Socioeconómica",
  "Seguimiento",
];

const STORAGE_KEY = "ucr_onboarding_progress";

interface FormData {
  level: "undergraduate" | "graduate";
  faculty: string;
  region: string;
  fundingType: "grant" | "loan" | "either";
  docs: Record<string, boolean>;
  income: string;
  dependents: string;
  housing: "owned" | "rented" | "family" | "informal";
  employment: "stable" | "temporary" | "self_employed" | "unemployed";
}

const REQUIRED_DOCS = [
  { id: "identity", label: "Cédula / Pasaporte" },
  { id: "transcripts", label: "Certificación de Notas" },
  { id: "income", label: "Comprobante de Ingresos" },
  { id: "personal", label: "Carta de Presentación Personal" },
];
const OPTIONAL_DOCS = [
  { id: "admission", label: "Carta de Admisión (opcional)" },
  { id: "recommendation", label: "Carta de Recomendación (opcional)" },
  { id: "cv", label: "Curriculum Vitae (opcional)" },
];

export default function SolicitudNuevaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    level: "undergraduate",
    faculty: "",
    region: "san_jose",
    fundingType: "either",
    docs: {},
    income: "",
    dependents: "1",
    housing: "rented",
    employment: "stable",
  });
  const [riskResult, setRiskResult] = useState<ReturnType<typeof scoreApplicant> | null>(null);
  const [scoringLoading, setScoringLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStep(parsed.step || 1);
        setForm(parsed.form || form);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, form }));
  }, [step, form]);

  const next = async () => {
    if (step === 4) {
      // Score applicant
      setScoringLoading(true);
      await new Promise((r) => setTimeout(r, 1600));
      const regionInfo = UCR_REGIONS.find((r) => r.value === form.region);
      const input: RiskInput = {
        monthlyFamilyIncome: parseInt(form.income) || 0,
        dependents: parseInt(form.dependents) || 1,
        housingStatus: form.housing,
        employmentStatus: form.employment,
        region: form.region,
        isRural: regionInfo?.rural || false,
        academicLevel: form.level,
      };
      const result = scoreApplicant(input);
      setRiskResult(result);
      setScoringLoading(false);
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canProceed = () => {
    if (step === 1) return !!form.faculty;
    if (step === 2) return REQUIRED_DOCS.every((d) => form.docs[d.id]);
    if (step === 3) return true;
    if (step === 4) return !!form.income && !!form.dependents;
    return true;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">Nueva Solicitud de Beca</h1>

        <div className="flex items-center gap-1 mt-4">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={s} className="flex items-center gap-1 flex-1 min-w-0">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
                  done ? "bg-[#10B981] text-white" :
                  active ? "bg-[#0B2A5B] text-white" :
                  "bg-slate-200 text-slate-500"
                }`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${done ? "bg-[#10B981]" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[10px] ${i + 1 === step ? "text-[#0B2A5B] font-semibold" : "text-slate-400"}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 1 && <Step1 form={form} setForm={setForm} />}
          {step === 2 && <Step2 form={form} setForm={setForm} />}
          {step === 3 && <Step3 form={form} />}
          {step === 4 && <Step4 form={form} setForm={setForm} loading={scoringLoading} />}
          {step === 5 && <Step5 riskResult={riskResult} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={prev}
            disabled={step === 1}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
          <Button
            onClick={next}
            disabled={!canProceed() || scoringLoading}
            className="rounded-full px-6"
          >
            {scoringLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Evaluando...
              </span>
            ) : step === 4 ? (
              <>Enviar evaluación <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Continuar <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}

      {step === 5 && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              router.push("/dashboard");
            }}
            className="rounded-full px-8"
          >
            Volver al dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Step components ────────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormData; setForm: (f: (p: FormData) => FormData) => void }) {
  const update = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0B2A5B]">Paso 1 — Definir Objetivo</h2>
        <p className="text-sm text-slate-500 mt-1">Cuéntenos sobre sus metas académicas</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Nivel de estudio *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "undergraduate", label: "Grado", desc: "Bachillerato o Licenciatura" },
              { value: "graduate", label: "Posgrado", desc: "Maestría o Doctorado" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("level", opt.value)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  form.level === opt.value
                    ? "border-[#0B2A5B] bg-[#0B2A5B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Facultad de interés *</label>
          <select
            value={form.faculty}
            onChange={(e) => update("faculty", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          >
            <option value="">Seleccionar facultad...</option>
            {UCR_FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Sede de preferencia</label>
          <select
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          >
            {UCR_REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tipo de financiamiento</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "grant", label: "Beca", desc: "No reembolsable" },
              { value: "loan", label: "Préstamo", desc: "Con interés reducido" },
              { value: "either", label: "Cualquiera", desc: "Lo mejor disponible" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("fundingType", opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all text-xs ${
                  form.fundingType === opt.value
                    ? "border-[#0B2A5B] bg-[#0B2A5B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-semibold text-slate-800">{opt.label}</p>
                <p className="text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Step2({ form, setForm }: { form: FormData; setForm: (f: (p: FormData) => FormData) => void }) {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (docId: string) => {
    setUploading(docId);
    await new Promise((r) => setTimeout(r, 1000));
    setForm((f) => ({ ...f, docs: { ...f.docs, [docId]: true } }));
    setUploading(null);
  };

  const allRequiredDone = REQUIRED_DOCS.every((d) => form.docs[d.id]);

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B2A5B]">Paso 2 — Documentos Requeridos</h2>
        <p className="text-sm text-slate-500 mt-1">Cargue los documentos de su expediente</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Obligatorios</p>
          <div className="space-y-2">
            {REQUIRED_DOCS.map((doc) => (
              <DocUploadRow
                key={doc.id}
                doc={doc}
                done={!!form.docs[doc.id]}
                uploading={uploading === doc.id}
                onUpload={() => handleUpload(doc.id)}
                required
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Opcionales</p>
          <div className="space-y-2">
            {OPTIONAL_DOCS.map((doc) => (
              <DocUploadRow
                key={doc.id}
                doc={doc}
                done={!!form.docs[doc.id]}
                uploading={uploading === doc.id}
                onUpload={() => handleUpload(doc.id)}
              />
            ))}
          </div>
        </div>

        {!allRequiredDone && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            Debe cargar todos los documentos obligatorios para continuar.
          </p>
        )}
      </div>
    </Card>
  );
}

function DocUploadRow({
  doc,
  done,
  uploading,
  onUpload,
  required,
}: {
  doc: { id: string; label: string };
  done: boolean;
  uploading: boolean;
  onUpload: () => void;
  required?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-emerald-500" : "bg-slate-200"}`}>
        {done && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={`flex-1 text-sm ${done ? "text-emerald-800 font-medium" : "text-slate-700"}`}>
        {doc.label}
      </span>
      {!done && (
        <button
          onClick={onUpload}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-[#1d4ed8] disabled:opacity-50 shrink-0"
        >
          {uploading ? (
            <span className="w-4 h-4 border border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          ) : (
            "Subir"
          )}
        </button>
      )}
    </div>
  );
}

function Step3({ form }: { form: FormData }) {
  const daysUntilClose = 20;
  const isLate = daysUntilClose < 30;

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B2A5B]">Paso 3 — Ventana de Postulación</h2>
        <p className="text-sm text-slate-500 mt-1">Verifique que aplica dentro del período correcto</p>
      </div>

      <div className={`rounded-2xl border-2 p-5 space-y-3 ${isLate ? "border-amber-300 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
        <div className="flex items-center gap-2">
          {isLate ? (
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          <div>
            <p className={`text-sm font-semibold ${isLate ? "text-amber-800" : "text-emerald-800"}`}>
              {isLate ? "Ventana por cerrar pronto" : "Dentro del período de postulación"}
            </p>
            <p className={`text-xs mt-0.5 ${isLate ? "text-amber-700" : "text-emerald-700"}`}>
              Quedan <strong>{daysUntilClose} días</strong> para el cierre
            </p>
          </div>
        </div>
        {isLate && (
          <p className="text-xs text-amber-700 mt-1">
            Se recomienda completar y enviar su solicitud antes del <strong>31 de mayo de 2026</strong>.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        {[
          { label: "Apertura", value: "1 abr. 2026" },
          { label: "Cierre", value: "31 may. 2026" },
          { label: "Resolución", value: "15 jun. 2026" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{item.label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Período de la convocatoria: <strong>Beca de Honor — Grado 2026</strong> ·
        Aplicable a todas las facultades de la Universidad de Costa Rica.
      </p>
    </Card>
  );
}

function Step4({
  form,
  setForm,
  loading,
}: {
  form: FormData;
  setForm: (f: (p: FormData) => FormData) => void;
  loading: boolean;
}) {
  const update = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const regionInfo = UCR_REGIONS.find((r) => r.value === form.region);
  const perCapita = form.income && form.dependents
    ? parseInt(form.income) / parseInt(form.dependents)
    : 0;

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B2A5B]">Paso 4 — Evaluación Socioeconómica</h2>
        <p className="text-sm text-slate-500 mt-1">Esta información es procesada por Issuer Risk Engine</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">I</span>
          </div>
          <span className="text-xs text-amber-700 font-medium">Issuer — Motor de Evaluación de Riesgo</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Ingreso familiar mensual (₡) *</label>
          <Input
            type="number"
            placeholder="ej: 450000"
            value={form.income}
            onChange={(e) => update("income", e.target.value)}
          />
          {form.income && form.dependents && (
            <p className="text-xs text-slate-500">
              Per cápita: <span className="font-semibold text-[#0B2A5B]">{formatCRC(perCapita)}</span> / persona
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Número de dependientes *</label>
          <Input
            type="number"
            min="1"
            max="15"
            value={form.dependents}
            onChange={(e) => update("dependents", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Estado de vivienda</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "owned", label: "Propia" },
              { value: "rented", label: "Alquiler" },
              { value: "family", label: "Prestada" },
              { value: "informal", label: "Precaria" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("housing", opt.value)}
                className={`p-2.5 rounded-xl border text-sm text-left transition-all ${
                  form.housing === opt.value
                    ? "border-[#0B2A5B] bg-[#0B2A5B]/5 font-medium text-[#0B2A5B]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Situación laboral del jefe de hogar</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "stable", label: "Empleo estable" },
              { value: "temporary", label: "Temporal" },
              { value: "self_employed", label: "Independiente" },
              { value: "unemployed", label: "Desempleado" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("employment", opt.value)}
                className={`p-2.5 rounded-xl border text-sm text-left transition-all ${
                  form.employment === opt.value
                    ? "border-[#0B2A5B] bg-[#0B2A5B]/5 font-medium text-[#0B2A5B]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {regionInfo && (
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
            Región: <strong>{regionInfo.label}</strong> —{" "}
            {regionInfo.rural ? "Zona rural (bonificación aplicada)" : "Gran Área Metropolitana"}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Issuer está evaluando su perfil...</p>
            <p className="text-xs text-amber-600">Analizando datos socioeconómicos</p>
          </div>
        </div>
      )}
    </Card>
  );
}

function Step5({ riskResult }: { riskResult: ReturnType<typeof scoreApplicant> | null }) {
  if (!riskResult) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0B2A5B]">¡Solicitud enviada!</h2>
        <p className="text-slate-500 text-sm">
          Su expediente está siendo procesado. Recibirá actualizaciones en su bandeja de mensajes.
        </p>
      </Card>
    );
  }

  const { score, tier, decision, reasons } = riskResult;
  const isApproved = decision === "APPROVED";
  const isReview = decision === "REVIEW";

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0B2A5B]">Paso 5 — Seguimiento</h2>
        <p className="text-sm text-slate-500 mt-1">Resultado de la evaluación Issuer</p>
      </div>

      {/* Result banner */}
      <div className={`rounded-2xl p-6 text-center space-y-2 ${
        isApproved ? "bg-emerald-50 border border-emerald-200" :
        isReview ? "bg-amber-50 border border-amber-200" :
        "bg-red-50 border border-red-200"
      }`}>
        <div className="text-4xl font-bold">
          <span className={isApproved ? "text-emerald-700" : isReview ? "text-amber-700" : "text-red-700"}>
            {score}
          </span>
          <span className="text-xl text-slate-400 font-normal">/100</span>
        </div>
        <Badge variant={isApproved ? "success" : isReview ? "warning" : "danger"} className="text-sm px-4 py-1">
          {isApproved ? "✓ Pre-aprobado" : isReview ? "En revisión manual" : "Necesita revisión"}
        </Badge>
        <p className={`text-xs font-medium ${
          isApproved ? "text-emerald-700" : isReview ? "text-amber-700" : "text-red-700"
        }`}>
          Riesgo {tier === "LOW" ? "Bajo" : tier === "MEDIUM" ? "Medio" : "Alto"} · Issuer Risk Services
        </p>
      </div>

      {/* Reasons */}
      <div>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Factores evaluados</p>
        <div className="space-y-2">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* Status timeline */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Estado del proceso</p>
        {[
          { label: "Solicitud enviada", done: true, ts: "Hace 5 minutos" },
          { label: "Documentos revisados", done: true, ts: "Hoy" },
          { label: "Evaluación Issuer completada", done: true, ts: "Ahora" },
          { label: "Revisión Oficina de Becas UCR", active: !isApproved, done: false, ts: "3–5 días hábiles" },
          { label: "Decisión final", done: false, ts: "7–10 días hábiles" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              s.done ? "bg-emerald-500" : s.active ? "bg-amber-400" : "bg-slate-200"
            }`}>
              {s.done && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${s.done ? "text-slate-700" : "text-slate-400"}`}>{s.label}</span>
            <span className="ml-auto text-xs text-slate-400">{s.ts}</span>
          </div>
        ))}
      </div>

      {isApproved && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          Su perfil cumple los criterios de elegibilidad. La Oficina de Becas UCR emitirá
          la resolución final en los próximos 5–7 días hábiles.
        </p>
      )}
    </Card>
  );
}
