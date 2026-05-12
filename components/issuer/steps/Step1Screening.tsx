'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowStudent, FilterState } from '@/types/issuer-flow';

function ScoreBadge({ category }: { category: 'APPROVE' | 'REVIEW' | 'DENY' }) {
  const styles = {
    APPROVE: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    REVIEW: 'bg-amber-100 text-amber-700 border-amber-300',
    DENY: 'bg-red-100 text-red-700 border-red-300',
  };
  const labels = { APPROVE: 'Aprobar', REVIEW: 'Revisar', DENY: 'Denegar' };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[category]}`}>
      {labels[category]}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

interface FilterRangeProps {
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  format: (v: number) => string;
  onChange: (min: number, max: number) => void;
  count: number;
  total: number;
}

function FilterRange({ label, icon, min, max, step, valueMin, valueMax, format, onChange, count, total }: FilterRangeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <span className="text-xs font-bold text-[#1434CB]">{count}/{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Mínimo</p>
          <input
            type="number"
            min={min}
            max={valueMax}
            step={step}
            value={valueMin}
            onChange={(e) => onChange(parseFloat(e.target.value) || min, valueMax)}
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20"
            aria-label={`${label} mínimo`}
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Máximo</p>
          <input
            type="number"
            min={valueMin}
            max={max}
            step={step}
            value={valueMax}
            onChange={(e) => onChange(valueMin, parseFloat(e.target.value) || max)}
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20"
            aria-label={`${label} máximo`}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        Rango: {format(valueMin)} — {format(valueMax)}
      </p>
    </div>
  );
}

interface Props {
  students: FlowStudent[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onNext: () => void;
}

export function Step1Screening({ students, filters, onFiltersChange, onSelectionChange, onSelectAll, onNext }: Props) {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const passesFilter = (s: FlowStudent) =>
    s.gpa >= tempFilters.gpaMin && s.gpa <= tempFilters.gpaMax &&
    s.dependents >= tempFilters.dependentsMin && s.dependents <= tempFilters.dependentsMax &&
    s.credits >= tempFilters.creditsMin && s.credits <= tempFilters.creditsMax;

  const qualifying = useMemo(() => students.filter(passesFilter), [students, tempFilters]);
  const selected = students.filter(s => s.selected);
  const allSelected = students.length > 0 && students.every(s => s.selected);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    students.forEach(s => onSelectionChange(s.id, passesFilter(s)));
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Filter panel */}
        <aside className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-sm self-start">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Filtros de elegibilidad</h3>
            <p className="text-xs text-slate-400 mt-0.5">Defina los criterios mínimos para preselección</p>
          </div>

          <FilterRange
            label="Promedio académico"
            icon="🎓"
            min={0} max={10} step={0.1}
            valueMin={tempFilters.gpaMin}
            valueMax={tempFilters.gpaMax}
            format={(v) => v.toFixed(1)}
            onChange={(min, max) => setTempFilters(f => ({ ...f, gpaMin: min, gpaMax: max }))}
            count={students.filter(s => s.gpa >= tempFilters.gpaMin && s.gpa <= tempFilters.gpaMax).length}
            total={students.length}
          />

          <div className="border-t border-slate-100" />

          <FilterRange
            label="Personas dependientes"
            icon="👨‍👩‍👧"
            min={0} max={10} step={1}
            valueMin={tempFilters.dependentsMin}
            valueMax={tempFilters.dependentsMax}
            format={(v) => `${v}`}
            onChange={(min, max) => setTempFilters(f => ({ ...f, dependentsMin: min, dependentsMax: max }))}
            count={students.filter(s => s.dependents >= tempFilters.dependentsMin && s.dependents <= tempFilters.dependentsMax).length}
            total={students.length}
          />

          <div className="border-t border-slate-100" />

          <FilterRange
            label="Créditos matriculados"
            icon="📚"
            min={0} max={24} step={1}
            valueMin={tempFilters.creditsMin}
            valueMax={tempFilters.creditsMax}
            format={(v) => `${v} cr`}
            onChange={(min, max) => setTempFilters(f => ({ ...f, creditsMin: min, creditsMax: max }))}
            count={students.filter(s => s.credits >= tempFilters.creditsMin && s.credits <= tempFilters.creditsMax).length}
            total={students.length}
          />

          <motion.div
            className="bg-[#1434CB]/5 border border-[#1434CB]/20 rounded-xl px-4 py-3 text-center"
            key={qualifying.length}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-3xl font-black text-[#1434CB]">{qualifying.length}</span>
            <span className="text-lg text-slate-400"> / {students.length}</span>
            <p className="text-xs text-slate-500 mt-0.5">califican con estos filtros</p>
          </motion.div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#1434CB] text-white rounded-xl font-semibold text-sm hover:bg-[#1232b8] active:scale-95 transition-all"
          >
            Aplicar filtros
          </button>
        </aside>

        {/* Student list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={e => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1434CB]"
                  aria-label="Seleccionar todos"
                />
                <span className="text-sm text-slate-600">Seleccionar todos</span>
              </label>
              <motion.span
                key={selected.length}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-sm font-bold text-[#1434CB]"
              >
                {selected.length} seleccionados
              </motion.span>
            </div>
            <div className="text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> ≥80
              </span>
              {' '}&nbsp;
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 60-79
              </span>
              {' '}&nbsp;
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" /> &lt;60
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {students.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: s.selected ? 1 : 0.4, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, layout: { duration: 0.4 } }}
                  className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow"
                >
                  <input
                    type="checkbox"
                    checked={s.selected}
                    onChange={e => onSelectionChange(s.id, e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1434CB] shrink-0"
                    aria-label={`Seleccionar ${s.name}`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                      <span className="text-xs text-slate-400 font-mono">{s.carne}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{s.program} · {s.faculty}</p>
                  </div>

                  <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Prom.</p>
                      <p className="font-bold text-slate-800">{s.gpa.toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Dep.</p>
                      <p className="font-bold text-slate-800">{s.dependents}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase">Cr.</p>
                      <p className="font-bold text-slate-800">{s.credits}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-xl font-black text-slate-900">{s.score}</p>
                    <ScoreBar score={s.score} />
                    <ScoreBadge category={s.scoreCategory} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onNext}
              disabled={selected.length === 0}
              className="px-6 py-3 bg-[#1434CB] text-white rounded-xl font-semibold text-sm hover:bg-[#1232b8] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continuar con {selected.length} estudiante{selected.length !== 1 ? 's' : ''}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
