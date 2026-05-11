"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UCR_FACULTIES } from "@/lib/config";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    carne: "",
    faculty: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.faculty) {
      setError("Por favor complete todos los campos requeridos.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // In a real app we'd create the account. For demo, redirect to login.
    router.push("/login?registered=1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B2A5B] mb-8 transition-colors">
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">Crear cuenta UCR</h1>
            <p className="text-sm text-slate-500 mt-1">Complete sus datos para iniciar su solicitud de beca</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nombre completo *</label>
                <Input
                  placeholder="María Fernández Solano"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Correo institucional *</label>
                <Input
                  type="email"
                  placeholder="nombre@ucr.ac.cr"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Carné UCR</label>
                <Input
                  placeholder="B12345"
                  value={form.carne}
                  onChange={(e) => handleChange("carne", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Facultad *</label>
                <select
                  value={form.faculty}
                  onChange={(e) => handleChange("faculty", e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                >
                  <option value="">Seleccionar...</option>
                  {UCR_FACULTIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Contraseña *</label>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirmar contraseña *</label>
                <Input
                  type="password"
                  placeholder="Repetir contraseña"
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                />
              </div>
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

            <p className="text-xs text-slate-400">
              Al crear su cuenta acepta los{" "}
              <a href="#" className="text-[#2563EB] hover:underline">términos de uso</a>{" "}
              y la{" "}
              <a href="#" className="text-[#2563EB] hover:underline">política de privacidad</a>.
            </p>

            <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                <>Crear cuenta <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            ¿Ya tiene cuenta?{" "}
            <Link href="/login" className="text-[#2563EB] hover:underline font-medium">Ingresar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
