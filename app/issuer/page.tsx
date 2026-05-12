"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { getIssuerSession, issuerLogout } from "@/lib/issuer-auth";
import { MOCK_FLOW_STUDENTS } from "@/lib/mock-issuer-flow";
import {
  DEFAULT_FILTERS,
  DEFAULT_CARD_CONFIG,
  type FlowStudent,
  type FilterState,
  type CardConfig,
  type BatchPhase,
  type DocumentStatus,
  type IssuanceStatus,
} from "@/types/issuer-flow";
import { IssuerStepper } from "@/components/issuer/IssuerStepper";
import { Step1Screening } from "@/components/issuer/steps/Step1Screening";
import { Step2Requirements } from "@/components/issuer/steps/Step2Requirements";
import { Step3CardConfig } from "@/components/issuer/steps/Step3CardConfig";
import { Step4BatchUpload } from "@/components/issuer/steps/Step4BatchUpload";
import { Step5WalletIssuance } from "@/components/issuer/steps/Step5WalletIssuance";
import { Step6Analytics } from "@/components/issuer/steps/Step6Analytics";

// Batch simulation timings
const BATCH_SEQUENCE: { phase: BatchPhase; durationMs: number }[] = [
  { phase: "generating", durationMs: 2000 },
  { phase: "validating", durationMs: 2500 },
  { phase: "sending", durationMs: 2000 },
  { phase: "processing", durationMs: 3000 },
  { phase: "complete", durationMs: 0 },
];

const STEP_TITLES = [
  "Filtrado de estudiantes",
  "Verificación de requisitos",
  "Configuración de tarjeta",
  "Pre-aprobación y lote bancario",
  "Emisión digital e integración wallets",
  "Analytics — Fondos de Becas del Gobierno",
];

export default function IssuerPortalPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [students, setStudents] = useState<FlowStudent[]>(MOCK_FLOW_STUDENTS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cardConfig, setCardConfig] = useState<CardConfig>(DEFAULT_CARD_CONFIG);
  const [batchPhase, setBatchPhase] = useState<BatchPhase>("idle");
  const [batchProgress, setBatchProgress] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(0);
  const batchRef = useRef(false);

  useEffect(() => {
    const session = getIssuerSession();
    if (!session) {
      router.replace("/issuer/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    issuerLogout();
    router.push("/issuer/login");
  };

  // Step 1 handlers
  const handleFiltersChange = (f: FilterState) => setFilters(f);

  const handleSelectionChange = (id: string, selected: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected } : s))
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setStudents((prev) => prev.map((s) => ({ ...s, selected })));
  };

  // Step 2 handlers
  const handleDocStatusChange = (
    studentId: string,
    docId: string,
    status: DocumentStatus
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              documents: s.documents.map((d) =>
                d.id === docId ? { ...d, status } : d
              ),
            }
          : s
      )
    );
  };

  // Step 4: batch simulation
  const startBatch = useCallback(async () => {
    if (batchRef.current) return;
    batchRef.current = true;
    const totalRecords = students.filter((s) => s.selected).length;

    for (let i = 0; i < BATCH_SEQUENCE.length; i++) {
      const { phase, durationMs } = BATCH_SEQUENCE[i];
      setBatchPhase(phase);
      if (durationMs === 0) break;

      const start = Date.now();
      const baseProgress = (i / (BATCH_SEQUENCE.length - 1)) * 100;
      const nextProgress = ((i + 1) / (BATCH_SEQUENCE.length - 1)) * 100;

      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const ratio = Math.min(elapsed / durationMs, 1);
        const progress = baseProgress + (nextProgress - baseProgress) * ratio;
        setBatchProgress(Math.min(progress, 98));

        if (phase === "processing") {
          setCurrentRecord(Math.floor(ratio * totalRecords));
        }
      }, 50);

      await new Promise((r) => setTimeout(r, durationMs));
      clearInterval(interval);
    }

    setBatchProgress(100);
    setCurrentRecord(totalRecords);
    setBatchPhase("complete");
    batchRef.current = false;
  }, [students]);

  // Step 5: issuance status
  const handleIssuanceStatus = (id: string, status: IssuanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, issuanceStatus: status } : s))
    );
  };

  const goToStep = (step: number) => {
    if (step < currentStep) setCurrentStep(step);
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E20] flex items-center justify-center shadow-md">
              <IssuerGridIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">
                Portal Adm Universidad
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Banco Nacional de Costa Rica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-600 font-semibold">
                Motor activo
              </span>
            </div>
            <div className="hidden md:block text-xs text-slate-500 font-medium">
              Lote Universidad Pública — {new Date().toLocaleDateString("es-CR", { year: "numeric", month: "long" })}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-6">
        {/* ── Stepper ── */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 shadow-sm">
          <IssuerStepper currentStep={currentStep} onStepClick={goToStep} />
        </div>

        {/* ── Step title ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#1B5E20] flex items-center justify-center">
                <span className="text-white text-xs font-black">{currentStep}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {STEP_TITLES[currentStep - 1]}
              </h2>
            </div>

            {/* ── Step content ── */}
            {currentStep === 1 && (
              <Step1Screening
                students={students}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSelectionChange={handleSelectionChange}
                onSelectAll={handleSelectAll}
                onNext={nextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Requirements
                students={students}
                onDocStatusChange={handleDocStatusChange}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 3 && (
              <Step3CardConfig
                config={cardConfig}
                onChange={setCardConfig}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 4 && (
              <Step4BatchUpload
                students={students}
                cardConfig={cardConfig}
                batchPhase={batchPhase}
                batchProgress={batchProgress}
                currentRecord={currentRecord}
                onStartBatch={startBatch}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 5 && (
              <Step5WalletIssuance
                students={students}
                cardConfig={cardConfig}
                onStatusChange={handleIssuanceStatus}
                onBack={prevStep}
                onNext={nextStep}
              />
            )}

            {currentStep === 6 && (
              <Step6Analytics
                students={students}
                cardConfig={cardConfig}
                onBack={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 text-center">
        <p className="text-xs text-slate-400">
          Motor de Riesgo v2.1 — Banco Nacional de Costa Rica · Portal Adm Universidad
        </p>
      </footer>
    </div>
  );
}

function IssuerGridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
      <rect x="11" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="2" y="11" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="11" y="11" width="5" height="5" rx="1" fill="white" />
      <rect x="8" y="2" width="2" height="14" rx="1" fill="white" opacity="0.3" />
      <rect x="2" y="8" width="14" height="2" rx="1" fill="white" opacity="0.3" />
    </svg>
  );
}
