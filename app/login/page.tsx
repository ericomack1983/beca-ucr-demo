"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CRFlag } from "@/components/ui/cr-flag";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
    const session = login(email, password);
    if (!session) {
      setError("Correo o contraseña incorrectos. Intente con maria@ucr.ac.cr / demo123");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  const fillDemo = (email: string) => {
    setEmail(email);
    setPassword("demo123");
    setError("");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0B2A5B 0%, #1a3f7a 60%, #2563EB 100%)" }}
      >
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <CRFlag width={44} />
          <div>
            <span className="font-semibold text-white text-sm">Costa Rica Becas</span>
            <p className="text-[10px] text-white/50 leading-none -mt-0.5">Portal de Becas</p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative space-y-6">
          <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl font-serif-editorial italic text-white/90 leading-relaxed">
            "La educación es el arma más poderosa que puedes usar para cambiar el mundo."
          </blockquote>
          <p className="text-white/50 text-sm">— Oficina de Becas, Universidad de Costa Rica</p>
        </div>

        {/* Bottom links */}
        <div className="relative flex gap-4 text-xs text-white/40">
          <span>© 2026 UCR</span>
          <span>·</span>
          <a href="#" className="hover:text-white/60 transition-colors">Privacidad</a>
          <span>·</span>
          <a href="#" className="hover:text-white/60 transition-colors">Ayuda</a>
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
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <CRFlag width={42} />
            <span className="font-semibold text-[#0B2A5B] text-sm">Costa Rica Becas</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-slate-500">
              Ingresa con tu cuenta institucional UCR
            </p>
          </div>

          {/* Demo quick-fill */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Cuentas demo</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "María (en proceso)", email: "maria@ucr.ac.cr" },
                { label: "Carlos (aprobado)", email: "carlos@ucr.ac.cr" },
                { label: "Ana (nueva)", email: "ana@ucr.ac.cr" },
              ].map((d) => (
                <button
                  key={d.email}
                  onClick={() => fillDemo(d.email)}
                  className="text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 transition-colors font-medium"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Correo institucional
              </label>
              <Input
                type="email"
                placeholder="nombre@ucr.ac.cr"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0B2A5B]"
                />
                <span className="text-sm text-slate-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-[#2563EB] hover:underline">
                Olvidé mi contraseña
              </a>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl h-12 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            ¿Primera vez?{" "}
            <Link href="/registro" className="text-[#2563EB] hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

