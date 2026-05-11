"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  label: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { value: 12000, prefix: "+", suffix: "", label: "Estudiantes apoyados" },
  { value: 8.4, prefix: "₡", suffix: "MM", label: "En becas otorgadas en 2025", decimals: 1 },
  { value: 94, suffix: "%", label: "Tasa de aprobación" },
  { value: 5, label: "Días promedio de respuesta", unit: "días" },
];

function useCountUp(target: number, decimals = 0, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, decimals, active]);
  return count;
}

function StatCard({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(stat.value, stat.decimals ?? 0, inView);

  const formatted = stat.decimals
    ? count.toFixed(stat.decimals)
    : Math.round(count).toLocaleString("es-CR");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-2"
    >
      <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
        {stat.prefix}{formatted}{stat.suffix}
        {stat.unit && <span className="text-2xl text-white/60 ml-1 font-normal">{stat.unit}</span>}
      </div>
      <p className="text-sm text-white/60 font-medium">{stat.label}</p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-24 bg-[#0B2A5B] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 text-sm">
            Datos correspondientes al período 2025 · Fuente: Oficina de Becas UCR
          </p>
        </motion.div>
      </div>
    </section>
  );
}
