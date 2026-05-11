export type IssuerDecision = "approved" | "review" | "denied" | "pending";
export type MotorDecision = "APPROVE" | "REVIEW" | "DENY";
export type RiskTier = "LOW" | "MEDIUM" | "HIGH";
export type AppStatus = "en_proceso" | "aprobada" | "nueva_solicitud" | "denegada";

export interface ScoringFactor {
  label: string;
  value: string;
  points: number;
}

export interface IssuerApplicant {
  id: string;
  name: string;
  carne: string;
  program: string;
  status: AppStatus;
  statusLabel: string;
  score: number;
  motorDecision: MotorDecision;
  riskTier: RiskTier;
  motorRecommendation: string;
  factors: ScoringFactor[];
  issuerDecision: IssuerDecision;
}

export const MOCK_ISSUER_APPLICANTS: IssuerApplicant[] = [
  {
    id: "iss_001",
    name: "María González Mora",
    carne: "B12345",
    program: "Ingeniería Informática",
    status: "en_proceso",
    statusLabel: "En Proceso",
    score: 84,
    motorDecision: "APPROVE",
    riskTier: "LOW",
    motorRecommendation: "Aprobar solicitud",
    factors: [
      { label: "Promedio académico", value: "8.4 / 10", points: 15 },
      { label: "Ingreso familiar mensual", value: "₡420 000", points: 13 },
      { label: "Personas dependientes", value: "3", points: 10 },
      { label: "Créditos matriculados", value: "18 cr", points: 6 },
    ],
    issuerDecision: "pending",
  },
  {
    id: "iss_002",
    name: "Carlos Jiménez Solís",
    carne: "B67890",
    program: "Medicina",
    status: "aprobada",
    statusLabel: "Aprobada",
    score: 88,
    motorDecision: "APPROVE",
    riskTier: "LOW",
    motorRecommendation: "Aprobar solicitud",
    factors: [
      { label: "Promedio académico", value: "9.1 / 10", points: 18 },
      { label: "Ingreso familiar mensual", value: "₡310 000", points: 16 },
      { label: "Personas dependientes", value: "4", points: 12 },
      { label: "Créditos matriculados", value: "20 cr", points: 8 },
    ],
    issuerDecision: "approved",
  },
  {
    id: "iss_003",
    name: "Ana Vargas Rojas",
    carne: "B11111",
    program: "Derecho",
    status: "nueva_solicitud",
    statusLabel: "Nueva Solicitud",
    score: 62,
    motorDecision: "REVIEW",
    riskTier: "MEDIUM",
    motorRecommendation: "Solicitar revisión manual",
    factors: [
      { label: "Promedio académico", value: "7.2 / 10", points: 8 },
      { label: "Ingreso familiar mensual", value: "₡580 000", points: 7 },
      { label: "Personas dependientes", value: "2", points: 6 },
      { label: "Créditos matriculados", value: "15 cr", points: 4 },
    ],
    issuerDecision: "pending",
  },
];
