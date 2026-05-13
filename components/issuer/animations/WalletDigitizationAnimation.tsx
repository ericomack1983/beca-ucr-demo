'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardConfig } from '@/types/issuer-flow';
import { VisaLogo } from '@/components/issuer/VisaLogo';

export type WalletType = 'digital_apple' | 'digital_google';

interface Props {
  type: WalletType;
  config: CardConfig;
}

export function WalletDigitizationAnimation({ type, config }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const isApple = type === 'digital_apple';
  const label = config.cardType === 'debit' ? 'DÉBITO' : 'PREPAGO';

  // Auto-run and replay when wallet type switches
  useEffect(() => {
    setPhase(0);
    const t = [
      setTimeout(() => setPhase(1), 480),
      setTimeout(() => setPhase(2), 1150),
      setTimeout(() => setPhase(3), 1750),
    ];
    return () => t.forEach(clearTimeout);
  }, [type]);

  return (
    <div className="relative flex flex-col items-center select-none" style={{ minHeight: 340 }}>

      {/* ── Floating card (phases 0–1) ── */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 0, scale: 1 }}
            animate={phase === 0
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 128, scale: 0.22 }
            }
            exit={{ opacity: 0 }}
            transition={phase === 1
              ? { duration: 0.5, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.3 }
            }
            className="absolute top-4 z-20"
          >
            <div
              className="w-44 h-[106px] rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 55%, #1434CB 100%)',
                boxShadow: '0 16px 48px rgba(20,52,203,0.45), 0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #90aaff, transparent)' }} />
              <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[7px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {label}
                    </p>
                    <div className="mt-1.5 w-7 h-[17px] rounded-sm"
                      style={{ background: 'linear-gradient(135deg, #FCC015, #e6ac00)' }} />
                  </div>
                  <VisaLogo color="white" height={11} />
                </div>
                <p className="text-[8px] tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  •••• •••• •••• 0000
                </p>
              </div>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phone ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-24"
      >
        {/* Frame */}
        <div
          className="relative w-32 h-56 rounded-[2.6rem]"
          style={{
            background: '#0c0c16',
            border: '3px solid #1e1e30',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {/* Dynamic island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-11 h-2.5 rounded-full z-10"
            style={{ background: '#0c0c16' }} />

          {/* Screen */}
          <div className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden" style={{ background: '#07070f' }}>

            {/* Status bar */}
            <div className="flex justify-between items-center px-4 pt-5 pb-0.5">
              <span className="text-[6px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>9:41</span>
              <div className="flex items-center gap-0.5">
                <div className="w-2.5 h-1.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.25)' }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {phase < 2 ? (
                /* Empty wallet screen */
                <motion.div key="idle" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                  className="flex flex-col items-center justify-center gap-2 mt-8"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'rgba(255,255,255,0.12)' }}>
                      <rect x="1" y="5" width="18" height="12" rx="2" />
                      <path d="M1 9h18" />
                    </svg>
                  </div>
                  <p className="text-[7px] font-medium" style={{ color: 'rgba(255,255,255,0.1)' }}>Wallet</p>
                </motion.div>
              ) : (
                /* Card inside phone */
                <motion.div key="active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center px-3 pt-2 gap-2"
                >
                  {/* Card thumbnail */}
                  <motion.div
                    initial={{ scale: 0.45, y: 16, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-xl overflow-hidden relative"
                    style={{
                      background: 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 55%, #1434CB 100%)',
                      aspectRatio: '1.586',
                      boxShadow: '0 6px 20px rgba(20,52,203,0.5)',
                    }}
                  >
                    <div className="absolute inset-0 p-2 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="w-4 h-[10px] rounded-sm"
                          style={{ background: 'linear-gradient(135deg, #FCC015, #e6ac00)' }} />
                        <VisaLogo color="white" height={6} />
                      </div>
                      <p className="text-[5px] tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        •••• 0000
                      </p>
                    </div>
                    {/* Entry flash */}
                    <motion.div className="absolute inset-0"
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.9, delay: 0.05 }}
                      style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.4), transparent 65%)' }}
                    />
                  </motion.div>

                  {/* Wallet brand */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    className="flex items-center gap-1"
                  >
                    {isApple ? (
                      <>
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="white">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <span className="text-[8px] font-semibold text-white">Pay</span>
                      </>
                    ) : (
                      <span className="text-[7px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>Google Pay</span>
                    )}
                  </motion.div>

                  {/* Success tick */}
                  <AnimatePresence>
                    {phase === 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                        className="flex items-center gap-1"
                      >
                        <div className="w-3 h-3 rounded-full flex items-center justify-center"
                          style={{ background: '#40996b' }}>
                          <svg viewBox="0 0 8 8" className="w-2 h-2" fill="none">
                            <path d="M1.5 4l1.5 1.5L6.5 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-[6.5px] font-semibold" style={{ color: '#6fcf97' }}>Añadida</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone glow on entry */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-[2.6rem] pointer-events-none"
                style={{ boxShadow: '0 0 40px 10px rgba(20,52,203,0.38), 0 0 80px 28px rgba(20,52,203,0.14)' }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Home bar */}
        <div className="w-16 h-[3px] rounded-full mx-auto mt-2.5"
          style={{ background: 'rgba(255,255,255,0.14)' }} />
      </motion.div>

      {/* Success label below phone */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 flex items-center gap-1.5"
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: '#d6f2c4' }}>
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                <path d="M2 5l2 2 4-4" stroke="#2C6849" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[11px] font-semibold" style={{ color: '#2C6849' }}>
              Tarjeta añadida a {isApple ? 'Apple Pay' : 'Google Pay'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
