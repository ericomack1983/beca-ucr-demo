'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import type { CardConfig } from '@/types/issuer-flow';
import { MCC_CATEGORIES } from '@/types/issuer-flow';
import { VisaLogo } from '@/components/issuer/VisaLogo';

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


interface Props {
  config: CardConfig;
}

export function CardPreview3D({ config }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isPhysical = config.deliveryType === 'digital_physical';
  const gradient = 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 50%, #1434CB 100%)';

  const rotXRaw = useMotionValue(0);
  const rotYRaw = useMotionValue(0);
  const rotX = useSpring(rotXRaw, { stiffness: 50, damping: 14 });
  const rotY = useSpring(rotYRaw, { stiffness: 50, damping: 14 });

  // Glare follows tilt
  const glareBackground = useTransform(
    [rotY, rotX],
    ([ry, rx]: number[]) => {
      const gx = 50 + (ry / 22) * 38;
      const gy = 50 - (rx / 10) * 35;
      return `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, transparent 62%)`;
    }
  );

  useAnimationFrame((t) => {
    if (isHoveredRef.current) return;
    const baseY = isPhysical ? 180 : 0;
    rotYRaw.set(baseY + Math.sin(t / 4200) * 16);
    rotXRaw.set(Math.sin(t / 6100) * 5);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotYRaw.set((isPhysical ? 180 : 0) + nx * 30);
    rotXRaw.set(-ny * 20);
  };

  const handleMouseEnter = () => { isHoveredRef.current = true; };
  const handleMouseLeave = () => { isHoveredRef.current = false; };

  const selectedMCCs = MCC_CATEGORIES.filter(m => config.mccs.includes(m.id));

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="cursor-pointer"
        style={{ perspective: '900px', width: '100%', maxWidth: 340, margin: '0 auto' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
          className="relative select-none"
          aria-label="Vista previa de tarjeta"
        >
          {/* Front */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: gradient,
              aspectRatio: '1.586 / 1',
              backfaceVisibility: 'hidden',
              boxShadow: '0 32px 64px -12px rgba(20,52,203,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <div className="absolute rounded-full"
              style={{ width: '55%', aspectRatio: '1/1', background: 'rgba(255,255,255,0.06)', top: '10%', right: '-5%' }} />
            <div className="absolute rounded-full"
              style={{ width: '45%', aspectRatio: '1/1', background: 'rgba(255,255,255,0.04)', top: '30%', right: '15%' }} />

            {/* Dynamic glare */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: glareBackground }}
            />

            <div className="relative h-full flex flex-col justify-between p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                    {CARD_TYPE_LABELS[config.cardType]}
                  </span>
                  <div className="flex items-center gap-2">
                    <ChipSVG />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <VisaLogo color="white" height={14} />
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

          {/* Back face (physical) */}
          {isPhysical && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background: gradient,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                boxShadow: '0 32px 64px -12px rgba(20,52,203,0.55)',
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
      {config.mccEnabled && selectedMCCs.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {selectedMCCs.map(mcc => (
            <motion.div
              key={mcc.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1434CB]/10 border border-[#1434CB]/30 rounded-full text-xs font-medium text-[#1434CB]"
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
