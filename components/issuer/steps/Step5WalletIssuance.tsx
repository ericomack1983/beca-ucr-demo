'use client';

import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowStudent, IssuanceStatus, CardConfig } from '@/types/issuer-flow';
import { WalletPushAnimation, type Ticket } from '@/components/issuer/animations/WalletPushAnimation';
import { SuccessBurst } from '@/components/issuer/animations/SuccessBurst';
import { VisaLogo } from '@/components/issuer/VisaLogo';

const WALLET_NAMES: Record<string, string> = {
  digital: 'Virtual',
  digital_apple: 'Apple Pay',
  digital_google: 'Google Pay',
  digital_physical: 'Digital',
};

/* ── Status config ── */
function StatusIcon({ status }: { status: IssuanceStatus }) {
  if (status === 'pending') {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
    );
  }
  if (status === 'generating') {
    return (
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-t-transparent shrink-0"
        style={{ borderColor: '#0088c7', borderTopColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      />
    );
  }
  if (status === 'sending') {
    return (
      <motion.div
        className="w-4 h-4 rounded-full shrink-0" style={{ background: '#c38004' }}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    );
  }
  if (status === 'active') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#40996b' }}
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    );
  }
  return (
    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#d65151' }}>
      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
        <path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const STATUS_LABELS: Record<IssuanceStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: 'En espera',          color: 'text-[#4a4a4a]',   bg: 'bg-[#f5f5f5]'          },
  generating: { label: 'Generando tarjeta',  color: 'text-[#005e8a]',   bg: 'bg-[#c7edff]/60'        },
  sending:    { label: 'Notificando portal', color: 'text-[#875903]',   bg: 'bg-[#ffef99]/60'        },
  active:     { label: 'Confirmado',         color: 'text-[#2C6849]',   bg: 'bg-[#d6f2c4]/60'       },
  error:      { label: 'Error',              color: 'text-[#AD2929]',   bg: 'bg-[#ffd6e9]/60'       },
};

function StatusPill({ status }: { status: IssuanceStatus }) {
  const cfg = STATUS_LABELS[status];
  return (
    <motion.span
      key={status}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}
    >
      <StatusIcon status={status} />
      {cfg.label}
    </motion.span>
  );
}

/* ── Phase indicator ── */
interface PhaseProps { isRunning: boolean; allDone: boolean; totalDone: number; totalStudents: number }

function PhaseIndicator({ isRunning, allDone, totalDone, totalStudents }: PhaseProps) {
  const phases = [
    {
      id: 1,
      label: 'Lote recibido',
      sublabel: `${totalStudents} estudiantes`,
      done: true,
      active: false,
    },
    {
      id: 2,
      label: 'Tarjetas generadas',
      sublabel: isRunning ? 'En proceso…' : allDone ? `${totalStudents} completadas` : 'Pendiente',
      done: allDone,
      active: isRunning,
    },
    {
      id: 3,
      label: 'Portal notificado',
      sublabel: totalDone > 0 ? `${totalDone} confirmadas` : 'Pendiente',
      done: allDone,
      active: isRunning && totalDone > 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
      <div className="flex items-start gap-0">
        {phases.map((phase, i) => (
          <React.Fragment key={phase.id}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="flex items-center justify-center">
                {phase.done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-7 h-7 rounded-full bg-[#1434CB] flex items-center justify-center shadow-sm"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                ) : phase.active ? (
                  <motion.div
                    className="w-7 h-7 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: '#c38004', borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">{phase.id}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-bold leading-tight ${phase.done ? 'text-[#1434CB]' : 'text-[#4a4a4a]/50'}`} style={phase.active ? { color: '#875903' } : undefined}>
                  {phase.label}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">{phase.sublabel}</p>
              </div>
            </div>
            {i < phases.length - 1 && (
              <div className="flex-1 mt-3.5 mx-1">
                <div className={`h-px ${phases[i + 1].done || phases[i + 1].active ? 'bg-[#1434CB]/40' : 'bg-slate-200'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
interface Props {
  students: FlowStudent[];
  cardConfig: CardConfig;
  onStatusChange: (id: string, status: IssuanceStatus) => void;
  onBack: () => void;
  onNext?: () => void;
}

export function Step5WalletIssuance({ students, cardConfig, onStatusChange, onBack, onNext }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [recentIssuances, setRecentIssuances] = useState<Ticket[]>([]);
  const [allDone, setAllDone] = useState(false);

  const selected = students.filter(s => s.selected);
  const totalDone = selected.filter(s => s.issuanceStatus === 'active').length;
  const walletLabel = WALLET_NAMES[cardConfig.deliveryType] ?? 'Digital';

  const startIssuance = useCallback(async () => {
    if (isRunning || allDone) return;
    setIsRunning(true);


    for (const student of selected) {
      if (student.issuanceStatus === 'active') continue;

      onStatusChange(student.id, 'generating');
      await delay(500 + Math.random() * 400);

      onStatusChange(student.id, 'sending');
      await delay(600 + Math.random() * 400);

      onStatusChange(student.id, 'active');
      const last4 = String(1000 + Math.floor(Math.random() * 9000));
      setRecentIssuances(prev => [
        ...prev,
        {
          id: student.id,
          name: student.name,
          wallet: walletLabel,
          timestamp: Date.now(),
          amount: cardConfig.monthlyAmount,
          last4,
        },
      ]);

      await delay(250);
    }

    setIsRunning(false);
    setAllDone(true);
  }, [isRunning, allDone, selected, onStatusChange, walletLabel, cardConfig.monthlyAmount]);

  useEffect(() => {
    startIssuance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      {/* Phase progress */}
      <PhaseIndicator
        isRunning={isRunning}
        allDone={allDone}
        totalDone={totalDone}
        totalStudents={selected.length}
      />

      {/* Animation panel */}
      <WalletPushAnimation
        recentIssuances={recentIssuances}
        totalDone={totalDone}
        totalStudents={selected.length}
        isRunning={isRunning}
      />

      {/* Success burst */}
      <AnimatePresence>
        {allDone && (
          <SuccessBurst
            totalIssued={totalDone}
            totalAmount={totalDone * cardConfig.monthlyAmount}
          />
        )}
      </AnimatePresence>

      {/* Student issuance table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Estado de emisión individual</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalDone} de {selected.length} tarjetas emitidas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1434CB] rounded-full"
                animate={{ width: selected.length > 0 ? `${(totalDone / selected.length) * 100}%` : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {selected.length > 0 ? Math.round((totalDone / selected.length) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {selected.map((student) => {
            const issued = recentIssuances.find(t => t.id === student.id);
            return (
              <motion.div
                key={student.id}
                layout
                className="px-5 py-3 flex items-center gap-3"
              >
                <StatusIcon status={student.issuanceStatus} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.program} · {student.carne}</p>
                </div>

                {issued && (
                  <div className="shrink-0 text-right hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-11 h-7 rounded-md shrink-0 flex items-center justify-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 60%, #1434CB 100%)' }}
                      >
                        <VisaLogo color="white" height={10} />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%)' }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">•••• {issued.last4}</span>
                    </div>
                  </div>
                )}

                <StatusPill status={student.issuanceStatus} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-md border-2 border-[rgba(0,0,0,0.1)] text-sm font-semibold text-[#4a4a4a] hover:bg-[#f5f5f5] hover:border-[rgba(0,0,0,0.18)] transition-all flex items-center gap-2 disabled:opacity-40"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>

        <div className="flex gap-3">
          {allDone && onNext && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              onClick={onNext}
              className="px-6 py-2.5 bg-[#1434CB] text-white rounded-md font-semibold text-sm tracking-[0.25px] hover:bg-[#173be8] active:bg-[#0f2595] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ver Analytics
            </motion.button>
          )}
          {allDone && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-5 py-2.5 rounded-md border-2 border-[rgba(0,0,0,0.1)] text-[#4a4a4a] font-semibold text-sm hover:bg-[#f5f5f5] hover:border-[rgba(0,0,0,0.18)] active:scale-[0.98] transition-all flex items-center gap-2"
              onClick={() => {
                const csv = [
                  'Nombre,Carne,Programa,Tarjeta,Estado',
                  ...selected.map(s => {
                    const t = recentIssuances.find(r => r.id === s.id);
                    return `${s.name},${s.carne},${s.program},${t ? `••••${t.last4}` : ''},${s.issuanceStatus}`;
                  }),
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lote-becas-bncr.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 3v7M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Descargar reporte
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
