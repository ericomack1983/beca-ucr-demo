"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApplicationById } from "@/lib/mock-applications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";

export default function SolicitudDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const app = getApplicationById(id);

  if (!app) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">Solicitud no encontrada.</p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isApproved = app.status === "approved";
  const isReview = app.status === "under_review";
  const isRejected = app.status === "rejected";

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">{app.program}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Folio #{app.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-2xl p-6 text-center space-y-2 border-2 ${
        isApproved ? "bg-emerald-50 border-emerald-200" :
        isReview ? "bg-blue-50 border-blue-200" :
        isRejected ? "bg-red-50 border-red-200" :
        "bg-slate-50 border-slate-200"
      }`}>
        <div className={`text-4xl font-bold ${
          isApproved ? "text-emerald-600" :
          isReview ? "text-blue-600" :
          isRejected ? "text-red-600" :
          "text-slate-600"
        }`}>
          {isApproved ? "✓" : isReview ? "◷" : isRejected ? "✗" : "—"}
        </div>
        <Badge variant={isApproved ? "success" : isReview ? "secondary" : isRejected ? "danger" : "default"}>
          {isApproved ? "Solicitud Aprobada" :
           isReview ? "En Revisión" :
           isRejected ? "No Aprobada" :
           "En Proceso"}
        </Badge>
        <p className="text-sm text-slate-500">
          Decisión estimada: {formatDateShort(app.estimatedDecisionDate)}
        </p>
      </div>

      {/* Risk assessment */}
      {app.riskAssessment && (
        <Card className="p-6 border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">I</span>
            </div>
            <span className="text-sm font-semibold text-slate-800">Issuer — Resultado de evaluación</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className={`text-3xl font-bold ${
                app.riskAssessment.tier === "LOW" ? "text-emerald-600" :
                app.riskAssessment.tier === "MEDIUM" ? "text-amber-600" :
                "text-red-600"
              }`}>{app.riskAssessment.score}</p>
              <p className="text-xs text-slate-400">Puntaje</p>
            </div>
            <div>
              <Badge variant={app.riskAssessment.tier === "LOW" ? "success" : app.riskAssessment.tier === "MEDIUM" ? "warning" : "danger"}>
                {app.riskAssessment.tier === "LOW" ? "Riesgo Bajo" :
                 app.riskAssessment.tier === "MEDIUM" ? "Riesgo Medio" :
                 "Riesgo Alto"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500">{app.riskAssessment.completedAt ? formatDateShort(app.riskAssessment.completedAt) : "—"}</p>
              <p className="text-xs text-slate-400">Completado</p>
            </div>
          </div>

          <div className="space-y-2">
            {app.riskAssessment.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                {r}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Next steps if approved */}
      {isApproved && (
        <Card className="p-6 bg-emerald-50 border-emerald-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-3">Próximos pasos</h3>
          <ol className="space-y-2">
            {[
              "Firma del contrato de beca (se enviará por correo en 3 días hábiles)",
              "Coordinación con la unidad asignada",
              "Activación del expediente en la Plataforma Administrativa UCR",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                <span className="font-bold shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
