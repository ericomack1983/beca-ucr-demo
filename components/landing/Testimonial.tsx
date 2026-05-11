"use client";

import { motion } from "framer-motion";

export default function Testimonial() {
  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_60px_rgb(0,0,0,0.06)] p-10 lg:p-14"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Quote mark */}
            <svg className="w-12 h-12 text-[#2563EB]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote className="text-2xl lg:text-3xl font-serif-editorial italic text-[#0B2A5B] leading-relaxed max-w-2xl">
              "La beca UCR no solo me ayudó económicamente — me demostró que
              la universidad creía en mí. Hoy soy ingeniera de software y
              cada línea de código que escribo lleva el sello de esa confianza."
            </blockquote>

            {/* Student info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B2A5B] to-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-base font-semibold text-white">VR</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 text-sm">Valeria Rodríguez Mora</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Ingeniería en Computación · Sede Rodrigo Facio · Generación 2019
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
