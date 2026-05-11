"use client";

import { motion } from "framer-motion";

const partners = [
  "MEP — Ministerio de Educación Pública",
  "CONAPE",
  "FEES",
  "MICITT",
  "BNCR",
];

export default function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-white/60 border-y border-slate-200/60 py-5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            En alianza con
          </span>
          {partners.map((partner) => (
            <span key={partner} className="text-sm text-slate-500 font-medium">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
