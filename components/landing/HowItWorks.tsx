"use client";

import { motion } from "framer-motion";
import { Target, FileText, Calendar, BarChart3, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Define tu objetivo",
    description: "Selecciona el nivel de estudio, programa y tipo de financiamiento que mejor se adapta a tus metas académicas.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Carga tus documentos",
    description: "Sube de forma segura tu cédula, certificación de notas, comprobante de ingresos y carta de presentación personal.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Postula en el momento correcto",
    description: "Revisa el calendario de convocatorias y asegúrate de aplicar dentro de la ventana de tu programa.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Evaluación socioeconómica",
    description: "El motor de riesgo de Issuer analiza tu perfil de forma objetiva y transparente en 3–5 días hábiles.",
  },
  {
    number: "05",
    icon: Bell,
    title: "Seguimiento en tiempo real",
    description: "Rastrea el estado de tu solicitud paso a paso y recibe notificaciones directas de UCR e Issuer.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#0B2A5B]/8 border border-[#0B2A5B]/12 rounded-full px-4 py-1.5">
            <span className="text-xs font-medium text-[#0B2A5B]">Proceso simplificado</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0B2A5B] tracking-tight">
            Cómo funciona
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Cinco pasos claros, diseñados para que puedas completar tu solicitud
            en menos de 30 minutos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative bg-white rounded-2xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group ${
                  i === steps.length - 1 && steps.length % 3 !== 0
                    ? "md:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                {/* Faded step number */}
                <span className="absolute -top-2 -right-2 text-8xl font-black text-slate-100 leading-none select-none group-hover:text-slate-200/60 transition-colors">
                  {step.number}
                </span>

                <div className="relative space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2A5B]/8 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0B2A5B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B2A5B] text-base mb-1.5">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
