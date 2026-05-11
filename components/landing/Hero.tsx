"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, CheckCircle2, BookOpen, Users, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAF7F2]">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="mesh-1 absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #0B2A5B 0%, transparent 70%)" }} />
        <div className="mesh-2 absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        <div className="mesh-3 absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />
        <div className="mesh-1 absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        {/* SVG Noise */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        {/* UCR campus silhouette watermark */}
        <CampusSilhouette />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 bg-[#0B2A5B]/8 border border-[#0B2A5B]/12 rounded-full px-4 py-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
              <span className="text-xs font-medium text-[#0B2A5B]">
                Convocatoria abierta · Ciclo 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-5xl lg:text-7xl font-bold text-[#0B2A5B] tracking-tight"
            >
              Tu futuro<br />
              empieza con una{" "}
              <span className="font-serif-editorial italic font-normal text-[#2563EB]">
                Beca UCR
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg text-slate-500 max-w-lg leading-relaxed"
            >
              Democratizamos el acceso a la educación superior en Costa Rica —
              conectando el talento con las oportunidades que merece, sin importar
              el punto de partida.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/login">
                <Button size="lg" className="rounded-full px-8 text-base shadow-[0_8px_24px_rgba(11,42,91,0.25)]">
                  Comenzar Solicitud
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#requisitos">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base border-[#0B2A5B]/20 text-[#0B2A5B] hover:bg-[#0B2A5B]/5">
                  Ver Requisitos
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {["MF", "CR", "AV", "JL"].map((initials) => (
                  <div key={initials} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2A5B] to-[#2563EB] border-2 border-[#FAF7F2] flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{initials}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">+12,000</span> estudiantes beneficiados este año
              </p>
            </motion.div>
          </div>

          {/* Right — Floating UI mockup */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="hidden lg:flex justify-center items-center"
          >
            <div
              className="relative"
              style={{
                transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <ApplicationCard />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Requisitos section ── */}
      <div id="requisitos" className="relative z-10 w-full border-t border-[#0B2A5B]/8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-[#0B2A5B]/6 border border-[#0B2A5B]/10 rounded-full px-4 py-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#0B2A5B]" />
              <span className="text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider">Requisitos</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0B2A5B] tracking-tight">
              ¿Qué necesito para aplicar?
            </h2>
            <p className="text-slate-500 max-w-xl">
              Cumplir los requisitos básicos es el primer paso. El sistema evalúa tu perfil automáticamente.
            </p>
          </motion.div>

          {/* Requirement cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <BookOpen className="w-5 h-5" />,
                color: "#0B2A5B",
                light: "#EEF2FF",
                title: "Matrícula activa",
                items: [
                  "Estar matriculado en UCR",
                  "Mínimo 12 créditos",
                  "No tener beca vigente del mismo tipo",
                ],
              },
              {
                icon: <GraduationCap className="w-5 h-5" />,
                color: "#2563EB",
                light: "#EFF6FF",
                title: "Rendimiento académico",
                items: [
                  "Promedio ≥ 7.0 (general)",
                  "Promedio ≥ 8.5 (Beca Honor)",
                  "Sin materias reprobadas",
                ],
              },
              {
                icon: <Users className="w-5 h-5" />,
                color: "#10B981",
                light: "#ECFDF5",
                title: "Situación socioeconómica",
                items: [
                  "Ingreso per cápita ≤ ₡300 000",
                  "Núcleo familiar documentado",
                  "Evaluación por motor de riesgo",
                ],
              },
              {
                icon: <FileText className="w-5 h-5" />,
                color: "#F59E0B",
                light: "#FFFBEB",
                title: "Documentación",
                items: [
                  "Cédula de identidad",
                  "Certificación de notas",
                  "Comprobante de ingresos",
                ],
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.light, color: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: card.color }} />
                      <span className="text-xs text-slate-600 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#0B2A5B]/4 border border-[#0B2A5B]/10 rounded-2xl px-6 py-4"
          >
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-sm font-semibold text-[#0B2A5B]">Convocatoria abierta</span>
            </div>
            <p className="text-sm text-slate-500">
              El sistema verifica automáticamente tu elegibilidad. Aplica antes del <strong className="text-slate-700">31 de mayo de 2026</strong>.
            </p>
            <a href="/login" className="sm:ml-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline">
                Iniciar solicitud <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ApplicationCard() {
  const steps = [
    { label: "Definir Objetivo", done: true },
    { label: "Documentos", done: true },
    { label: "Ventana de Postulación", done: true },
    { label: "Evaluación Socioeconómica", active: true },
    { label: "Seguimiento", done: false },
  ];

  return (
    <div className="w-[380px] rounded-3xl bg-white border border-slate-200/80 shadow-[0_40px_80px_rgba(0,0,0,0.12)] p-6 space-y-5">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Beca de Honor</p>
          <h3 className="text-sm font-semibold text-[#0B2A5B] mt-0.5">Ingeniería en Sistemas</h3>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing percent={75} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.done
                ? "bg-[#10B981]"
                : step.active
                ? "bg-[#2563EB] relative"
                : "bg-slate-100 border border-slate-200"
            }`}>
              {step.done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {step.active && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className={`text-sm ${
              step.done ? "text-slate-500 line-through" : step.active ? "font-semibold text-[#0B2A5B]" : "text-slate-400"
            }`}>{step.label}</span>
            {step.active && (
              <span className="ml-auto text-xs text-[#2563EB] font-medium bg-[#2563EB]/8 px-2 py-0.5 rounded-full">
                En progreso
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Issuer badge */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">I</span>
        </div>
        <div>
          <p className="text-xs font-medium text-amber-800">Evaluación de Riesgo</p>
          <p className="text-xs text-amber-600">Procesado por Issuer</p>
        </div>
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#E2E8F0" strokeWidth="3" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="#2563EB" strokeWidth="3"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="28" textAnchor="middle" className="text-xs font-semibold" fill="#0B2A5B" fontSize="10" fontWeight="600">
        {percent}%
      </text>
    </svg>
  );
}

function CampusSilhouette() {
  return (
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl opacity-[0.04]"
      viewBox="0 0 800 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified UCR Rodrigo Facio campus silhouette */}
      <rect x="60" y="120" width="80" height="80" fill="#0B2A5B" />
      <rect x="80" y="100" width="40" height="20" fill="#0B2A5B" />
      <rect x="90" y="80" width="20" height="20" fill="#0B2A5B" />
      <rect x="160" y="140" width="100" height="60" fill="#0B2A5B" />
      <rect x="180" y="110" width="60" height="30" fill="#0B2A5B" />
      <rect x="195" y="90" width="30" height="20" fill="#0B2A5B" />
      <rect x="205" y="70" width="10" height="20" fill="#0B2A5B" />
      <rect x="280" y="150" width="60" height="50" fill="#0B2A5B" />
      <rect x="290" y="120" width="40" height="30" fill="#0B2A5B" />
      <rect x="360" y="130" width="80" height="70" fill="#0B2A5B" />
      <rect x="375" y="100" width="50" height="30" fill="#0B2A5B" />
      <rect x="390" y="85" width="20" height="15" fill="#0B2A5B" />
      <rect x="460" y="145" width="70" height="55" fill="#0B2A5B" />
      <rect x="470" y="120" width="50" height="25" fill="#0B2A5B" />
      <rect x="550" y="135" width="90" height="65" fill="#0B2A5B" />
      <rect x="565" y="110" width="60" height="25" fill="#0B2A5B" />
      <rect x="575" y="90" width="40" height="20" fill="#0B2A5B" />
      <rect x="660" y="150" width="80" height="50" fill="#0B2A5B" />
      <rect x="675" y="120" width="50" height="30" fill="#0B2A5B" />
      <rect x="690" y="100" width="20" height="20" fill="#0B2A5B" />
      {/* Ground line */}
      <rect x="0" y="198" width="800" height="2" fill="#0B2A5B" />
      {/* Trees */}
      <ellipse cx="150" cy="135" rx="12" ry="18" fill="#0B2A5B" />
      <rect x="147" y="140" width="6" height="20" fill="#0B2A5B" />
      <ellipse cx="350" cy="128" rx="10" ry="15" fill="#0B2A5B" />
      <rect x="347" y="135" width="6" height="15" fill="#0B2A5B" />
      <ellipse cx="540" cy="132" rx="11" ry="16" fill="#0B2A5B" />
      <rect x="537" y="138" width="6" height="18" fill="#0B2A5B" />
      <ellipse cx="745" cy="138" rx="10" ry="14" fill="#0B2A5B" />
      <rect x="742" y="143" width="6" height="15" fill="#0B2A5B" />
    </svg>
  );
}
