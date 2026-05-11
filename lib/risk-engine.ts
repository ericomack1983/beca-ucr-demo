export interface RiskInput {
  monthlyFamilyIncome: number; // CRC colones
  dependents: number;
  housingStatus: "owned" | "rented" | "family" | "informal";
  employmentStatus: "stable" | "temporary" | "self_employed" | "unemployed";
  region: string;
  isRural: boolean;
  academicLevel: "undergraduate" | "graduate";
  hasFundingCommitment?: boolean;
}

export interface RiskResult {
  score: number;
  tier: "LOW" | "MEDIUM" | "HIGH";
  decision: "APPROVED" | "REVIEW" | "REJECTED";
  reasons: string[];
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  incomeScore: number;
  housingScore: number;
  employmentScore: number;
  academicScore: number;
  regionBonus: number;
}

const INCOME_THRESHOLDS = {
  very_low: 150000,   // < ₡150k per capita → max score
  low: 300000,        // < ₡300k
  medium: 500000,     // < ₡500k
  high: 800000,       // < ₡800k
};

export function scoreApplicant(input: RiskInput): RiskResult {
  const reasons: string[] = [];
  const breakdown: ScoreBreakdown = {
    incomeScore: 0,
    housingScore: 0,
    employmentScore: 0,
    academicScore: 0,
    regionBonus: 0,
  };

  // 1. Income per capita (max 35 pts)
  const perCapita = input.dependents > 0
    ? input.monthlyFamilyIncome / input.dependents
    : input.monthlyFamilyIncome;

  if (perCapita < INCOME_THRESHOLDS.very_low) {
    breakdown.incomeScore = 35;
    reasons.push("Ingreso per cápita familiar muy bajo — alta necesidad económica");
  } else if (perCapita < INCOME_THRESHOLDS.low) {
    breakdown.incomeScore = 28;
    reasons.push("Ingreso per cápita familiar bajo el umbral de elegibilidad");
  } else if (perCapita < INCOME_THRESHOLDS.medium) {
    breakdown.incomeScore = 18;
    reasons.push("Ingreso per cápita familiar moderado");
  } else if (perCapita < INCOME_THRESHOLDS.high) {
    breakdown.incomeScore = 8;
    reasons.push("Ingreso per cápita familiar medio-alto");
  } else {
    breakdown.incomeScore = 0;
    reasons.push("Ingreso per cápita familiar supera el umbral de elegibilidad");
  }

  // 2. Housing status (max 20 pts)
  switch (input.housingStatus) {
    case "informal":
      breakdown.housingScore = 20;
      reasons.push("Vivienda en condición informal — factor de alta vulnerabilidad");
      break;
    case "rented":
      breakdown.housingScore = 15;
      reasons.push("Vivienda en condición de alquiler — indicador de vulnerabilidad");
      break;
    case "family":
      breakdown.housingScore = 10;
      reasons.push("Vivienda prestada por familiares — condición de dependencia");
      break;
    case "owned":
      breakdown.housingScore = 5;
      reasons.push("Vivienda propia — menor peso socioeconómico");
      break;
  }

  // 3. Employment stability (max 25 pts)
  switch (input.employmentStatus) {
    case "unemployed":
      breakdown.employmentScore = 25;
      reasons.push("Jefe de hogar sin empleo formal — alta necesidad");
      break;
    case "temporary":
      breakdown.employmentScore = 20;
      reasons.push("Empleo temporal del jefe de hogar — ingresos inestables");
      break;
    case "self_employed":
      breakdown.employmentScore = 15;
      reasons.push("Jefe de hogar trabajador independiente");
      break;
    case "stable":
      breakdown.employmentScore = 5;
      reasons.push("Empleo estable del jefe de hogar");
      break;
  }

  // 4. Academic level (max 10 pts)
  if (input.academicLevel === "graduate" && !input.hasFundingCommitment) {
    breakdown.academicScore = 5;
    reasons.push("Posgrado sin financiamiento comprometido — riesgo de deserción");
  } else if (input.academicLevel === "undergraduate") {
    breakdown.academicScore = 10;
    reasons.push("Nivel de grado — elegibilidad estándar");
  } else {
    breakdown.academicScore = 8;
    reasons.push("Posgrado con financiamiento parcial comprometido");
  }

  // 5. Region bonus (max 10 pts)
  if (input.isRural) {
    breakdown.regionBonus = 10;
    reasons.push("Región rural con menor acceso histórico a oportunidades educativas");
  } else {
    breakdown.regionBonus = 3;
  }

  const totalScore =
    breakdown.incomeScore +
    breakdown.housingScore +
    breakdown.employmentScore +
    breakdown.academicScore +
    breakdown.regionBonus;

  const score = Math.min(100, Math.round(totalScore));

  let tier: "LOW" | "MEDIUM" | "HIGH";
  let decision: "APPROVED" | "REVIEW" | "REJECTED";

  if (score >= 70) {
    tier = "LOW";
    decision = "APPROVED";
  } else if (score >= 40) {
    tier = "MEDIUM";
    decision = "REVIEW";
  } else {
    tier = "HIGH";
    decision = "REJECTED";
  }

  return { score, tier, decision, reasons, breakdown };
}

export const SCORING_RULES = [
  {
    category: "Ingreso per cápita familiar",
    maxPoints: 35,
    description: "Ingreso mensual familiar dividido entre número de dependientes",
    brackets: [
      { label: "Menos de ₡150,000", points: 35 },
      { label: "₡150,000 – ₡300,000", points: 28 },
      { label: "₡300,000 – ₡500,000", points: 18 },
      { label: "₡500,000 – ₡800,000", points: 8 },
      { label: "Más de ₡800,000", points: 0 },
    ],
  },
  {
    category: "Condición de vivienda",
    maxPoints: 20,
    description: "Tipo de tenencia del inmueble donde reside el núcleo familiar",
    brackets: [
      { label: "Precaria / Informal", points: 20 },
      { label: "Alquiler", points: 15 },
      { label: "Prestada por familiares", points: 10 },
      { label: "Propia", points: 5 },
    ],
  },
  {
    category: "Estabilidad laboral del jefe de hogar",
    maxPoints: 25,
    description: "Condición de empleo de quien sostiene económicamente el hogar",
    brackets: [
      { label: "Desempleado", points: 25 },
      { label: "Empleo temporal", points: 20 },
      { label: "Trabajador independiente", points: 15 },
      { label: "Empleo estable / formal", points: 5 },
    ],
  },
  {
    category: "Nivel académico",
    maxPoints: 10,
    description: "Grado académico al que aplica; el posgrado sin financiamiento añade riesgo",
    brackets: [
      { label: "Grado (Bachillerato / Licenciatura)", points: 10 },
      { label: "Posgrado con financiamiento", points: 8 },
      { label: "Posgrado sin financiamiento", points: 5 },
    ],
  },
  {
    category: "Ajuste por región",
    maxPoints: 10,
    description: "Zona geográfica de residencia; las regiones rurales reciben bonificación",
    brackets: [
      { label: "Región rural", points: 10 },
      { label: "Región urbana / Gran Área Metropolitana", points: 3 },
    ],
  },
];

export const THRESHOLDS = [
  { min: 70, max: 100, tier: "LOW" as const, decision: "APPROVED" as const, label: "Aprobado", color: "green" },
  { min: 40, max: 69, tier: "MEDIUM" as const, decision: "REVIEW" as const, label: "En Revisión", color: "amber" },
  { min: 0, max: 39, tier: "HIGH" as const, decision: "REJECTED" as const, label: "Rechazado", color: "red" },
];
