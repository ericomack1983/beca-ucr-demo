'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardConfig, CardType, DeliveryType, ValidityPeriod } from '@/types/issuer-flow';
import { MCC_CATEGORIES } from '@/types/issuer-flow';
import { CardPreview3D } from '@/components/issuer/animations/CardPreview3D';
import { WalletDigitizationAnimation } from '@/components/issuer/animations/WalletDigitizationAnimation';

/* ── Icon library ── */

function IconDebitCard() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
      <path d="M16 15h2" />
    </svg>
  );
}

function IconPrepaidCard() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M12 13.5v3M10.5 15H13.5" />
    </svg>
  );
}

function IconDigital() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 17h14" />
      <rect x="8" y="6" width="8" height="7" rx="1" />
    </svg>
  );
}

function IconApple() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-label="Apple">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function IconGooglePay() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Google Pay">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}


/* ── MCC icons (stroke, 20×20) ── */

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function IconUtensils() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2" />
      <path d="M5 11v11" />
      <path d="M15 2c0 0 4 2 4 5s-4 4-4 4v9" />
    </svg>
  );
}

function IconBus() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 11h18" />
      <path d="M8 6V4" />
      <path d="M16 6V4" />
      <circle cx="7.5" cy="19" r="1" />
      <circle cx="16.5" cy="19" r="1" />
    </svg>
  );
}

function IconHealth() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 8v4M10 10h4" />
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  );
}

const MCC_ICON_MAP: Record<string, React.ReactNode> = {
  education: <IconBook />,
  food:      <IconUtensils />,
  transport: <IconBus />,
  health:    <IconHealth />,
};

function IconBank() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M12 3L3 10h18L12 3z" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
    </svg>
  );
}

const DELIVERY_OPTIONS: { id: DeliveryType; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'digital',          icon: <IconDigital />,   label: 'Solo Digital',         description: 'Tarjeta virtual inmediata' },
  { id: 'digital_apple',    icon: <IconApple />,     label: 'Apple Pay',            description: 'Añadir a Apple Wallet'     },
  { id: 'digital_google',   icon: <IconGooglePay />, label: 'Google Pay',           description: 'Añadir a Google Wallet'    },
  { id: 'digital_physical', icon: <IconBank />,      label: 'Tarjeta Física',       description: 'Tarjeta plástica (correo)' },
];

const VALIDITY_OPTIONS: { id: ValidityPeriod; label: string }[] = [
  { id: 'semestral', label: 'Semestral (6 meses)' },
  { id: 'anual', label: 'Anual (12 meses)' },
  { id: 'custom', label: 'Personalizado' },
];

function formatCRC(v: number) {
  return `₡${v.toLocaleString('es-CR')}`;
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1434CB]/30 ${
        checked ? 'bg-[#1434CB]' : 'bg-slate-200'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

interface Props {
  config: CardConfig;
  onChange: (c: CardConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3CardConfig({ config, onChange, onNext, onBack }: Props) {
  const update = (patch: Partial<CardConfig>) => onChange({ ...config, ...patch });

  const toggleMcc = (id: string) => {
    update({
      mccs: config.mccs.includes(id)
        ? config.mccs.filter(m => m !== id)
        : [...config.mccs, id],
    });
  };

  const toggleDelivery = (id: DeliveryType) => {
    const current = config.deliveryTypes;
    const next = current.includes(id)
      ? current.filter(d => d !== id)
      : [...current, id];
    if (next.length === 0) return; // require at least one
    update({ deliveryTypes: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: config form */}
        <div className="space-y-5">
          {/* Card type */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tipo de tarjeta</p>
            <div className="grid grid-cols-2 gap-3">
              {(['debit', 'prepaid'] as CardType[]).map(type => (
                <button
                  key={type}
                  onClick={() => update({ cardType: type })}
                  className={`p-4 rounded-md border-2 text-left transition-all duration-200 ${
                    config.cardType === type
                      ? 'border-[#1434CB] bg-[#1434CB]/5'
                      : 'border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.22)]'
                  }`}
                  aria-pressed={config.cardType === type}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${config.cardType === type ? 'bg-[#1434CB] text-white' : 'bg-[#f5f5f5] text-[#4a4a4a]'}`}>
                    {type === 'debit' ? <IconDebitCard /> : <IconPrepaidCard />}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{type === 'debit' ? 'Débito Visa' : 'Prepago Visa'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {type === 'debit' ? 'Asociada a cuenta bancaria' : 'Saldo precargado'}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* MCCs */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Categorías de comercio (MCC)
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {config.mccEnabled ? 'Restricción activa por categoría' : 'Sin restricción — todas las categorías permitidas'}
                </p>
              </div>
              <ToggleSwitch
                checked={config.mccEnabled}
                onChange={v => update({ mccEnabled: v })}
                label="Habilitar restricción MCC"
              />
            </div>
            <AnimatePresence initial={false}>
              {config.mccEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {MCC_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => toggleMcc(cat.id)}
                        aria-pressed={config.mccs.includes(cat.id)}
                        className={`p-3 rounded-md border-2 text-left transition-all duration-200 ${
                          config.mccs.includes(cat.id)
                            ? 'border-[#1434CB] bg-[#1434CB]/5'
                            : 'border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.22)]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-2 ${config.mccs.includes(cat.id) ? 'bg-[#1434CB] text-white' : 'bg-[#f5f5f5] text-[#4a4a4a]'}`}>
                          {MCC_ICON_MAP[cat.id] ?? <IconBook />}
                        </div>
                        <p className="font-semibold text-slate-900 text-xs">{cat.label}</p>
                        <p className="text-[10px] text-slate-400">{cat.description}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Amount & limits */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Montos y límites
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="monthly-amount">
                  Monto de desembolso mensual
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₡</span>
                  <input
                    id="monthly-amount"
                    type="number"
                    min={50000}
                    max={1000000}
                    step={1000}
                    value={config.monthlyAmount}
                    onChange={e => update({ monthlyAmount: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-md text-sm focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20 font-mono"
                    aria-label="Monto mensual en colones"
                  />
                </div>
                <p className="text-xs text-slate-400">{formatCRC(config.monthlyAmount)}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="daily-limit">
                  Límite diario de transacciones
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₡</span>
                  <input
                    id="daily-limit"
                    type="number"
                    min={10000}
                    max={500000}
                    step={1000}
                    value={config.dailyLimit}
                    onChange={e => update({ dailyLimit: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-md text-sm focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20 font-mono"
                    aria-label="Límite diario en colones"
                  />
                </div>
                <p className="text-xs text-slate-400">{formatCRC(config.dailyLimit)}</p>
              </div>
            </div>
          </section>

          {/* Delivery — multi-select */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tipo de entrega
              </p>
              <span className="text-[10px] text-[#1434CB] font-semibold">
                {config.deliveryTypes.length} seleccionado{config.deliveryTypes.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map(opt => {
                const isChecked = config.deliveryTypes.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleDelivery(opt.id)}
                    aria-pressed={isChecked}
                    className={`w-full p-3 rounded-md text-left transition-all duration-200 flex items-center gap-3 ${
                      isChecked
                        ? 'border-2 border-[#1434CB] bg-[#1434CB]/5'
                        : 'border border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.16)] hover:bg-[#f5f5f5]/60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#1434CB] text-white' : 'bg-[#f5f5f5] text-[#4a4a4a]'
                    }`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm transition-colors ${isChecked ? 'text-[#1434CB]' : 'text-[#000000]'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-[#4a4a4a]/60">{opt.description}</p>
                    </div>
                    {/* Checkbox indicator */}
                    {isChecked ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                        className="w-5 h-5 rounded-md bg-[#1434CB] flex items-center justify-center shrink-0"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-[rgba(0,0,0,0.15)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Validity & toggles */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Vigencia y notificaciones
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="validity">
                  Vigencia de la tarjeta
                </label>
                <select
                  id="validity"
                  value={config.validity}
                  onChange={e => update({ validity: e.target.value as ValidityPeriod })}
                  className="w-full px-3 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-md text-sm focus:outline-none focus:border-[#1434CB] bg-white"
                >
                  {VALIDITY_OPTIONS.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Banco Emissor</p>
                  <p className="text-xs text-slate-400">Habilitar wallet propia del banco</p>
                </div>
                <ToggleSwitch
                  checked={config.walletEnabled}
                  onChange={v => update({ walletEnabled: v })}
                  label="Habilitar wallet del emisor"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Notificaciones SMS/Push</p>
                  <p className="text-xs text-slate-400">Alertas por transacción al estudiante</p>
                </div>
                <ToggleSwitch
                  checked={config.notificationsEnabled}
                  onChange={v => update({ notificationsEnabled: v })}
                  label="Habilitar notificaciones"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right: preview panel — card 3D or wallet animation */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
              Vista previa de tarjeta
            </p>
            {(() => {
              const walletType = config.deliveryTypes.includes('digital_apple')
                ? 'digital_apple'
                : config.deliveryTypes.includes('digital_google')
                ? 'digital_google'
                : null;
              return (
                <AnimatePresence mode="wait">
                  {walletType ? (
                    <motion.div
                      key={walletType}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WalletDigitizationAnimation type={walletType} config={config} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card3d"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardPreview3D config={config} />
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-md border-2 border-[rgba(0,0,0,0.1)] text-sm font-semibold text-[#4a4a4a] hover:bg-[#f5f5f5] hover:border-[rgba(0,0,0,0.18)] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-[#1434CB] text-white rounded-md font-semibold text-sm tracking-[0.25px] hover:bg-[#173be8] active:bg-[#0f2595] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          Generar pre-aprobación
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
