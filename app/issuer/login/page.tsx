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
    await new Promise((r) => setTimeout(r, 600));
    const session = issuerLogin(email, password);
    if (!session) {
      setError("Credenciales incorrectas. Use admin@banconal.fi.cr / issuer123");
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
        style={{ background: "linear-gradient(160deg, #1a0a00 0%, #2d1500 50%, #92400e 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/50">
            <IssuerIcon />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">Portal Emisor</span>
            <p className="text-[10px] text-amber-400/70 leading-none -mt-0.5">Banco Nacional de Costa Rica</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-amber-500/50" />
            <span className="text-xs text-amber-400/60 uppercase tracking-widest font-semibold">
              Motor de Riesgo v2.1
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug">
            Evaluación inteligente<br />
            <span className="text-amber-400">de solicitudes</span><br />
            de becas
          </h2>
          <p className="text-amber-100/40 text-sm leading-relaxed max-w-xs">
            Plataforma de análisis socioeconómico para la revisión y aprobación de financiamiento estudiantil.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {[
              "Puntuación automática por factores",
              "Recomendación del motor de riesgo",
              "Auditoría completa de decisiones",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-amber-100/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex gap-4 text-xs text-amber-100/30">
          <span>© 2026 BNCR</span>
          <span>·</span>
          <span>Portal Emisor Demo</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 bg-[#FAF7F2]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <IssuerIcon />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Portal Emisor</span>
              <p className="text-[10px] text-slate-500 -mt-0.5">Banco Nacional de Costa Rica</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Acceso restringido
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ingreso al portal emisor
            </h1>
            <p className="text-sm text-slate-500">
              Solo para oficiales autorizados del Banco Nacional
            </p>
          </div>

          {/* Demo credential */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Credencial demo
            </p>
            <button
              onClick={fillDemo}
              className="text-xs px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full hover:bg-amber-50 transition-colors font-medium"
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
              className="w-full rounded-xl h-12 text-base bg-amber-600 hover:bg-amber-700"
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
