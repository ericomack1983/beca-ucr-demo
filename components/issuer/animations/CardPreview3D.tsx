'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { CardConfig } from '@/types/issuer-flow';
import { MCC_CATEGORIES } from '@/types/issuer-flow';

const CARD_TYPE_LABELS = { debit: 'Débito', prepaid: 'Prepago' };
const DELIVERY_LABELS: Record<string, string> = {
  digital: 'Digital',
  digital_apple: 'Apple Pay',
  digital_google: 'Google Pay',
  digital_both: 'Ambas',
  digital_physical: 'Físico',
};

function formatCRC(amount: number) {
  return `₡${amount.toLocaleString('es-CR')}`;
}

function ChipSVG() {
  return (
    <svg width="28" height="21" viewBox="0 0 32 24" fill="none">
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="#F59E0B" stroke="#D97706" />
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="url(#chip-shine3d)" />
      <line x1="11" y1="0.5" x2="11" y2="23.5" stroke="#D97706" strokeWidth="0.75" />
      <line x1="21" y1="0.5" x2="21" y2="23.5" stroke="#D97706" strokeWidth="0.75" />
      <line x1="0.5" y1="8" x2="31.5" y2="8" stroke="#D97706" strokeWidth="0.75" />
      <line x1="0.5" y1="16" x2="31.5" y2="16" stroke="#D97706" strokeWidth="0.75" />
      <rect x="12" y="7" width="8" height="10" rx="1.5" fill="#E8AB30" stroke="#D97706" strokeWidth="0.5" />
      <defs>
        <linearGradient id="chip-shine3d" x1="0" y1="0" x2="32" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VisaWordmark() {
  return (
    <svg width="44" height="15" viewBox="0 0 52 18" fill="none">
      <path d="M0 1H4.5L8 12L11.5 1H16L10 17H6L0 1Z" fill="white" />
      <path d="M17 1H21V17H17V1Z" fill="white" />
      <path d="M23 12.5C23 12.5 25 14.5 27.5 14.5C29 14.5 30 13.8 30 12.8C30 11.5 28.5 11 27 10.3C25 9.4 23 8.2 23 5.8C23 3 25.5 0.7 29 0.7C31.5 0.7 33.5 1.8 33.5 1.8L32 4.8C32 4.8 30.5 3.8 29 3.8C27.8 3.8 27 4.4 27 5.2C27 6.3 28.5 6.8 30 7.5C32 8.4 34 9.8 34 12.5C34 15.5 31.5 17.5 27.5 17.5C24.5 17.5 22.5 16 22 15.5L23 12.5Z" fill="white" />
      <path d="M36 17L41 1H46L52 17H48L47 14H40L39 17H36ZM41 11H46L43.5 4L41 11Z" fill="white" />
    </svg>
  );
}

interface Props {
  config: CardConfig;
}

export function CardPreview3D({ config }: Props) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const isPhysical = config.deliveryType === 'digital_physical';
  const gradients: Record<string, string> = {
    debit: 'linear-gradient(135deg, #1a2fd4 0%, #2346e8 55%, #2b5af5 100%)',
    prepaid: 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 50%, #1434CB 100%)',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX((e.clientX - rect.left) / rect.width - 0.5);
    setMouseY((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setMouseX(0);
    setMouseY(0);
  };

  const selectedMCCs = MCC_CATEGORIES.filter(m => config.mccs.includes(m.id));

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="cursor-pointer"
        style={{ perspective: '800px', width: '100%', maxWidth: 340, margin: '0 auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: isPhysical ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
          aria-label="Vista previa de tarjeta"
        >
          {/* Front */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: gradients[config.cardType],
              aspectRatio: '1.586 / 1',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="absolute rounded-full opacity-10"
              style={{ width: '55%', aspectRatio: '1/1', background: 'rgba(255,255,255,0.07)', top: '10%', right: '-5%' }} />
            <div className="absolute rounded-full opacity-10"
              style={{ width: '45%', aspectRatio: '1/1', background: 'rgba(255,255,255,0.05)', top: '30%', right: '15%' }} />

            <div className="relative h-full flex flex-col justify-between p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                    {CARD_TYPE_LABELS[config.cardType]} BNCR
                  </span>
                  <div className="flex items-center gap-2">
                    <ChipSVG />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <VisaWordmark />
                  <p className="text-[8px] text-white/40 uppercase tracking-wider">
                    {config.validity === 'semestral' ? 'Semestral' : config.validity === 'anual' ? 'Anual' : 'Custom'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1">
                {[0, 1, 2].map((g) => (
                  <div key={g} className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((d) => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    ))}
                  </div>
                ))}
                <span className="font-mono text-white font-semibold text-base tracking-widest ml-1">
                  {String(config.monthlyAmount).slice(-4).padStart(4, '0')}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-semibold">Monto mensual</p>
                  <motion.p
                    key={config.monthlyAmount}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-white font-mono mt-0.5"
                  >
                    {formatCRC(config.monthlyAmount)}
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-semibold">Entrega</p>
                  <p className="text-[10px] text-white/80 font-semibold mt-0.5 tracking-wide">{DELIVERY_LABELS[config.deliveryType]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back face (shown when physical selected) */}
          {isPhysical && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: gradients[config.cardType],
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="w-full mt-8 h-10 bg-slate-900/60" />
              <div className="px-5 pt-3">
                <div className="bg-white/90 h-7 rounded flex items-center px-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 19 }).map((_, i) => (
                      <span key={i} className={`text-[8px] text-slate-600 ${i > 11 ? 'font-bold' : ''}`}>
                        {i > 11 ? '•' : '—'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <div className="bg-white/20 rounded px-2 py-1">
                    <p className="text-[8px] text-white/60 uppercase">CVV</p>
                    <p className="text-sm text-white font-mono font-bold">•••</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* MCC chips */}
      {selectedMCCs.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedMCCs.map(mcc => (
            <motion.div
              key={mcc.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 px-3 py-1 bg-[#1434CB]/10 border border-[#1434CB]/30 rounded-full text-xs font-medium text-[#1434CB]"
            >
              <span>{mcc.icon}</span>
              {mcc.label}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
