"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { issuerLogin } from "@/lib/issuer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function IssuerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor complete todos los campos.");
      return;
    }
    setLoading(true);
    const session = await issuerLogin(email, password);
    if (!session) {
      setError("Credenciales incorrectas. Verifique su correo y contraseña.");
      setLoading(false);
      return;
    }
    router.push("/issuer");
  };

  const fillDemo = () => {
    setEmail("admin@banconal.fi.cr");
    setPassword("issuer123");
    setError("");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0a0e2e 0%, #1434CB 60%, #1a3de8 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FCC015 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FCC015 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
            <IssuerIcon />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">Portal Adm Universidad</span>
            <p className="text-[10px] text-white/50 leading-none -mt-0.5">Banco Nacional de Costa Rica</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#FCC015]/60" />
            <span className="text-xs text-[#FCC015]/80 uppercase tracking-widest font-semibold">
              Motor de Riesgo v2.1
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug">
            Evaluación inteligente<br />
            <span className="text-[#FCC015]">de solicitudes</span><br />
            de becas
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Plataforma de análisis socioeconómico para la revisión y aprobación de financiamiento estudiantil.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {[
              "Puntuación automática por factores",
              "Recomendación del motor de riesgo",
              "Auditoría completa de decisiones",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FCC015] shrink-0" />
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex gap-4 text-xs text-white/30">
          <span>© 2026 BNCR</span>
          <span>·</span>
          <span>Portal Adm Universidad Demo</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#1434CB] flex items-center justify-center">
              <IssuerIcon />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Portal Adm Universidad</span>
              <p className="text-[10px] text-slate-500 -mt-0.5">Banco Nacional de Costa Rica</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#1434CB]" />
              <span className="text-xs font-semibold text-[#1434CB] uppercase tracking-wider">
                Acceso restringido
              </span>
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tight">
              Ingreso al portal emisor
            </h1>
            <p className="text-sm text-slate-500">
              Solo para oficiales autorizados del Banco Nacional
            </p>
          </div>

          {/* Demo credential */}
          <div className="bg-[#FCC015]/10 border border-[#FCC015]/30 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-black uppercase tracking-wider">
              Credencial demo
            </p>
            <button
              onClick={fillDemo}
              className="text-xs px-3 py-1.5 bg-white border border-[#1434CB]/20 text-[#1434CB] rounded-full hover:bg-[#1434CB]/5 transition-colors font-medium"
            >
              Admin BN · admin@banconal.fi.cr
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Correo institucional
              </label>
              <Input
                type="email"
                placeholder="usuario@banconal.fi.cr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl h-12 text-base bg-[#1434CB] hover:bg-[#1232b8]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <>
                  Ingresar al portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            ¿Eres estudiante?{" "}
            <a href="/login" className="text-[#2563EB] hover:underline font-medium">
              Portal Costa Rica Becas
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function IssuerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="5" height="5" rx="1" fill="white" />
      <rect x="12" y="3" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="3" y="12" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="12" y="12" width="5" height="5" rx="1" fill="white" />
      <rect x="9" y="3" width="2" height="14" rx="1" fill="white" opacity="0.3" />
      <rect x="3" y="9" width="14" height="2" rx="1" fill="white" opacity="0.3" />
    </svg>
  );
}
