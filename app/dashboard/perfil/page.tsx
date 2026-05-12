"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Save, X } from "lucide-react";
import { getSession } from "@/lib/auth";
import { MOCK_STUDENTS, type Student } from "@/lib/mock-students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UCR_FACULTIES } from "@/lib/config";

export default function PerfilPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Student>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (!session) return;
      const stu = MOCK_STUDENTS.find(s => s.email === session.email) ?? MOCK_STUDENTS[0];
      setStudent(stu);
      setForm({ name: stu.name, phone: stu.phone, faculty: stu.faculty });
    });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!student) return null;

  const initials = student.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2A5B] tracking-tight">Mi Perfil</h1>
          <p className="text-sm text-slate-500 mt-1">Datos personales y académicos</p>
        </div>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="rounded-full">
            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="rounded-full">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Guardar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="rounded-full">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm"
        >
          Perfil actualizado correctamente.
        </motion.div>
      )}

      {/* Avatar */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B2A5B] to-[#2563EB] flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#0B2A5B]">{student.name}</h2>
            <p className="text-slate-500 text-sm">{student.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 bg-[#0B2A5B]/8 text-[#0B2A5B] rounded-full font-medium">
                {student.carne}
              </span>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                Año {student.year}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal data */}
      <Card className="p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">
          Datos personales
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Nombre completo</label>
            {editing ? (
              <Input
                value={form.name || ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-slate-800 py-2">{student.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Cédula de identidad</label>
            <p className="text-sm text-slate-400 py-2">{student.cedula} <span className="text-xs">(solo lectura)</span></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Carné UCR</label>
            <p className="text-sm text-slate-400 py-2">{student.carne} <span className="text-xs">(solo lectura)</span></p>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Teléfono</label>
            {editing ? (
              <Input
                value={form.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+506 0000-0000"
              />
            ) : (
              <p className="text-sm text-slate-800 py-2">{student.phone}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Academic data */}
      <Card className="p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100">
          Datos académicos
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Facultad</label>
            {editing ? (
              <select
                value={form.faculty || ""}
                onChange={(e) => setForm((f) => ({ ...f, faculty: e.target.value }))}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {UCR_FACULTIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-slate-800 py-2">{student.faculty}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Año de ingreso</label>
            <p className="text-sm text-slate-400 py-2">{2026 - student.year + 1}º año <span className="text-xs">(calculado)</span></p>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Correo institucional</label>
            <p className="text-sm text-slate-400 py-2">{student.email} <span className="text-xs">(solo lectura)</span></p>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Seguridad</h3>
        <Button variant="outline" size="sm" className="rounded-full">
          Cambiar contraseña
        </Button>
      </Card>
    </div>
  );
}
