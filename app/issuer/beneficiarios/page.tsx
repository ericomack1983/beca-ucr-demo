"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ContentCard, ContentCardBody, Typography, Button, Divider, VisaLogo } from "@visa/nova-react";
import {
  VisaCheckmarkLow, VisaArrowRightLow, VisaArrowLeftLow,
  VisaAttachmentLow, VisaCardManageLow, VisaDeleteLow, VisaFileUploadLow,
} from "@visa/nova-icons-react";

interface Guardian {
  id: string;
  name: string;
  sinirube: string;
  canton: string;
  region: string;
  income: number;
  members: number;
  students: number;
  score: number;
  docsOk: boolean;
}

const ALL_GUARDIANS: Guardian[] = [
  { id: "f01", name: "María Fernández Rojas",    sinirube: "BECA-001234", canton: "Desamparados",  region: "Sede Rodrigo Facio",         income: 62000,  members: 4, students: 1, score: 84, docsOk: true  },
  { id: "f02", name: "Carlos Mora Quesada",       sinirube: "BECA-002345", canton: "Liberia",       region: "Sede Chorotega",       income: 78000,  members: 3, students: 1, score: 74, docsOk: false },
  { id: "f03", name: "Ana Jiménez Solano",         sinirube: "BECA-003456", canton: "Pérez Zeledón", region: "Sede Brunca",          income: 54000,  members: 3, students: 1, score: 89, docsOk: false },
  { id: "f04", name: "Roberto Rodríguez Ugalde",  sinirube: "BECA-004567", canton: "Alajuela",      region: "Sede de Occidente",       income: 48000,  members: 5, students: 2, score: 93, docsOk: true  },
  { id: "f05", name: "Francisca Solano Quesada",  sinirube: "BECA-005678", canton: "Cartago",       region: "Sede del Atlántico",         income: 71000,  members: 4, students: 1, score: 81, docsOk: true  },
  { id: "f06", name: "Raimunda Vargas Castro",    sinirube: "BECA-006789", canton: "Nicoya",        region: "Sede Chorotega",       income: 98000,  members: 2, students: 1, score: 62, docsOk: false },
  { id: "f07", name: "Pedro Herrera Campos",      sinirube: "BECA-007890", canton: "San Carlos",    region: "Sede Norte",    income: 115000, members: 2, students: 1, score: 44, docsOk: false },
  { id: "f08", name: "Luisa Brenes Mora",         sinirube: "BECA-008901", canton: "Limón",         region: "Sede del Caribe",   income: 67000,  members: 4, students: 1, score: 82, docsOk: true  },
  { id: "f09", name: "Manuel Araya Quesada",      sinirube: "BECA-009012", canton: "Quepos",        region: "Sede del Pacífico",income: 83000,  members: 3, students: 1, score: 71, docsOk: true  },
  { id: "f10", name: "Concepción Alvarado Ríos",  sinirube: "BECA-010123", canton: "Golfito",       region: "Sede Brunca",          income: 41000,  members: 7, students: 3, score: 37, docsOk: false },
];

const REQUIREMENTS = [
  "Estudiante con evaluación socioeconómica vigente (OBAS)",
  "Matrícula consolidada en la Universidad de Costa Rica",
  "Ingreso per cápita por debajo de ₡135.000",
  "Cédula de identidad verificada (TSE / DGME)",
  "Verificación biométrica con liveness check (Visa Ready)",
];

function scoreColor(s: number) { return s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444"; }
function scoreLabel(s: number) { return s >= 80 ? "Aprobar" : s >= 60 ? "Revisar" : "Rechazar"; }
function scoreBg(s: number) {
  if (s >= 80) return { bg: "#D1FAE5", color: "#065F46" };
  if (s >= 60) return { bg: "#FEF3C7", color: "#92400E" };
  return { bg: "#FEE2E2", color: "#991B1B" };
}

function FilterSidebar({ maxIncome, setMaxIncome, maxMembers, setMaxMembers, minStudents, setMinStudents, qualifying, onApply }: {
  maxIncome: number; setMaxIncome: (v: number) => void;
  maxMembers: number; setMaxMembers: (v: number) => void;
  minStudents: number; setMinStudents: (v: number) => void;
  qualifying: number; onApply: () => void;
}) {
  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      <ContentCard>
        <ContentCardBody style={{ padding: "20px 18px" }}>
          <Typography className="v-typography-body-2-bold" style={{ marginBottom: 4 }}>Filtros de elegibilidad</Typography>
          <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 20 }}>
            Defina los criterios mínimos para preselección
          </Typography>

          <FilterBlock label="Ingreso per cápita" subLabel={`Máx: ₡${maxIncome.toLocaleString("es-CR")}`} weight={`${Math.round((135000 - maxIncome) / 135000 * 10)}/10`}>
            <div style={{ display: "flex", gap: 10 }}>
              <FilterInput label="MÍNIMO" value="0" readOnly />
              <FilterInput label="MÁXIMO" value={String(maxIncome)} onChange={(v) => setMaxIncome(Number(v))} />
            </div>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 6 }}>Rango: ₡0 — ₡135.000</Typography>
          </FilterBlock>

          <Divider style={{ margin: "14px 0" }} />

          <FilterBlock label="Miembros del hogar" subLabel={`Máx: ${maxMembers}`} weight={`${Math.min(10, maxMembers)}/10`}>
            <div style={{ display: "flex", gap: 10 }}>
              <FilterInput label="MÍNIMO" value="1" readOnly />
              <FilterInput label="MÁXIMO" value={String(maxMembers)} onChange={(v) => setMaxMembers(Number(v))} />
            </div>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 6 }}>Rango: 1 — 10</Typography>
          </FilterBlock>

          <Divider style={{ margin: "14px 0" }} />

          <FilterBlock label="Estudiantes en el hogar" subLabel={`Mín: ${minStudents}`} weight={`${minStudents}/5`}>
            <div style={{ display: "flex", gap: 10 }}>
              <FilterInput label="MÍNIMO" value={String(minStudents)} onChange={(v) => setMinStudents(Number(v))} />
              <FilterInput label="MÁXIMO" value="5" readOnly />
            </div>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 6 }}>Rango: 0 — 5 estudiantes</Typography>
          </FilterBlock>

          <Divider style={{ margin: "14px 0" }} />

          <div style={{ background: "#F0F4FF", borderRadius: 10, padding: "14px 16px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#003DA5", lineHeight: 1 }}>{qualifying}</span>
              <span style={{ fontSize: 16, color: "#64748B" }}>/ {ALL_GUARDIANS.length}</span>
            </div>
            <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 4 }}>califican con estos filtros</Typography>
          </div>

          <Button className="v-action-primary" style={{ width: "100%" }} onClick={onApply}>Aplicar filtros</Button>
        </ContentCardBody>
      </ContentCard>
    </div>
  );
}

function FilterBlock({ label, subLabel, weight, children }: { label: string; subLabel: string; weight: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Typography className="v-typography-body-2-bold">{label}</Typography>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#003DA5" }}>{weight}</span>
      </div>
      {children}
    </div>
  );
}

function FilterInput({ label, value, readOnly, onChange }: { label: string; value: string; readOnly?: boolean; onChange?: (v: string) => void }) {
  return (
    <div style={{ flex: 1 }}>
      <Typography className="v-typography-label v-typography-color-subtle" style={{ marginBottom: 4, fontSize: 10, letterSpacing: "0.05em" }}>{label}</Typography>
      <input value={value} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)}
        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#1E293B", background: readOnly ? "#F8FAFC" : "#fff", boxSizing: "border-box" }} />
    </div>
  );
}

const ANIM_STYLE = `
@keyframes req-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.28); }
  70%  { transform: scale(0.88); }
  100% { transform: scale(1); }
}
.req-pop { animation: req-pop 0.28s cubic-bezier(.36,.07,.19,.97); }
@keyframes bbeam {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

function GuardianEligibilityCard({ guardian, onDelete }: { guardian: Guardian; onDelete: () => void }) {
  const initialChecked = new Set(guardian.docsOk ? REQUIREMENTS.map((_, i) => i) : REQUIREMENTS.slice(0, Math.floor(REQUIREMENTS.length * 0.6)).map((_, i) => i));
  const [checked, setChecked]         = useState<Set<number>>(initialChecked);
  const [animating, setAnimating]     = useState<number | null>(null);
  const [dragging, setDragging]       = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verified = checked.size;
  const pct      = Math.round((verified / REQUIREMENTS.length) * 100);
  const complete = verified === REQUIREMENTS.length;

  // Rotating beam border — color tracks completion state (green when complete, Visa blue while in progress)
  const beamStops = complete
    ? "rgba(16,185,129,.85) 83%, rgba(5,150,105,.75) 86%, rgba(255,255,255,.5) 88%"
    : "rgba(0,61,165,.85) 83%, rgba(20,52,203,.75) 86%, rgba(255,255,255,.5) 88%";
  const beamGradient = `conic-gradient(from 0deg, transparent 0%, transparent 78%, ${beamStops}, transparent 93%)`;

  function toggle(i: number) {
    setAnimating(i);
    setChecked((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setUploadedFiles((prev) => [...prev, ...Array.from(files).map((f) => f.name)]);
  }

  return (
    <>
      <style>{ANIM_STYLE}</style>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -1.5, borderRadius: 13, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: "200%", height: "200%",
            background: beamGradient,
            animation: "bbeam 4s linear infinite",
          }} />
        </div>
        <ContentCard style={{ position: "relative", zIndex: 1, border: "1.5px solid #E2E8F0" }}>
        <ContentCardBody style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={`https://i.pravatar.cc/40?u=${guardian.id}`} alt={guardian.name}
                style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #E2E8F0", flexShrink: 0 }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Typography className="v-typography-body-2-bold" style={{ fontSize: 15 }}>{guardian.name}</Typography>
                  {complete && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#065F46", background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 999, padding: "2px 8px" }}>
                      <VisaCheckmarkLow style={{ width: 11, height: 11 }} /> Completo
                    </span>
                  )}
                </div>
                <Typography className="v-typography-label v-typography-color-subtle">{guardian.canton} · {guardian.region}</Typography>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#1E293B" }}>{verified}</span>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>/{REQUIREMENTS.length}</span>
              <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 1 }}>verificados</Typography>
            </div>
          </div>

          <div style={{ height: 5, borderRadius: 999, background: "#E2E8F0", overflow: "hidden", margin: "12px 0 20px" }}>
            <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: complete ? "#10B981" : "#F59E0B", transition: "width .35s ease" }} />
          </div>

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <Typography className="v-typography-overline" style={{ marginBottom: 12 }}>Lista de Requisitos</Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {REQUIREMENTS.map((req, i) => {
                  const ok = checked.has(i);
                  return (
                    <div key={req} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <div className={animating === i ? "req-pop" : ""} onAnimationEnd={() => setAnimating(null)}
                        style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: ok ? "#EEF2FF" : "#F8FAFC", border: `2px solid ${ok ? "#1434CB" : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s ease" }}>
                        {ok && <svg viewBox="0 0 12 10" width="11" height="9" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#1434CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <Typography className="v-typography-body-2" style={{ flex: 1, textDecoration: ok ? "line-through" : "none", color: ok ? "#94A3B8" : "#1E293B", transition: "color .18s ease", userSelect: "none" }}>
                        {req}
                      </Typography>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999, background: ok ? "#D1FAE5" : "#FEF3C7", color: ok ? "#065F46" : "#92400E", transition: "all .18s ease", flexShrink: 0 }}>
                        {ok ? "Verificado" : "Pendiente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ width: 260, flexShrink: 0 }}>
              <Typography className="v-typography-overline" style={{ marginBottom: 12 }}>Adjuntar Documentos</Typography>
              <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                style={{ border: `2px dashed ${dragging ? "#003DA5" : "#CBD5E1"}`, borderRadius: 10, padding: "24px 16px", background: dragging ? "#EEF2FF" : "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "all .12s ease" }}>
                <VisaAttachmentLow style={{ color: dragging ? "#003DA5" : "#94A3B8", width: 24, height: 24, transition: "color .12s" }} />
                <Typography className="v-typography-label v-typography-color-subtle" style={{ textAlign: "center", fontSize: 12 }}>
                  Arrastre archivos aquí o haga clic
                </Typography>
              </div>
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {uploadedFiles.map((name, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 7, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                      <VisaCheckmarkLow style={{ color: "#10B981", width: 12, height: 12, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#065F46", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                    </div>
                  ))}
                </div>
              )}
              <Typography className="v-typography-label v-typography-color-subtle" style={{ textAlign: "center", fontSize: 11, marginTop: 8 }}>
                Al soltar, el documento se marca como &quot;Cargado&quot;
              </Typography>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end" }}>
            <Button className="v-action-secondary" onClick={onDelete}>
              <VisaDeleteLow /> Eliminar
            </Button>
          </div>
        </ContentCardBody>
        </ContentCard>
      </div>
    </>
  );
}

function EligibilityView({ guardians, onBack }: { guardians: Guardian[]; onBack: () => void }) {
  const router   = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const active   = guardians.filter((g) => !deletedIds.has(g.id));

  if (!guardians.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <Typography tag="h1" className="v-typography-headline-1">Verificación de Elegibilidad</Typography>
        <Typography className="v-typography-subtitle-2">
          {active.length} hogar{active.length !== 1 ? "es" : ""} seleccionado{active.length !== 1 ? "s" : ""}
        </Typography>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {active.map((g) => (
          <motion.div key={g.id} layout
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ x: "110%", opacity: 0, scaleY: 0.85, transition: { duration: 0.38, ease: [0.4, 0, 0.6, 1] } }}
            transition={{ duration: 0.3, ease: "easeOut" }} style={{ overflow: "hidden" }}>
            <GuardianEligibilityCard guardian={g} onDelete={() => setDeletedIds((prev) => new Set([...prev, g.id]))} />
          </motion.div>
        ))}
      </AnimatePresence>

      {active.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
          <Typography className="v-typography-body-2">Ningún hogar disponible. Vuelva y seleccione otros hogares.</Typography>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
        <Button className="v-action-secondary" onClick={onBack}><VisaArrowLeftLow /> Volver</Button>
        <Button className="v-action-primary" disabled={active.length === 0}
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("emissao_families", JSON.stringify(
                active.map((g) => ({ id: g.id, name: g.name, canton: g.canton, last4: g.sinirube.slice(-4) }))
              ));
            }
            router.push(`/issuer/emissao?families=${active.length}`);
          }}>
          <VisaCardManageLow /> Emitir Tarjetas
        </Button>
      </div>
    </div>
  );
}

// ── Upload + validation flow ──────────────────────────────────────────────────

const VALIDATION_STAGES = [
  { title: "Verificación de duplicados", sub: "Cruce de cédula y alias con Visa Alias Directory" },
  { title: "Criterios de Elegibilidad", sub: "Sistema de Becas · ingreso per cápita · carga académica" },
  { title: "Reglas de Política",         sub: "Validación de reglas del programa Beca Socioeconómica" },
];

const UPLOAD_TOTAL = 3450;
const STAGE_MS = 1200;

const LIGHTBOX_CSS = `
@keyframes lb-scan { 0% { top: -8%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 108%; opacity: 0; } }
@keyframes lb-glow { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.08); } }
@keyframes lb-grid { from { background-position: 0 0; } to { background-position: 0 28px; } }
@keyframes lb-ring-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(20,52,203,0); } 50% { box-shadow: 0 0 22px 2px rgba(20,52,203,0.45); } }
`;

function UploadPrompt({ onUpload }: { onUpload: () => void }) {
  const [drag, setDrag] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <ContentCard>
        <ContentCardBody>
          <div
            onClick={onUpload}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onUpload(); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 14, padding: "56px 24px", borderRadius: 14, cursor: "pointer",
              border: `2px dashed ${drag ? "#003DA5" : "#CBD5E1"}`,
              background: drag ? "#EEF2FF" : "#F8FAFC", transition: "all .15s ease", textAlign: "center",
            }}
          >
            <motion.div
              animate={{ y: drag ? -4 : 0 }}
              style={{ width: 60, height: 60, borderRadius: 16, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#003DA5" }}
            >
              <VisaFileUploadLow style={{ width: 28, height: 28 }} />
            </motion.div>
            <div>
              <Typography className="v-typography-body-1" style={{ fontWeight: 700, color: "#1E293B" }}>
                Cargar padrón de hogares
              </Typography>
              <Typography className="v-typography-label v-typography-color-subtle" style={{ marginTop: 4 }}>
                Arrastre o seleccione un archivo CSV / XLSX para validar e importar los hogares
              </Typography>
            </div>
            <Button onClick={(e) => { e.stopPropagation(); onUpload(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><VisaFileUploadLow /> Subir archivo</span>
            </Button>
          </div>
        </ContentCardBody>
      </ContentCard>
    </motion.div>
  );
}

function ValidationLightbox({ total, fileName, onComplete }: { total: number; fileName: string; onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= VALIDATION_STAGES.length; i++) timers.push(setTimeout(() => setStage(i), STAGE_MS * i));
    timers.push(setTimeout(onComplete, STAGE_MS * VALIDATION_STAGES.length + 800));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const duration = STAGE_MS * VALIDATION_STAGES.length;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * total)); // ease-out
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  const done = stage >= VALIDATION_STAGES.length;
  const pct = Math.round((count / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(6,11,25,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <style>{LIGHTBOX_CSS}</style>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{
          position: "relative", width: 480, maxWidth: "92vw", borderRadius: 24, padding: 0, overflow: "hidden",
          background: "linear-gradient(165deg, #0B132B 0%, #0E1A3F 55%, #0A1330 100%)",
          border: "1px solid rgba(120,150,255,0.18)",
          boxShadow: "0 40px 100px rgba(4,9,25,0.6), 0 0 0 1px rgba(20,52,203,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Decorative grid + glow */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5, backgroundImage: "linear-gradient(rgba(120,150,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", animation: "lb-grid 6s linear infinite", maskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)" }} />
        <div aria-hidden style={{ position: "absolute", top: -90, left: "50%", transform: "translateX(-50%)", width: 320, height: 220, pointerEvents: "none", background: "radial-gradient(closest-side, rgba(20,52,203,0.55), transparent)", filter: "blur(8px)", animation: "lb-glow 3.4s ease-in-out infinite" }} />
        {/* Scan line */}
        {!done && (
          <div aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 2, pointerEvents: "none", background: "linear-gradient(90deg, transparent, rgba(86,128,255,0.9), transparent)", boxShadow: "0 0 12px 1px rgba(86,128,255,0.7)", animation: "lb-scan 2.6s ease-in-out infinite" }} />
        )}

        <div style={{ position: "relative", padding: 32 }}>
          {/* Header: Visa logo + secure tag */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
            <VisaLogo style={{ height: 16, width: "auto", color: "#fff" }} aria-label="Visa" />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9FB4FF", background: "rgba(86,128,255,0.1)", border: "1px solid rgba(120,150,255,0.22)", borderRadius: 999, padding: "4px 10px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: done ? "#34D399" : "#5680FF", boxShadow: done ? "0 0 8px #34D399" : "0 0 8px #5680FF" }} />
              {done ? "Verificado" : "Procesando"}
            </span>
          </div>

          {/* Scanner */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 26 }}>
            <div style={{ position: "relative", width: 124, height: 124, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", animation: done ? "none" : "lb-ring-pulse 2.4s ease-in-out infinite" }}>
              {!done && (
                <motion.div
                  animate={{ rotate: 360 }} transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(86,128,255,0.25) 300deg, #5680FF 360deg)", padding: 4, WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))", mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))" }}
                />
              )}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `5px solid ${done ? "rgba(52,211,153,0.25)" : "rgba(120,150,255,0.14)"}` }} />
              <motion.div
                key={done ? "done" : "scan"}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", color: done ? "#34D399" : "#5680FF" }}
              >
                {done
                  ? <VisaCheckmarkLow style={{ width: 44, height: 44, filter: "drop-shadow(0 0 10px rgba(52,211,153,0.6))" }} />
                  : <><span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{count.toLocaleString("es-CR")}</span>
                      <span style={{ fontSize: 10, color: "#7E8DB8", marginTop: 3, letterSpacing: "0.04em" }}>de {total.toLocaleString("es-CR")}</span></>}
              </motion.div>
            </div>
            <Typography tag="h3" style={{ marginTop: 12, fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
              {done ? "Validación completada" : "Validando hogares…"}
            </Typography>
            <Typography style={{ fontSize: 13, color: "#8A99C2" }}>
              {done ? `${total.toLocaleString("es-CR")} hogares procesados` : fileName}
            </Typography>
          </div>

          {/* Progress bar */}
          <div style={{ position: "relative", height: 6, borderRadius: 999, background: "rgba(120,150,255,0.12)", overflow: "hidden", marginBottom: 26 }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ ease: "linear" }} style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #1434CB, #5680FF 60%, #8FA8FF)", boxShadow: "0 0 12px rgba(86,128,255,0.7)" }} />
          </div>

          {/* Stages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VALIDATION_STAGES.map((s, i) => {
              const stState = stage > i ? "done" : stage === i ? "active" : "pending";
              return (
                <div key={s.title} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 10px", borderRadius: 12, opacity: stState === "pending" ? 0.45 : 1, background: stState === "active" ? "rgba(86,128,255,0.08)" : "transparent", border: `1px solid ${stState === "active" ? "rgba(120,150,255,0.22)" : "transparent"}`, transition: "all .3s ease" }}>
                  <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: stState === "done" ? "rgba(52,211,153,0.18)" : stState === "active" ? "rgba(86,128,255,0.15)" : "rgba(120,150,255,0.08)", border: `1px solid ${stState === "done" ? "rgba(52,211,153,0.5)" : stState === "active" ? "rgba(86,128,255,0.5)" : "rgba(120,150,255,0.15)"}`, color: stState === "done" ? "#34D399" : "#5680FF" }}>
                    {stState === "done" && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} style={{ display: "inline-flex" }}>
                        <VisaCheckmarkLow style={{ width: 16, height: 16 }} />
                      </motion.span>
                    )}
                    {stState === "active" && (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                        style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(86,128,255,0.3)", borderTopColor: "#5680FF" }} />
                    )}
                    {stState === "pending" && <span style={{ fontSize: 12, fontWeight: 700, color: "#5C6B96" }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography style={{ fontSize: 13.5, fontWeight: 700, color: stState === "active" ? "#BFD0FF" : "#E6ECFF" }}>{s.title}</Typography>
                    <Typography style={{ fontSize: 12, color: "#7E8DB8" }}>{s.sub}</Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BeneficiariosPage() {
  const [maxIncome, setMaxIncome]       = useState(135000);
  const [maxMembers, setMaxMembers]     = useState(10);
  const [minStudents, setMinStudents]   = useState(0);
  const [applied, setApplied]           = useState({ maxIncome: 135000, maxMembers: 10, minStudents: 0 });
  const [selected, setSelected]         = useState<string[]>([]);
  const [view, setView]                 = useState<"list" | "eligibility">("list");
  const [fileLoaded, setFileLoaded]     = useState(false);
  const [validating, setValidating]     = useState(false);
  const [fileName, setFileName]         = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setValidating(true);
    e.target.value = ""; // allow re-selecting the same file
  };

  const filtered = useMemo(() => ALL_GUARDIANS.filter((g) =>
    g.income <= applied.maxIncome && g.members <= applied.maxMembers && g.students >= applied.minStudents
  ), [applied]);

  const qualifying = useMemo(() => ALL_GUARDIANS.filter((g) =>
    g.income <= maxIncome && g.members <= maxMembers && g.students >= minStudents
  ).length, [maxIncome, maxMembers, minStudents]);

  const selectedGuardians = ALL_GUARDIANS.filter((g) => selected.includes(g.id));
  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll    = () => setSelected(selected.length === filtered.length ? [] : filtered.map((g) => g.id));

  if (view === "eligibility") return <EligibilityView guardians={selectedGuardians} onBack={() => setView("list")} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={onFileChange} style={{ display: "none" }} />

      <AnimatePresence>
        {validating && (
          <ValidationLightbox
            total={UPLOAD_TOTAL}
            fileName={fileName}
            onComplete={() => { setValidating(false); setFileLoaded(true); }}
          />
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#003DA5", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>1</div>
          <div>
            <Typography tag="h1" className="v-typography-headline-1">Filtrado de Becarios</Typography>
            <Typography className="v-typography-subtitle-2">Preselección de becarios · Beca Socioeconómica UCR</Typography>
          </div>
        </div>
        {fileLoaded && (
          <Button colorScheme="secondary" onClick={openPicker} style={{ flexShrink: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><VisaFileUploadLow /> Cargar otro padrón</span>
          </Button>
        )}
      </div>

      {!fileLoaded ? (
        <UploadPrompt onUpload={openPicker} />
      ) : (
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <FilterSidebar maxIncome={maxIncome} setMaxIncome={setMaxIncome} maxMembers={maxMembers} setMaxMembers={setMaxMembers} minStudents={minStudents} setMinStudents={setMinStudents} qualifying={qualifying} onApply={() => setApplied({ maxIncome, maxMembers, minStudents })} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll}
                  style={{ width: 16, height: 16, accentColor: "#003DA5", cursor: "pointer" }} />
                <Typography className="v-typography-label">Seleccionar todos</Typography>
              </label>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 999, padding: "2px 10px" }}>
                {filtered.length} hogar{filtered.length !== 1 ? "es" : ""} disponible{filtered.length !== 1 ? "s" : ""}
              </span>
              {selected.length > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: "#003DA5", background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 999, padding: "2px 10px" }}>
                  {selected.length} seleccionado{selected.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {[{ label: "≥80", color: "#10B981" }, { label: "60–79", color: "#F59E0B" }, { label: "<60", color: "#EF4444" }].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  <Typography className="v-typography-label v-typography-color-subtle">{label}</Typography>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.map((g) => {
              const sel    = selected.includes(g.id);
              const col    = scoreColor(g.score);
              const action = scoreBg(g.score);
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10, background: sel ? "#F0F4FF" : "#fff", border: `1px solid ${sel ? "#C7D2FE" : "#E2E8F0"}`, transition: "all .1s ease" }}>
                  <input type="checkbox" checked={sel} onChange={() => toggleSelect(g.id)} style={{ width: 16, height: 16, accentColor: "#003DA5", cursor: "pointer", flexShrink: 0 }} />
                  <img src={`https://i.pravatar.cc/40?u=${g.id}`} alt={g.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #E2E8F0" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography className="v-typography-body-2-bold" style={{ color: sel ? "#003DA5" : "#1E293B" }}>{g.name}</Typography>
                    <Typography className="v-typography-label v-typography-color-subtle">{g.canton} · {g.region}</Typography>
                  </div>
                  <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                    {[
                      { key: "INGRESO", val: `₡${(g.income/1000).toFixed(0)}K` },
                      { key: "MIEMB.", val: String(g.members) },
                      { key: "ESTUD.", val: String(g.students) },
                    ].map(({ key, val }) => (
                      <div key={key} style={{ textAlign: "center", minWidth: 44 }}>
                        <Typography className="v-typography-label v-typography-color-subtle" style={{ fontSize: 9, letterSpacing: "0.05em" }}>{key}</Typography>
                        <Typography className="v-typography-body-2-bold">{val}</Typography>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: 64, flexShrink: 0 }}>
                    <div style={{ textAlign: "right", marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: col, lineHeight: 1 }}>{g.score}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${g.score}%`, borderRadius: 999, background: col }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, flexShrink: 0, background: action.bg, color: action.color }}>
                    {scoreLabel(g.score)}
                  </span>
                </div>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
              <Button className="v-action-primary" onClick={() => setView("eligibility")}>
                Continuar con {selected.length} hogar{selected.length !== 1 ? "es" : ""} <VisaArrowRightLow />
              </Button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
