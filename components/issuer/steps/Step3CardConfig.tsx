'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardConfig, CardType, DeliveryType, ValidityPeriod } from '@/types/issuer-flow';
import { MCC_CATEGORIES } from '@/types/issuer-flow';
import { CardPreview3D } from '@/components/issuer/animations/CardPreview3D';

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-label="Apple">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-label="Google Pay">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const DELIVERY_OPTIONS: { id: DeliveryType; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'digital', icon: '💳', label: 'Solo Digital', description: 'Tarjeta virtual inmediata' },
  { id: 'digital_apple', icon: <AppleLogo />, label: 'Digital + Apple Pay', description: 'Virtual + Apple Wallet' },
  { id: 'digital_google', icon: <WalletIcon />, label: 'Digital + Google Pay', description: 'Virtual + Google Wallet' },
  { id: 'digital_physical', icon: '🏦', label: 'Digital + Plástico', description: 'Virtual + tarjeta física' },
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
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    config.cardType === type
                      ? 'border-[#1434CB] bg-[#1434CB]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-pressed={config.cardType === type}
                >
                  <p className="text-2xl mb-2">{type === 'debit' ? '💳' : '🎴'}</p>
                  <p className="font-bold text-slate-900 text-sm">{type === 'debit' ? 'Débito Visa' : 'Prepago Visa'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {type === 'debit' ? 'Asociada a cuenta bancaria' : 'Saldo precargado'}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* MCCs */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Categorías de comercio permitidas (MCC)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MCC_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleMcc(cat.id)}
                  aria-pressed={config.mccs.includes(cat.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    config.mccs.includes(cat.id)
                      ? 'border-[#1434CB] bg-[#1434CB]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xl mb-1">{cat.icon}</p>
                  <p className="font-semibold text-slate-900 text-xs">{cat.label}</p>
                  <p className="text-[10px] text-slate-400">{cat.description}</p>
                </button>
              ))}
            </div>
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
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20 font-mono"
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
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1434CB] focus:ring-1 focus:ring-[#1434CB]/20 font-mono"
                    aria-label="Límite diario en colones"
                  />
                </div>
                <p className="text-xs text-slate-400">{formatCRC(config.dailyLimit)}</p>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Tipo de entrega
            </p>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => update({ deliveryType: opt.id })}
                  aria-pressed={config.deliveryType === opt.id}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${
                    config.deliveryType === opt.id
                      ? 'border-[#1434CB] bg-[#1434CB]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl shrink-0 flex items-center justify-center w-8 h-8">{opt.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-400">{opt.description}</p>
                  </div>
                  {config.deliveryType === opt.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-5 h-5 rounded-full bg-[#1434CB] flex items-center justify-center shrink-0"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  )}
                </button>
              ))}
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
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1434CB] bg-white"
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

        {/* Right: 3D card preview */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
              Vista previa de tarjeta
            </p>
            <CardPreview3D config={config} />
            <p className="text-[10px] text-slate-400 text-center mt-4">
              Mueva el cursor sobre la tarjeta para ver el efecto 3D
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={config.mccs.length === 0}
          className="px-6 py-2.5 bg-[#1434CB] text-white rounded-xl font-semibold text-sm hover:bg-[#1232b8] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
