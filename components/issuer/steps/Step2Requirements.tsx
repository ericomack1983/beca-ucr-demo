'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowStudent, DocumentStatus } from '@/types/issuer-flow';

function CheckIcon() {
  return (
    <motion.svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-slate-400', bg: 'bg-slate-100' },
  uploaded: { label: 'Cargado', color: 'text-amber-600', bg: 'bg-amber-50' },
  verified: { label: 'Verificado', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

function DocumentRow({
  label,
  status,
  onToggle,
}: {
  label: string;
  status: DocumentStatus;
  onToggle: () => void;
}) {
  const isVerified = status === 'verified';
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
      <button
        onClick={onToggle}
        aria-label={`Verificar: ${label}`}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          isVerified
            ? 'bg-[#1434CB] border-[#1434CB]'
            : 'border-slate-300 hover:border-[#1434CB]'
        }`}
      >
        <AnimatePresence>
          {isVerified && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <CheckIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className={`text-sm flex-1 ${isVerified ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
        {label}
      </span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
        {cfg.label}
      </span>
    </div>
  );
}

function DropZone({ onDrop }: { onDrop: () => void }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); onDrop(); }}
      onClick={onDrop}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? 'border-[#1434CB] bg-[#1434CB]/5 scale-105'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Zona de arrastre para documentos"
      onKeyDown={e => e.key === 'Enter' && onDrop()}
    >
      <motion.div
        animate={dragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
        className="text-2xl mb-1"
      >
        📎
      </motion.div>
      <p className="text-xs text-slate-400">
        {dragging ? 'Suelte para adjuntar' : 'Arrastre archivos aquí o haga clic'}
      </p>
    </div>
  );
}

interface StudentCardProps {
  student: FlowStudent;
  expanded: boolean;
  onToggle: () => void;
  onDocToggle: (docId: string) => void;
  onDrop: (docId: string) => void;
}

function StudentRequirementCard({ student, expanded, onToggle, onDocToggle, onDrop }: StudentCardProps) {
  const verified = student.documents.filter(d => d.status === 'verified').length;
  const total = student.documents.length;
  const progress = (verified / total) * 100;
  const isComplete = verified === total;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
      isComplete ? 'border-emerald-200' : 'border-slate-200'
    }`}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors text-left rounded-2xl"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm">{student.name}</span>
            <span className="text-xs text-slate-400 font-mono">{student.carne}</span>
            {isComplete && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200"
                style={{
                  background: 'linear-gradient(90deg, #d1fae5, #a7f3d0, #d1fae5)',
                  backgroundSize: '200% auto',
                  animation: 'shine 2s linear infinite',
                }}
              >
                ✓ Completo
              </motion.span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{student.program}</p>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-black text-slate-900">{verified}<span className="text-sm font-normal text-slate-400">/{total}</span></p>
          <p className="text-[10px] text-slate-400">verificados</p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 pb-5 pt-4 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Lista de requisitos
                </p>
                {student.documents.map(doc => (
                  <DocumentRow
                    key={doc.id}
                    label={doc.label}
                    status={doc.status}
                    onToggle={() => onDocToggle(doc.id)}
                  />
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Adjuntar documentos
                </p>
                <DropZone onDrop={() => {
                  const pending = student.documents.find(d => d.status === 'pending');
                  if (pending) onDrop(pending.id);
                }} />
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  Al soltar, el documento se marca como "Cargado"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  students: FlowStudent[];
  onDocStatusChange: (studentId: string, docId: string, status: DocumentStatus) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Requirements({ students, onDocStatusChange, onNext, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(students[0]?.id ?? null);

  const selectedStudents = students.filter(s => s.selected);
  const allComplete = selectedStudents.every(s =>
    s.documents.every(d => d.status === 'verified')
  );
  const globalProgress = selectedStudents.length > 0
    ? selectedStudents.reduce((sum, s) => {
        const v = s.documents.filter(d => d.status === 'verified').length;
        return sum + v / s.documents.length;
      }, 0) / selectedStudents.length * 100
    : 0;

  const handleDocToggle = (student: FlowStudent, docId: string) => {
    const doc = student.documents.find(d => d.id === docId);
    if (!doc) return;
    const next: DocumentStatus =
      doc.status === 'pending' ? 'uploaded' :
      doc.status === 'uploaded' ? 'verified' : 'pending';
    onDocStatusChange(student.id, docId, next);
  };

  const handleDrop = (student: FlowStudent, docId: string) => {
    onDocStatusChange(student.id, docId, 'uploaded');
  };

  return (
    <div className="space-y-5">
      {/* Global progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-slate-900">Progreso global del lote</p>
            <p className="text-xs text-slate-400">{selectedStudents.length} estudiantes seleccionados</p>
          </div>
          <span className="text-2xl font-black text-slate-900">{Math.round(globalProgress)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${allComplete ? 'bg-emerald-500' : 'bg-[#1434CB]'}`}
            animate={{ width: `${globalProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {allComplete && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-emerald-600 font-semibold mt-2"
          >
            ✓ Todos los requisitos completados — puede continuar
          </motion.p>
        )}
      </div>

      {/* Student cards */}
      <div className="space-y-3">
        {selectedStudents.map(student => (
          <StudentRequirementCard
            key={student.id}
            student={student}
            expanded={expandedId === student.id}
            onToggle={() => setExpandedId(prev => prev === student.id ? null : student.id)}
            onDocToggle={(docId) => handleDocToggle(student, docId)}
            onDrop={(docId) => handleDrop(student, docId)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!allComplete}
          className="px-6 py-2.5 bg-[#1434CB] text-white rounded-xl font-semibold text-sm hover:bg-[#1232b8] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Configurar tarjeta
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
