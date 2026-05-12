'use client';

import { motion } from 'framer-motion';

interface Props {
  totalIssued: number;
  totalAmount: number;
}

function formatCRC(n: number) {
  return `₡${n.toLocaleString('es-CR')}`;
}

function AnimatedCounter({ target, label, color }: { target: number; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-center"
    >
      <motion.p
        className={`text-5xl font-black ${color}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {target}
      </motion.p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </motion.div>
  );
}

const CONFETTI_COLORS = ['#1434CB', '#FCC015', '#10B981', '#3B82F6', '#FCC015', '#EF4444', '#8B5CF6'];

function Particle({ i }: { i: number }) {
  const angle = (i / 24) * Math.PI * 2;
  const radius = 80 + Math.random() * 60;
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color, top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        opacity: 0,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
      }}
      transition={{ duration: 1.2, delay: Math.random() * 0.3, ease: 'easeOut' }}
    />
  );
}

export function SuccessBurst({ totalIssued, totalAmount }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className="relative bg-gradient-to-br from-[#1434CB]/10 to-[#EEF1FB] rounded-3xl border border-[#1434CB]/20 p-8 text-center overflow-hidden"
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <Particle key={i} i={i} />
        ))}
      </div>

      {/* Checkmark */}
      <motion.div
        className="relative mx-auto w-20 h-20 rounded-full bg-[#1434CB] flex items-center justify-center shadow-xl shadow-[#1434CB]/20 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      >
        <motion.svg
          width="40" height="40" viewBox="0 0 40 40" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.path
            d="M8 20L16 28L32 12"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          />
        </motion.svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-black text-[#1434CB] mb-1"
      >
        ¡Lote emitido exitosamente!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-slate-500 mb-8"
      >
        Todas las tarjetas han sido enviadas a los wallets digitales de los estudiantes
      </motion.p>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <AnimatedCounter
          target={totalIssued}
          label="Tarjetas emitidas"
          color="text-[#1434CB]"
        />
        <div className="text-center">
          <motion.p
            className="text-3xl font-black text-[#FCC015]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            {formatCRC(totalAmount)}
          </motion.p>
          <p className="text-sm text-slate-500 mt-1">Total desembolsado</p>
        </div>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 40%, #1434CB 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
