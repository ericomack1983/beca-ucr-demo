"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ADMIN_PORTAL_URL } from "@/lib/config";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CRFlag } from "@/components/ui/cr-flag";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-[0_1px_20px_rgb(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <CRFlag width={42} />
            <div>
              <span className="font-semibold text-[#0B2A5B] text-sm tracking-tight">Costa Rica Becas</span>
              <p className="text-[10px] text-slate-500 leading-none -mt-0.5">Portal de Becas</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Becas", href: "#como-funciona" },
              { label: "Requisitos", href: "#requisitos" },
              { label: "Contacto", href: "#contacto" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-slate-600 hover:text-[#0B2A5B] hover:bg-[#0B2A5B]/5 rounded-full transition-all duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href={ADMIN_PORTAL_URL}
              className="relative flex items-center gap-2 text-sm font-semibold text-slate-600 px-4 py-2 rounded-xl overflow-hidden group"
              whileHover="hover"
              initial="rest"
            >
              {/* animated background */}
              <motion.span
                className="absolute inset-0 rounded-xl"
                variants={{
                  rest: { opacity: 0, scale: 0.95 },
                  hover: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.2 }}
                style={{ background: 'linear-gradient(135deg,#0B2A5B08,#2563EB12)' }}
              />
              {/* border glow */}
              <motion.span
                className="absolute inset-0 rounded-xl border"
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
                style={{ borderColor: '#2563EB30' }}
              />
              {/* icon */}
              <motion.span
                className="relative z-10"
                variants={{ rest: { x: 0 }, hover: { x: -1 } }}
                transition={{ duration: 0.2 }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2563EB]">
                  <rect x="2" y="2" width="5" height="5" rx="1" />
                  <rect x="9" y="2" width="5" height="5" rx="1" />
                  <rect x="2" y="9" width="5" height="5" rx="1" />
                  <rect x="9" y="9" width="5" height="5" rx="1" />
                </svg>
              </motion.span>
              <motion.span
                className="relative z-10 transition-colors group-hover:text-[#0B2A5B]"
                variants={{ rest: { x: 0 }, hover: { x: 1 } }}
                transition={{ duration: 0.2 }}
              >
                Portal Administrativo
              </motion.span>
              {/* arrow that slides in */}
              <motion.span
                className="relative z-10 text-[#2563EB]"
                variants={{ rest: { x: -4, opacity: 0 }, hover: { x: 0, opacity: 1 } }}
                transition={{ duration: 0.2 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6h8M7 3l3 3-3 3" />
                </svg>
              </motion.span>
            </motion.a>
            <Link href="/login">
              <Button size="sm" className="rounded-full px-5">
                Iniciar Solicitud
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-[#0B2A5B]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-200/60 px-6 py-4 space-y-1"
        >
          {["Becas", "Requisitos", "Contacto"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="block py-2 text-sm text-slate-600 hover:text-[#0B2A5B]"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full rounded-full">
                Iniciar Solicitud
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function _unused() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2L4 5.5V11.5C4 15.2 7.2 18.8 11 20C14.8 18.8 18 15.2 18 11.5V5.5L11 2Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M11 5L7 7.2V10.8C7 13.1 8.8 15.3 11 16C13.2 15.3 15 13.1 15 10.8V7.2L11 5Z"
        fill="#0B2A5B"
      />
      <path d="M9 9.5H13M11 8V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
