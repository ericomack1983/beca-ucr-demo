'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowStudent, CardConfig, BatchPhase } from '@/types/issuer-flow';
import { DataUploadAnimation } from '@/components/issuer/animations/DataUploadAnimation';

const DELIVERY_LABELS: Record<string, string> = {
  digital: 'Solo Digital',
  digital_apple: 'Digital + Apple Pay',
  digital_google: 'Digital + Google Pay',
  digital_both: 'Digital + Ambas Wallets',
  digital_physical: 'Digital + Plástico',
};

const VALIDITY_LABELS: Record<string, string> = {
  semestral: 'Semestral (6 meses)',
  anual: 'Anual (12 meses)',
  custom: 'Personalizado',
};

function formatCRC(n: number) {
  return `₡${n.toLocaleString('es-CR')}`;
}

interface SummaryCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}

function SummaryCard({ icon, label, value, sub }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const BATCH_SEQUENCE: { phase: BatchPhase; durationMs: number }[] = [
  { phase: 'generating', durationMs: 2000 },
  { phase: 'validating', durationMs: 2500 },
  { phase: 'sending', durationMs: 2000 },
  { phase: 'processing', durationMs: 3000 },
  { phase: 'complete', durationMs: 0 },
];

interface Props {
  students: FlowStudent[];
  cardConfig: CardConfig;
  batchPhase: BatchPhase;
  batchProgress: number;
  currentRecord: number;
  onStartBatch: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4BatchUpload({
  students,
  cardConfig,
  batchPhase,
  batchProgress,
  currentRecord,
  onStartBatch,
  onNext,
  onBack,
}: Props) {
  const selected = students.filter(s => s.selected);
  const totalAmount = selected.length * cardConfig.monthlyAmount;
  const isRunning = batchPhase !== 'idle' && batchPhase !== 'complete' && batchPhase !== 'error';
  const isDone = batchPhase === 'complete';

  const byFaculty = selected.reduce<Record<string, number>>((acc, s) => {
    acc[s.faculty] = (acc[s.faculty] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          icon="👥"
          label="Estudiantes aprobados"
          value={String(selected.length)}
          sub="en el lote"
        />
        <SummaryCard
          icon="💰"
          label="Monto total del lote"
          value={formatCRC(totalAmount)}
          sub={`${formatCRC(cardConfig.monthlyAmount)} / estudiante`}
        />
        <SummaryCard
          icon="💳"
          label="Tipo de tarjeta"
          value={cardConfig.cardType === 'debit' ? 'Débito' : 'Prepago'}
          sub="Visa"
        />
        <SummaryCard
          icon="📦"
          label="Tipo de entrega"
          value={DELIVERY_LABELS[cardConfig.deliveryType]}
          sub={VALIDITY_LABELS[cardConfig.validity]}
        />
      </div>

      {/* Faculty breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Desglose por facultad
        </p>
        <div className="space-y-2">
          {Object.entries(byFaculty).map(([faculty, count]) => (
            <div key={faculty} className="flex items-center gap-3">
              <span className="text-sm text-slate-700 flex-1">{faculty}</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#1B5E20] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / selected.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Validation checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Validación pre-envío
        </p>
        <div className="space-y-2">
          {[
            { label: 'Sin registros duplicados', ok: true },
            { label: 'Todos los datos completos', ok: true },
            { label: `Montos dentro del rango (${formatCRC(50000)} — ${formatCRC(500000)})`, ok: cardConfig.monthlyAmount >= 50000 && cardConfig.monthlyAmount <= 500000 },
            { label: 'Configuración MCC válida', ok: cardConfig.mccs.length > 0 },
          ].map((check, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2.5"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                check.ok ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {check.ok ? (
                  <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-red-500" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${check.ok ? 'text-slate-700' : 'text-red-600'}`}>{check.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <AnimatePresence>
        {batchPhase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <DataUploadAnimation
              phase={batchPhase}
              progress={batchProgress}
              currentRecord={currentRecord}
              totalRecords={selected.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-40"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>

        <div className="flex gap-3">
          {!isDone && (
            <button
              onClick={onStartBatch}
              disabled={isRunning}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8l4-5v3h6v4H7v3L3 8z" fill="currentColor" />
                  </svg>
                  Enviar al banco
                </>
              )}
            </button>
          )}
          {isDone && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onNext}
              className="px-6 py-2.5 bg-[#1B5E20] text-white rounded-xl font-semibold text-sm hover:bg-[#2E7D32] active:scale-95 transition-all flex items-center gap-2"
            >
              Chequear emisión digital
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
