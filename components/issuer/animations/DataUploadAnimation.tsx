'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BatchPhase } from '@/types/issuer-flow';

const PHASE_LABELS: Record<BatchPhase, string> = {
  idle: 'Preparado para generar',
  generating: 'Generando archivo de lote...',
  validating: 'Validando registros...',
  sending: 'Enviando al banco...',
  processing: 'Procesando en core bancario...',
  complete: 'Lote procesado exitosamente',
  error: 'Error en el proceso',
};

const PHASE_ORDER: BatchPhase[] = ['generating', 'validating', 'sending', 'processing', 'complete'];

function phaseIndex(p: BatchPhase) {
  return PHASE_ORDER.indexOf(p);
}

interface Props {
  phase: BatchPhase;
  progress: number;
  currentRecord: number;
  totalRecords: number;
}

export function DataUploadAnimation({ phase, progress, currentRecord, totalRecords }: Props) {
  const isActive = phase !== 'idle' && phase !== 'complete' && phase !== 'error';
  const isDone = phase === 'complete';

  return (
    <div className="space-y-6">
      {/* SVG visualization */}
      <div className="bg-slate-950 rounded-2xl p-6 overflow-hidden relative" style={{ height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
          {/* University icon */}
          <g transform="translate(40, 50)">
            <rect x="5" y="25" width="50" height="35" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            <polygon points="30,5 5,25 55,25" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            <rect x="18" y="38" width="8" height="12" rx="1" fill="#60a5fa" />
            <rect x="34" y="38" width="8" height="12" rx="1" fill="#60a5fa" />
            <text x="30" y="78" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace">UCR</text>
          </g>

          {/* Bank icon */}
          <g transform="translate(510, 50)">
            <rect x="5" y="20" width="50" height="40" rx="3" fill="#1a3a1f" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="1" y="15" width="58" height="8" rx="2" fill="#1a3a1f" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="12" y="30" width="7" height="20" rx="1" fill="#4ade80" />
            <rect x="24" y="30" width="7" height="20" rx="1" fill="#4ade80" />
            <rect x="36" y="30" width="7" height="20" rx="1" fill="#4ade80" />
            <rect x="5" y="50" width="50" height="4" rx="1" fill="#22c55e" opacity="0.6" />
            <text x="30" y="78" textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="monospace">BNCR</text>
          </g>

          {/* Connection path */}
          <path
            d="M 100 80 L 500 80"
            stroke="#1e293b"
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Active data stream */}
          {isActive && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.circle
                  key={i}
                  r="5"
                  fill="#3b82f6"
                  filter="url(#glow)"
                  initial={{ cx: 100, opacity: 0 }}
                  animate={{
                    cx: [100, 300, 500],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  cy={80}
                />
              ))}
              {[0, 1, 2].map((i) => (
                <motion.rect
                  key={`pkt_${i}`}
                  width="18"
                  height="10"
                  rx="2"
                  fill="#1d4ed8"
                  stroke="#60a5fa"
                  strokeWidth="1"
                  y={75}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{
                    x: [100, 300, 490],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.8 + 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </>
          )}

          {/* Done beam */}
          {isDone && (
            <motion.line
              x1="100" y1="80" x2="500" y2="80"
              stroke="#22c55e"
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Status dot on university */}
          {isActive && (
            <motion.circle
              cx="65" cy="50" r="5"
              fill="#f59e0b"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {isDone && <circle cx="65" cy="50" r="5" fill="#22c55e" />}

          {/* Status dot on bank */}
          {isDone && (
            <motion.circle
              cx="535" cy="50" r="5"
              fill="#22c55e"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            />
          )}
        </svg>
      </div>

      {/* Phase stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {PHASE_ORDER.map((p, i) => {
          const currentIdx = phaseIndex(phase);
          const done = isDone || currentIdx > i;
          const active = currentIdx === i && !isDone;
          return (
            <div key={p} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                done ? 'bg-emerald-100 text-emerald-700' :
                active ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-400'
              }`}>
                {done && <span>✓</span>}
                {active && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                )}
                {PHASE_LABELS[p].split('...')[0].split(' ').slice(0, 2).join(' ')}
              </div>
              {i < PHASE_ORDER.length - 1 && (
                <div className={`w-4 h-px ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs text-slate-500">
              <span>{PHASE_LABELS[phase]}</span>
              <span className="font-mono font-bold text-slate-700">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            {isActive && totalRecords > 0 && (
              <p className="text-xs text-slate-400 font-mono">
                Procesando registro{' '}
                <span className="text-slate-700 font-bold">{currentRecord}</span>
                {' '}de{' '}
                <span className="text-slate-700 font-bold">{totalRecords}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
