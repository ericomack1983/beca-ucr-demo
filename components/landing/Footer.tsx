"use client";

import Link from "next/link";
import { ADMIN_PORTAL_URL } from "@/lib/config";
import { CRFlag } from "@/components/ui/cr-flag";

export default function Footer() {
  return (
    <footer className="bg-[#0B2A5B]/[0.03] border-t border-slate-200/60 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <CRFlag width={42} />
              <div>
                <span className="font-semibold text-[#0B2A5B] text-sm tracking-tight">Costa Rica Becas</span>
                <p className="text-[10px] text-slate-500 leading-none -mt-0.5">Portal de Becas</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Democratizando el acceso a la educación superior en Costa Rica
              desde 1940.
            </p>
            <p className="text-xs text-slate-400">
              Ciudad Universitaria Rodrigo Facio<br />
              San Pedro de Montes de Oca, San José
            </p>
          </div>

          {/* Programa */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Programa</h4>
            <ul className="space-y-2">
              {["Tipos de beca", "Requisitos", "Calendario", "Convocatorias"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-[#0B2A5B] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Recursos</h4>
            <ul className="space-y-2">
              {["Preguntas frecuentes", "Guía de documentos", "Reglamento de becas", "Formularios"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-[#0B2A5B] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={ADMIN_PORTAL_URL}
                  className="text-sm text-slate-500 hover:text-[#0B2A5B] transition-colors"
                >
                  Portal Administrativo UCR
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {["Política de privacidad", "Términos de uso", "Accesibilidad", "Mapa del sitio"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-[#0B2A5B] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2026 Universidad de Costa Rica — Oficina de Becas. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Evaluación de riesgo procesada por</span>
            <span className="font-medium text-amber-600">Issuer Risk Services</span>
          </div>
        </div>
      </div>

      {/* UCR shield watermark */}
      <div className="absolute pointer-events-none opacity-[0.02] right-0 bottom-0 overflow-hidden">
        <svg width="300" height="300" viewBox="0 0 100 100" fill="none">
          <path d="M50 5L10 22V50C10 72 28 90 50 96C72 90 90 72 90 50V22L50 5Z" fill="#0B2A5B" />
        </svg>
      </div>
    </footer>
  );
}

