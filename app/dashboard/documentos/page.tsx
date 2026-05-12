"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Upload, Eye, RefreshCw, Download,
  CheckCircle2, Clock, XCircle, AlertCircle, MoreVertical
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import { getApplicationByStudentId, type DocumentItem } from "@/lib/mock-applications";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DOC_TYPES = [
  { id: "identity", label: "Cédula / Pasaporte" },
  { id: "academic", label: "Certificación de Notas" },
  { id: "admission", label: "Carta de Admisión" },
  { id: "financial", label: "Comprobante de Ingresos" },
  { id: "personal", label: "Carta de Presentación" },
  { id: "recommendation", label: "Carta de Recomendación" },
  { id: "cv", label: "Curriculum Vitae" },
];

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    getSession().then(session => {
      if (!session) return;
      const mockId = (MOCK_STUDENTS.find(s => s.email === session.email) ?? MOCK_STUDENTS[0]).id;
      setStudentId(mockId);
      const app = getApplicationByStudentId(mockId);
      if (app) setDocuments(app.documents);
    });
  }, []);

  const handleUpload = async (docId: string) => {
    setUploading(docId);
    await new Promise((r) => setTimeout(r, 1400));
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: "reviewing", uploadedAt: new Date().toISOString(), fileSize: "1.1 MB" }
          : d
      )
    );
    setUploading(null);
  };

  const approved = documents.filter((d) => d.status === "approved").length;
  const total = documents.length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">Documentos</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestión y seguimiento de su expediente documental
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Aprobados", count: documents.filter(d => d.status === "approved").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "En revisión", count: documents.filter(d => d.status === "reviewing").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Rechazados", count: documents.filter(d => d.status === "rejected").length, color: "text-red-600", bg: "bg-red-50" },
          { label: "Pendientes", count: documents.filter(d => d.status === "pending").length, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((item) => (
          <Card key={item.label} className={`p-4 ${item.bg} border-0`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Progreso del expediente</p>
          <span className="text-sm font-bold text-[#0B2A5B]">{approved}/{total} documentos</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(approved / Math.max(total, 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-[#0B2A5B] to-[#2563EB] rounded-full"
          />
        </div>
      </Card>

      {/* Document grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <DocumentCard
              doc={doc}
              uploading={uploading === doc.id}
              onUpload={() => handleUpload(doc.id)}
            />
          </motion.div>
        ))}

        {/* Placeholders for document types not yet in the list */}
        {DOC_TYPES.filter(
          (dt) => !documents.find((d) => d.type === dt.id)
        ).map((dt) => (
          <motion.div
            key={dt.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-5 border-dashed border-2 border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-600">{dt.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">No cargado — Opcional</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs">
                  <Upload className="w-3.5 h-3.5 mr-1" /> Subir
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <Card className="p-5 bg-blue-50 border-blue-100">
        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">Instrucciones</p>
        <ul className="space-y-1.5 text-sm text-blue-700">
          <li className="flex items-start gap-2"><span className="mt-0.5">•</span>Formatos aceptados: PDF, JPG, PNG (máx. 10 MB)</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">•</span>El comprobante de ingresos no puede tener más de 30 días de emitido</li>
          <li className="flex items-start gap-2"><span className="mt-0.5">•</span>Los documentos rechazados deben resubirse en un plazo de 48 horas</li>
        </ul>
      </Card>
    </div>
  );
}

function DocumentCard({
  doc,
  uploading,
  onUpload,
}: {
  doc: DocumentItem;
  uploading: boolean;
  onUpload: () => void;
}) {
  const statusConfig = {
    approved: { icon: CheckCircle2, label: "Aprobado", color: "text-emerald-600", bg: "bg-emerald-50", badge: "success" as const },
    reviewing: { icon: Clock, label: "En revisión", color: "text-blue-600", bg: "bg-blue-50", badge: "secondary" as const },
    rejected: { icon: XCircle, label: "Rechazado", color: "text-red-600", bg: "bg-red-50", badge: "danger" as const },
    pending: { icon: AlertCircle, label: "Pendiente", color: "text-slate-500", bg: "bg-slate-50", badge: "outline" as const },
    uploaded: { icon: Clock, label: "Cargado", color: "text-blue-600", bg: "bg-blue-50", badge: "secondary" as const },
  };

  const cfg = statusConfig[doc.status];
  const Icon = cfg.icon;

  return (
    <Card className={`p-5 ${doc.status === "rejected" ? "border-red-200" : ""}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
            {doc.required && (
              <span className="text-[10px] text-slate-400 shrink-0">Requerido</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {doc.uploadedAt && <span>{formatDateShort(doc.uploadedAt)}</span>}
            {doc.fileSize && <><span>·</span><span>{doc.fileSize}</span></>}
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <Badge variant={cfg.badge}>{cfg.label}</Badge>
            {(doc.status === "rejected" || doc.status === "pending") && (
              <button
                onClick={onUpload}
                disabled={uploading}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="w-3 h-3 border border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    {doc.status === "rejected" ? "Reemplazar" : "Subir"}
                  </>
                )}
              </button>
            )}
            {doc.status === "approved" && (
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                <Download className="w-3 h-3" /> Descargar
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
