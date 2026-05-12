'use client';

import { motion } from 'framer-motion';

const STEPS = [
  { number: 1, label: 'Filtrado', sublabel: 'Screening' },
  { number: 2, label: 'Requisitos', sublabel: 'Documentación' },
  { number: 3, label: 'Configuración', sublabel: 'Tarjeta' },
  { number: 4, label: 'Pre-Aprobación', sublabel: 'Lote bancario' },
  { number: 5, label: 'Emisión', sublabel: 'Wallets' },
];

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function IssuerStepper({ currentStep, onStepClick }: Props) {
  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full flex items-start justify-between relative py-2">
      {/* Track */}
      <div className="absolute top-7 left-0 right-0 h-0.5 bg-slate-200 z-0" />
      <motion.div
        className="absolute top-7 left-0 h-0.5 bg-[#1B5E20] z-0 origin-left"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {STEPS.map((step) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isClickable = isDone;
        return (
          <button
            key={step.number}
            onClick={() => isClickable && onStepClick(step.number)}
            disabled={!isClickable}
            className="relative z-10 flex flex-col items-center gap-2 focus:outline-none"
            aria-label={`Paso ${step.number}: ${step.label}`}
          >
            <motion.div
              animate={{
                backgroundColor: isDone ? '#1B5E20' : isActive ? '#2E7D32' : '#F1F5F9',
                borderColor: isActive || isDone ? '#1B5E20' : '#E2E8F0',
                scale: isActive ? 1.12 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
            >
              {isDone ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {step.number}
                </span>
              )}
            </motion.div>
            <div className="text-center hidden sm:block min-w-[72px]">
              <p className={`text-[11px] font-bold leading-none transition-colors ${
                isActive ? 'text-[#1B5E20]' : isDone ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {step.label}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{step.sublabel}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
