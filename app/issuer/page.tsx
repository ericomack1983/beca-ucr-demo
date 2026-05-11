"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  LogOut,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  MOCK_ISSUER_APPLICANTS,
  type IssuerApplicant,
  type IssuerDecision,
} from "@/lib/mock-issuer";
import { getIssuerSession, issuerLogout } from "@/lib/issuer-auth";

interface IssuedCard {
  paymentId: string;
  last4: string;
  expiryShort: string;
  cardHolder: string;
  status: string;
}

type CardState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "issued"; card: IssuedCard }
  | { phase: "error"; message: string };

export default function IssuerPortalPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("iss_001");
  const [applicants, setApplicants] = useState<IssuerApplicant[]>(
    MOCK_ISSUER_APPLICANTS
  );
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  useEffect(() => {
    const session = getIssuerSession();
    if (!session) {
      router.replace("/issuer/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleDecision = (id: string, decision: IssuerDecision) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, issuerDecision: decision } : a))
    );
    // Reset card state if decision changes away from approved
    if (decision !== "approved") {
      setCardStates((prev) => ({ ...prev, [id]: { phase: "idle" } }));
    }
  };

  const handleIssueCard = async (applicant: IssuerApplicant) => {
    setCardStates((prev) => ({ ...prev, [applicant.id]: { phase: "loading" } }));
    try {
      const res = await fetch("/api/beca-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: applicant.id,
          carne: applicant.carne,
          program: applicant.program,
          amount: 500_000,
        }),
      });
      const data = await res.json() as {
        ok: boolean;
        payment?: {
          paymentId: string;
          status: string;
          virtualCard?: { accountNumber: string; expiryDate: string };
        };
        error?: string;
      };
      if (!data.ok || !data.payment) {
        throw new Error(data.error ?? "Error al emitir tarjeta");
      }
      const { paymentId, status, virtualCard } = data.payment;
      const raw = virtualCard?.accountNumber ?? "";
      const last4 = raw.slice(-4);
      // SDK returns "MM/YYYY" — display as "MM/YY"
      const rawExpiry = virtualCard?.expiryDate ?? "";
      const expiryShort = rawExpiry.includes("/")
        ? `${rawExpiry.split("/")[0]}/${rawExpiry.split("/")[1].slice(-2)}`
        : rawExpiry;
      setCardStates((prev) => ({
        ...prev,
        [applicant.id]: {
          phase: "issued",
          card: { paymentId, last4, expiryShort, cardHolder: applicant.name.toUpperCase(), status },
        },
      }));
    } catch (err) {
      setCardStates((prev) => ({
        ...prev,
        [applicant.id]: {
          phase: "error",
          message: err instanceof Error ? err.message : "Error desconocido",
        },
      }));
    }
  };

  const handleLogout = () => {
    issuerLogout();
    router.push("/issuer/login");
  };

  const total = applicants.length;
  const recommended = applicants.filter((a) => a.motorDecision === "APPROVE").length;
  const inReview = applicants.filter((a) => a.motorDecision === "REVIEW").length;

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Portal header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <IssuerGridIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Portal Emisor</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Banco Nacional de Costa Rica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-600 font-medium">Motor activo</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-slate-500" />}
            label="Solicitudes"
            value={total}
            bg="bg-slate-50"
            border="border-slate-200"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            label="Recomendadas"
            value={recommended}
            bg="bg-emerald-50"
            border="border-emerald-200"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            label="En revisión"
            value={inReview}
            bg="bg-amber-50"
            border="border-amber-200"
          />
        </div>

        {/* Applicant list */}
        <div className="space-y-3">
          {applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              expanded={expandedId === applicant.id}
              cardState={cardStates[applicant.id] ?? { phase: "idle" }}
              onToggle={() =>
                setExpandedId((prev) =>
                  prev === applicant.id ? null : applicant.id
                )
              }
              onDecision={(d) => handleDecision(applicant.id, d)}
              onIssueCard={() => handleIssueCard(applicant)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center">
        <p className="text-xs text-slate-400">
          Motor de Riesgo v2.1 — Banco Nacional de Costa Rica · Portal Emisor Demo
        </p>
      </footer>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({
  icon, label, value, bg, border,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
  border: string;
}) {
  return (
    <div className={`rounded-2xl border ${bg} ${border} px-5 py-4 flex items-center gap-3`}>
      {icon}
      <div>
        <p className="text-xs text-slate-500 leading-none">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">{value}</p>
      </div>
    </div>
  );
}

/* ── Applicant card ── */
function ApplicantCard({
  applicant,
  expanded,
  cardState,
  onToggle,
  onDecision,
  onIssueCard,
}: {
  applicant: IssuerApplicant;
  expanded: boolean;
  cardState: CardState;
  onToggle: () => void;
  onDecision: (d: IssuerDecision) => void;
  onIssueCard: () => void;
}) {
  const { decision: motorDecisionLabel } = tierMeta(applicant.riskTier, applicant.motorDecision);
  const scoreBarColor =
    applicant.riskTier === "LOW"
      ? "bg-emerald-500"
      : applicant.riskTier === "MEDIUM"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-rose-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-slate-900">{applicant.name}</span>
            <span className="text-sm text-slate-400 font-mono">{applicant.carne}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {applicant.program} · {applicant.statusLabel}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right min-w-[80px]">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Puntaje</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{applicant.score}</span>
              <span className={`text-xs font-bold ${motorDecisionLabel.color}`}>
                {motorDecisionLabel.text}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBarColor} transition-all duration-500`}
                style={{ width: `${applicant.score}%` }}
              />
            </div>
          </div>

          <TierBadge tier={applicant.riskTier} />

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 py-5 grid md:grid-cols-2 gap-8">
              {/* Left: factors */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Factores de evaluación
                </p>
                <div className="space-y-3">
                  {applicant.factors.map((f) => (
                    <div key={f.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{f.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-800">{f.value}</span>
                        <span className="text-xs font-bold text-emerald-600">+{f.points}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Puntaje total</span>
                    <span className="text-sm font-bold text-slate-900">
                      {applicant.score} / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: motor recommendation + actions + card issuance */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Recomendación del motor
                  </p>
                  <div className="flex items-center gap-2">
                    {applicant.motorDecision === "APPROVE" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <span
                      className={`font-bold text-base ${
                        applicant.motorDecision === "APPROVE"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {applicant.motorRecommendation}
                    </span>
                  </div>
                </div>

                {/* Decision buttons */}
                <div className="flex gap-2 flex-wrap">
                  <ActionButton
                    label="Aprobar"
                    variant="approve"
                    active={applicant.issuerDecision === "approved"}
                    onClick={() => onDecision("approved")}
                  />
                  <ActionButton
                    label="Revisar"
                    variant="review"
                    active={applicant.issuerDecision === "review"}
                    onClick={() => onDecision("review")}
                  />
                  <ActionButton
                    label="Denegar"
                    variant="deny"
                    active={applicant.issuerDecision === "denied"}
                    onClick={() => onDecision("denied")}
                  />
                </div>

                {applicant.issuerDecision !== "pending" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-400"
                  >
                    Decisión registrada:{" "}
                    <span className="font-semibold text-slate-600">
                      {applicant.issuerDecision === "approved"
                        ? "Aprobada"
                        : applicant.issuerDecision === "review"
                        ? "En revisión"
                        : "Denegada"}
                    </span>
                  </motion.p>
                )}

                {/* ── B2B Virtual Account: card issuance ── */}
                {applicant.issuerDecision === "approved" && (
                  <CardIssuancePanel
                    cardState={cardState}
                    onIssue={onIssueCard}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Card issuance panel ── */
function CardIssuancePanel({
  cardState,
  onIssue,
}: {
  cardState: CardState;
  onIssue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
          Emisión de Tarjeta Beca
        </p>
      </div>

      {cardState.phase === "idle" && (
        <div className="space-y-2">
          <p className="text-xs text-blue-700">
            Habilitar tarjeta virtual Visa para la beca aprobada (₡500,000 CRC).
          </p>
          <button
            onClick={onIssue}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Emitir tarjeta virtual
          </button>
        </div>
      )}

      {cardState.phase === "loading" && (
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Loader2 className="w-4 h-4 animate-spin" />
          Emitiendo tarjeta virtual Visa…
        </div>
      )}

      {cardState.phase === "issued" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            <CheckCircle2 className="w-4 h-4" />
            Tarjeta virtual emitida
          </div>

          <VisaCard card={cardState.card} />

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            Estado:{" "}
            <span className="font-semibold text-slate-700 capitalize">
              {cardState.card.status}
            </span>
          </div>
        </motion.div>
      )}

      {cardState.phase === "error" && (
        <div className="space-y-2">
          <p className="text-xs text-red-600">{cardState.message}</p>
          <button
            onClick={onIssue}
            className="text-xs px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ── Visa virtual card — matches reference image ── */
function VisaCard({ card }: { card: IssuedCard }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none"
      style={{
        background: "linear-gradient(135deg, #1a2fd4 0%, #2346e8 55%, #2b5af5 100%)",
        aspectRatio: "1.586 / 1",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55%", aspectRatio: "1/1",
          background: "rgba(255,255,255,0.07)",
          top: "10%", right: "-5%",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "45%", aspectRatio: "1/1",
          background: "rgba(255,255,255,0.05)",
          top: "30%", right: "15%",
        }}
      />

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top row: VCN chip + Visa logo */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* VCN label */}
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4 8h8M8 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">VCN</span>
            </div>
            {/* Chip + NFC */}
            <div className="flex items-center gap-2">
              <ChipSVG />
              <NfcSVG />
            </div>
          </div>

          {/* Visa wordmark */}
          <VisaWordmark />
        </div>

        {/* Card number */}
        <div className="flex items-center gap-3 mt-1">
          {[0, 1, 2].map((g) => (
            <div key={g} className="flex items-center gap-1">
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
          ))}
          <span className="font-mono text-white font-semibold text-base tracking-widest ml-1">
            {card.last4}
          </span>
        </div>

        {/* Bottom row: cardholder + expiry */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-white/50 uppercase tracking-widest font-semibold">
              Card Holder
            </p>
            <p className="text-xs font-bold text-white tracking-wide mt-0.5 truncate max-w-[140px]">
              {card.cardHolder}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/50 uppercase tracking-widest font-semibold">
              Expires
            </p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">
              {card.expiryShort}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipSVG() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="#F59E0B" stroke="#D97706" />
      <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" fill="url(#chip-shine)" />
      {/* Grid lines */}
      <line x1="11" y1="0.5" x2="11" y2="23.5" stroke="#D97706" strokeWidth="0.75" />
      <line x1="21" y1="0.5" x2="21" y2="23.5" stroke="#D97706" strokeWidth="0.75" />
      <line x1="0.5" y1="8"  x2="31.5" y2="8"  stroke="#D97706" strokeWidth="0.75" />
      <line x1="0.5" y1="16" x2="31.5" y2="16" stroke="#D97706" strokeWidth="0.75" />
      {/* Center contact */}
      <rect x="12" y="7" width="8" height="10" rx="1.5" fill="#E8AB30" stroke="#D97706" strokeWidth="0.5" />
      <defs>
        <linearGradient id="chip-shine" x1="0" y1="0" x2="32" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NfcSVG() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M4 10 C4 7.2 6 5 8 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M2 10 C2 5.8 5 2.5 8 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.35" />
      <path d="M6 10 C6 8.7 7 7.8 8 7.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

function VisaWordmark() {
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V */}
      <path d="M0 1H4.5L8 12L11.5 1H16L10 17H6L0 1Z" fill="white" />
      {/* I */}
      <path d="M17 1H21V17H17V1Z" fill="white" />
      {/* S */}
      <path d="M23 12.5C23 12.5 25 14.5 27.5 14.5C29 14.5 30 13.8 30 12.8C30 11.5 28.5 11 27 10.3C25 9.4 23 8.2 23 5.8C23 3 25.5 0.7 29 0.7C31.5 0.7 33.5 1.8 33.5 1.8L32 4.8C32 4.8 30.5 3.8 29 3.8C27.8 3.8 27 4.4 27 5.2C27 6.3 28.5 6.8 30 7.5C32 8.4 34 9.8 34 12.5C34 15.5 31.5 17.5 27.5 17.5C24.5 17.5 22.5 16 22 15.5L23 12.5Z" fill="white" />
      {/* A */}
      <path d="M36 17L41 1H46L52 17H48L47 14H40L39 17H36ZM41 11H46L43.5 4L41 11Z" fill="white" />
    </svg>
  );
}

/* ── Tier badge ── */
function TierBadge({ tier }: { tier: "LOW" | "MEDIUM" | "HIGH" }) {
  const styles = {
    LOW: "bg-emerald-50 border-emerald-300 text-emerald-700",
    MEDIUM: "bg-amber-50 border-amber-300 text-amber-700",
    HIGH: "bg-red-50 border-red-300 text-red-700",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles[tier]}`}>
      {tier}
    </span>
  );
}

/* ── Action button ── */
function ActionButton({
  label, variant, active, onClick,
}: {
  label: string;
  variant: "approve" | "review" | "deny";
  active: boolean;
  onClick: () => void;
}) {
  const base = "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border";
  const styles = {
    approve: active
      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    review: active
      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    deny: active
      ? "bg-red-600 text-white border-red-600 shadow-sm"
      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };
  const icons = {
    approve: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    review: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    deny: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {icons[variant]}
      {label}
    </button>
  );
}

/* ── Helpers ── */
function tierMeta(
  tier: "LOW" | "MEDIUM" | "HIGH",
  motor: "APPROVE" | "REVIEW" | "DENY"
) {
  const motorLabel = {
    APPROVE: { text: "APPROVE", color: "text-emerald-600" },
    REVIEW:  { text: "REVIEW",  color: "text-amber-600"   },
    DENY:    { text: "DENY",    color: "text-red-600"     },
  };
  return { tier, decision: motorLabel[motor] };
}

function IssuerGridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
      <rect x="11" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="2" y="11" width="5" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="11" y="11" width="5" height="5" rx="1" fill="white" />
      <rect x="8" y="2" width="2" height="14" rx="1" fill="white" opacity="0.3" />
      <rect x="2" y="8" width="14" height="2" rx="1" fill="white" opacity="0.3" />
    </svg>
  );
}
