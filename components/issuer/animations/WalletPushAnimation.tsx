'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Ticket {
  id: string;
  name: string;
  wallet: string;
  timestamp: number;
  amount: number;
  last4: string;
}

interface Props {
  recentIssuances: Ticket[];
  totalDone: number;
  totalStudents: number;
  isRunning: boolean;
}

function formatCRC(n: number) {
  return `₡${n.toLocaleString('es-CR')}`;
}

function VisaCardMini({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-14 h-9 rounded-lg shadow-xl flex flex-col justify-between p-1.5 relative overflow-hidden shrink-0 ${className}`}
      style={{ background: 'linear-gradient(135deg, #0a0e2e 0%, #1232b8 50%, #1434CB 100%)' }}
    >
      <div
        className="w-4 h-2.5 rounded-sm"
        style={{ background: 'linear-gradient(135deg, #FCC015, #e6ac00)' }}
      />
      <div className="flex justify-end">
        <span
          className="text-white leading-none select-none"
          style={{
            fontFamily: '"Arial Black","Arial Bold",Arial,sans-serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 10,
            letterSpacing: '-0.3px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          VISA
        </span>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)' }}
      />
    </div>
  );
}

function BNCRNode({ isRunning }: { isRunning: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 w-[72px]">
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center border"
        style={{ background: 'rgba(27,94,32,0.15)', borderColor: 'rgba(74,222,128,0.3)' }}
        animate={isRunning ? {
          boxShadow: [
            '0 0 0 0px rgba(74,222,128,0)',
            '0 0 0 6px rgba(74,222,128,0.15)',
            '0 0 0 0px rgba(74,222,128,0)',
          ],
        } : { boxShadow: '0 0 0 0 rgba(74,222,128,0)' }}
        transition={{ duration: 1.8, repeat: isRunning ? Infinity : 0 }}
      >
        <span
          className="leading-none select-none"
          style={{
            color: '#4ade80',
            fontFamily: '"Arial Black","Arial Bold",Arial,sans-serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 16,
            letterSpacing: '-0.5px',
            textShadow: '0 1px 4px rgba(74,222,128,0.3)',
          }}
        >
          VISA
        </span>
      </motion.div>
      <div className="text-center leading-tight">
        <p className="text-[9px] font-bold text-[#FCC015] font-mono tracking-wider">Visa Emisor</p>
      </div>
    </div>
  );
}

function PortalNode({ totalDone }: { totalDone: number }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 w-[72px]">
      <div className="relative">
        <motion.div
          key={totalDone}
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(96,165,250,0.3)' }}
          animate={totalDone > 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </motion.div>
        <AnimatePresence>
          {totalDone > 0 && (
            <motion.div
              key={totalDone}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center px-1"
            >
              <span className="text-[8px] font-bold text-white">{totalDone}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center leading-tight">
        <p className="text-[9px] font-bold text-blue-400 font-mono tracking-wider">Universidad</p>
        <p className="text-[9px] font-bold text-blue-400 font-mono tracking-wider">Pública</p>
      </div>
    </div>
  );
}

export function WalletPushAnimation({ recentIssuances, totalDone, totalStudents, isRunning }: Props) {
  const progress = totalStudents > 0 ? (totalDone / totalStudents) * 100 : 0;
  const prevCountRef = useRef(0);
  const [flyingCards, setFlyingCards] = useState<Array<{ key: string; delay: number }>>([]);

  useEffect(() => {
    const newCount = recentIssuances.length;
    if (newCount > prevCountRef.current) {
      const newItems = recentIssuances.slice(prevCountRef.current);
      const additions = newItems.map((t, i) => ({ key: `${t.id}-${t.timestamp}`, delay: i * 0.12 }));
      setFlyingCards(prev => [...prev, ...additions]);
      newItems.forEach((t, i) => {
        setTimeout(() => {
          setFlyingCards(prev => prev.filter(c => c.key !== `${t.id}-${t.timestamp}`));
        }, 1500 + i * 140);
      });
      prevCountRef.current = newCount;
    }
  }, [recentIssuances]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #080e18 0%, #0a1510 100%)' }}
    >
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045]">
        <defs>
          <pattern id="iss-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#94a3b8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iss-grid)" />
      </svg>

      <div className="relative p-5 space-y-4">
        {/* Three-node row */}
        <div className="flex items-center gap-2">
          <BNCRNode isRunning={isRunning} />

          {/* Flight path */}
          <div className="flex-1 relative h-14">
            {/* Dashed connector */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="flex-1 border-t border-dashed border-slate-700/70" />
              <svg width="8" height="10" viewBox="0 0 8 10" className="shrink-0 text-slate-600">
                <path d="M1 1l6 4-6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Flying Visa cards */}
            <div className="absolute inset-0 overflow-hidden">
              {flyingCards.map((fc) => (
                <motion.div
                  key={fc.key}
                  className="absolute top-1/2"
                  style={{ left: 0, translateY: '-50%' }}
                  initial={{ x: 0, opacity: 0, scale: 0.65 }}
                  animate={{ x: '100%', opacity: [0, 1, 1, 0], scale: [0.65, 1, 1, 0.75] }}
                  transition={{ duration: 1.05, delay: fc.delay, ease: [0.4, 0, 0.2, 1] }}
                >
                  <VisaCardMini />
                </motion.div>
              ))}
            </div>
          </div>

          <PortalNode totalDone={totalDone} />
        </div>

        {/* Notification feed — last 3 confirmed */}
        <div className="space-y-1.5 min-h-[60px]">
          <AnimatePresence initial={false} mode="popLayout">
            {recentIssuances.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-14"
              >
                <p className="text-[11px] text-slate-600 font-mono tracking-wider">
                  Esperando inicio de emisión…
                </p>
              </motion.div>
            ) : (
              recentIssuances.slice(-3).reverse().map((t) => (
                <motion.div
                  key={`${t.id}-${t.timestamp}`}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                  style={{ background: 'rgba(15,23,42,0.7)', borderColor: 'rgba(51,65,85,0.6)' }}
                >
                  <VisaCardMini />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-200 truncate">{t.name}</p>
                    <p className="text-[9px] text-slate-500 font-mono">•••• {t.last4} · {t.wallet}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-[10px] font-bold text-[#FCC015] font-mono">{formatCRC(t.amount)}</p>
                    <div className="flex items-center justify-end gap-1">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <p className="text-[9px] text-blue-400 font-mono">Univ. Pública</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1434CB, #4d7fff)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-slate-600 font-mono">Lote recibido</span>
            <span className="text-[10px] text-[#FCC015] font-mono font-semibold">
              {totalDone} / {totalStudents} emitidas
            </span>
            <span className="text-[9px] text-slate-600 font-mono">Portal notificado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
