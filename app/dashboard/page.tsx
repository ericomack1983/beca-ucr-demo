"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronUp, Bell, X } from "lucide-react";
import { getSession } from "@/lib/auth";
import { MOCK_STUDENTS, type Student } from "@/lib/mock-students";
import { getApplicationByStudentId, type Application } from "@/lib/mock-applications";
import { getUnreadCount, getMessagesByStudentId } from "@/lib/mock-messages";
import { formatRelativeTime, formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    const stu = MOCK_STUDENTS.find((s) => s.id === session.studentId);
    if (!stu) return;
    setStudent(stu);
    const app = getApplicationByStudentId(stu.id);
    setApplication(app || null);

    // Show toast for unread action-required messages
    const msgs = getMessagesByStudentId(stu.id);
    const hasActionRequired = msgs.some(
      (m) => m.status === "unread" && m.category === "action_required"
    );
    if (hasActionRequired) {
      setTimeout(() => setToast(true), 1200);
    }
  }, []);

  if (!student) return null;

  const today = new Date("2026-05-11");
  const dateStr = today.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!application) {
    return <EmptyDashboard student={student} dateStr={dateStr} />;
  }

  const completedSteps = application.steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedSteps / 5) * 100);

  const currentStep = application.steps.find((s) => s.status === "in_progress");
  const nextAction = currentStep
    ? getNextAction(currentStep.step)
    : application.status === "approved"
    ? "Ver detalles de la beca"
    : "Revisar estado";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-white border border-amber-200 rounded-2xl shadow-xl p-4 flex items-start gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">Acción requerida</p>
              <p className="text-xs text-slate-500 mt-0.5">Issuer solicita un documento adicional</p>
              <Link href="/dashboard/mensajes" className="text-xs text-[#2563EB] hover:underline mt-1 inline-block">
                Ver mensaje →
              </Link>
            </div>
            <button onClick={() => setToast(false)} className="text-slate-400 hover:text-slate-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-[#0B2A5B] tracking-tight">
          Hola, <span className="font-serif-editorial italic font-normal">{student.firstName}</span> 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1 capitalize">{dateStr}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content — 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active application card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={application.status === "approved" ? "success" : "secondary"}>
                      {application.becaTypeLabel}
                    </Badge>
                    <Badge variant={application.status === "approved" ? "success" : application.status === "under_review" ? "warning" : "default"}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 mt-2">{application.program}</h2>
                  <p className="text-sm text-slate-500">Folio #{application.id.toUpperCase()}</p>
                </div>
                {/* Progress ring */}
                <ProgressRing percent={progressPercent} />
              </div>

              <div className="h-px bg-slate-100" />

              {/* Next action */}
              {application.status !== "approved" && currentStep && (
                <div className="flex items-center justify-between bg-[#F8F9FF] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Siguiente acción</p>
                    <p className="text-sm font-semibold text-[#0B2A5B] mt-0.5">{nextAction}</p>
                  </div>
                  <Link href="/dashboard/documentos">
                    <Button size="sm" variant="secondary" className="rounded-full">
                      Continuar <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {application.status === "approved" && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">¡Solicitud aprobada!</p>
                    <p className="text-xs text-emerald-600">Revisión: {formatDateShort(application.estimatedDecisionDate)}</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-400">
                Decisión estimada: <span className="font-medium text-slate-600">{formatDateShort(application.estimatedDecisionDate)}</span>
              </div>
            </Card>
          </motion.div>

          {/* Steps timeline */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-5">Progreso de solicitud</h3>
              <div className="space-y-1">
                {application.steps.map((step, i) => (
                  <StepRow
                    key={step.step}
                    step={step}
                    isLast={i === application.steps.length - 1}
                    expanded={expandedStep === step.step}
                    onToggle={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  />
                ))}
              </div>
            </Card>
          </motion.div>


        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Document checklist */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Documentos</h3>
                <Link href="/dashboard/documentos" className="text-xs text-[#2563EB] hover:underline">Ver todos</Link>
              </div>
              <div className="space-y-2">
                {application.documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      doc.status === "approved" ? "bg-emerald-500" :
                      doc.status === "reviewing" ? "bg-blue-400" :
                      doc.status === "rejected" ? "bg-red-500" :
                      "bg-slate-300"
                    }`} />
                    <span className="text-sm text-slate-600 truncate flex-1">{doc.name}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      doc.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      doc.status === "reviewing" ? "bg-blue-50 text-blue-700" :
                      doc.status === "rejected" ? "bg-red-50 text-red-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {getDocStatusLabel(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Activity feed */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actividad reciente</h3>
              <div className="space-y-3">
                {application.activityFeed.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                      item.type === "success" ? "bg-emerald-500" :
                      item.type === "warning" ? "bg-amber-500" :
                      item.type === "error" ? "bg-red-500" :
                      "bg-slate-400"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{item.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatRelativeTime(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepRow({ step, isLast, expanded, onToggle }: {
  step: Application["steps"][0];
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`relative ${!isLast ? "pb-1" : ""}`}>
      <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={onToggle}>
        {/* Connector line */}
        {!isLast && (
          <div className="absolute left-[14px] top-9 bottom-0 w-px bg-slate-100 z-0" />
        )}
        {/* Dot */}
        <div className={`relative w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
          step.status === "completed"
            ? "bg-[#10B981]"
            : step.status === "in_progress"
            ? "bg-[#2563EB]"
            : "bg-slate-100 border border-slate-200"
        }`}>
          {step.status === "completed" && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
          {step.status === "in_progress" && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
          {step.status === "pending" && (
            <Circle className="w-3.5 h-3.5 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              step.status === "completed" ? "text-slate-600" :
              step.status === "in_progress" ? "text-[#0B2A5B] font-semibold" :
              "text-slate-400"
            }`}>
              {step.name}
            </span>
            {step.status === "in_progress" && (
              <span className="text-[10px] px-2 py-0.5 bg-[#2563EB]/10 text-[#2563EB] rounded-full font-semibold">
                En progreso
              </span>
            )}
          </div>
          {step.completedAt && (
            <p className="text-[10px] text-slate-400 mt-0.5">{formatRelativeTime(step.completedAt)}</p>
          )}
        </div>

        <button className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-10 mb-2"
          >
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
              {step.status === "completed"
                ? `Completado el ${step.completedAt ? new Date(step.completedAt).toLocaleDateString("es-CR") : "—"}`
                : step.status === "in_progress"
                ? "Este paso está actualmente en proceso. Complete los requisitos para avanzar."
                : "Este paso estará disponible al completar los anteriores."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function ProgressRing({ percent }: { percent: number }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#E2E8F0" strokeWidth="4" />
      <circle
        cx="32" cy="32" r={r} fill="none"
        stroke={percent === 100 ? "#10B981" : "#2563EB"}
        strokeWidth="4"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="32" y="37" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0B2A5B">
        {percent}%
      </text>
    </svg>
  );
}

function EmptyDashboard({ student, dateStr }: { student: Student; dateStr: string }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0B2A5B] tracking-tight">
          Hola, <span className="font-serif-editorial italic font-normal">{student.firstName}</span> 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1 capitalize">{dateStr}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center space-y-6"
      >
        {/* Illustration */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#0B2A5B]/8 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#0B2A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#0B2A5B]">Aún no tienes una solicitud activa</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Inicia tu proceso de beca hoy. El proceso toma menos de 30 minutos y
            podrás rastrear el estado en tiempo real.
          </p>
        </div>
        <Link href="/dashboard/solicitud/nueva">
          <Button size="lg" className="rounded-full px-8">
            Iniciar solicitud de beca
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

function getStatusLabel(status: Application["status"]): string {
  const map: Record<string, string> = {
    draft: "Borrador",
    submitted: "Enviada",
    under_review: "En revisión",
    risk_scored: "Evaluada",
    approved: "Aprobada",
    review_required: "Revisión requerida",
    rejected: "Rechazada",
  };
  return map[status] || status;
}

function getDocStatusLabel(status: string): string {
  const map: Record<string, string> = {
    approved: "Aprobado",
    reviewing: "En revisión",
    rejected: "Rechazado",
    pending: "Pendiente",
    uploaded: "Cargado",
  };
  return map[status] || status;
}

function getNextAction(step: number): string {
  const map: Record<number, string> = {
    1: "Completar datos del objetivo",
    2: "Subir documentos requeridos →",
    3: "Confirmar ventana de postulación →",
    4: "Completar evaluación socioeconómica →",
    5: "Revisar estado de seguimiento →",
  };
  return map[step] || "Continuar solicitud →";
}
