"use client";

import { motion } from "framer-motion";

const PARTNERS = ["CONAPE", "FEES", "MICITT"];

function MEPLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Shield emblem */}
      <div className="relative w-9 h-10 shrink-0">
        <svg viewBox="0 0 36 40" fill="none" className="w-full h-full">
          <path
            d="M18 2 L34 8 L34 22 C34 31 26 37 18 39 C10 37 2 31 2 22 L2 8 Z"
            fill="#0B2A5B"
            stroke="#0B2A5B"
            strokeWidth="0.5"
          />
          <path
            d="M18 5 L31 10 L31 22 C31 29.5 25 34.5 18 36.5 C11 34.5 5 29.5 5 22 L5 10 Z"
            fill="#1a3f7a"
          />
          {/* Book */}
          <rect x="9" y="15" width="8" height="10" rx="0.8" fill="white" opacity="0.9" />
          <rect x="19" y="15" width="8" height="10" rx="0.8" fill="white" opacity="0.9" />
          <rect x="17" y="14" width="2" height="12" rx="1" fill="#0B2A5B" />
          {/* Star */}
          <path d="M18 8.5 L19 11 L21.5 11 L19.5 12.5 L20.5 15 L18 13.5 L15.5 15 L16.5 12.5 L14.5 11 L17 11 Z"
            fill="#F59E0B" />
        </svg>
      </div>
      {/* Text */}
      <div className="leading-tight">
        <p className="text-[11px] font-black text-[#0B2A5B] tracking-wide uppercase">MEP</p>
        <p className="text-[9px] text-slate-500 font-medium leading-tight max-w-[130px]">
          Ministerio de Educación Pública
        </p>
      </div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-white/60 border-y border-slate-200/60 py-5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider shrink-0">
            En alianza con
          </span>

          <MEPLogo />

          <div className="w-px h-6 bg-slate-200 hidden sm:block" />

          {PARTNERS.map((p) => (
            <span key={p} className="text-sm text-slate-500 font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
