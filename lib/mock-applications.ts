export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "risk_scored"
  | "approved"
  | "review_required"
  | "rejected";

export type BecaType = "beca_honor" | "beca_trabajo" | "prestamo" | "mixta";

export interface ApplicationStep {
  step: number;
  name: string;
  completedAt?: string;
  status: "completed" | "in_progress" | "pending";
}

export interface RiskAssessment {
  score: number;
  tier: "LOW" | "MEDIUM" | "HIGH";
  decision: "APPROVED" | "REVIEW" | "REJECTED";
  reasons: string[];
  completedAt?: string;
}

export interface Application {
  id: string;
  studentId: string;
  program: string;
  faculty: string;
  becaType: BecaType;
  becaTypeLabel: string;
  level: "undergraduate" | "graduate";
  status: ApplicationStatus;
  currentStep: number;
  steps: ApplicationStep[];
  submittedAt?: string;
  estimatedDecisionDate: string;
  riskAssessment?: RiskAssessment;
  documents: DocumentItem[];
  activityFeed: ActivityItem[];
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "approved" | "reviewing" | "rejected" | "pending" | "uploaded";
  uploadedAt?: string;
  fileSize?: string;
  required: boolean;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app_001",
    studentId: "stu_001",
    program: "Ingeniería en Sistemas de Información",
    faculty: "Ingeniería",
    becaType: "beca_honor",
    becaTypeLabel: "Beca de Honor",
    level: "undergraduate",
    status: "under_review",
    currentStep: 4,
    steps: [
      {
        step: 1,
        name: "Definir Objetivo",
        completedAt: "2026-05-08T09:00:00Z",
        status: "completed",
      },
      {
        step: 2,
        name: "Documentos Requeridos",
        completedAt: "2026-05-09T14:30:00Z",
        status: "completed",
      },
      {
        step: 3,
        name: "Ventana de Postulación",
        completedAt: "2026-05-09T15:00:00Z",
        status: "completed",
      },
      {
        step: 4,
        name: "Evaluación Socioeconómica",
        status: "in_progress",
      },
      {
        step: 5,
        name: "Seguimiento",
        status: "pending",
      },
    ],
    submittedAt: "2026-05-09T15:00:00Z",
    estimatedDecisionDate: "2026-05-16",
    documents: [
      {
        id: "doc_001",
        name: "Cédula de Identidad",
        type: "identity",
        status: "approved",
        uploadedAt: "2026-05-09T10:00:00Z",
        fileSize: "1.2 MB",
        required: true,
      },
      {
        id: "doc_002",
        name: "Certificación de Notas",
        type: "academic",
        status: "approved",
        uploadedAt: "2026-05-09T10:05:00Z",
        fileSize: "890 KB",
        required: true,
      },
      {
        id: "doc_003",
        name: "Comprobante de Ingresos",
        type: "financial",
        status: "rejected",
        uploadedAt: "2026-05-09T10:10:00Z",
        fileSize: "2.1 MB",
        required: true,
      },
      {
        id: "doc_004",
        name: "Carta de Presentación Personal",
        type: "personal",
        status: "reviewing",
        uploadedAt: "2026-05-09T10:15:00Z",
        fileSize: "456 KB",
        required: true,
      },
      {
        id: "doc_005",
        name: "Carta de Recomendación",
        type: "recommendation",
        status: "pending",
        required: false,
      },
      {
        id: "doc_006",
        name: "Curriculum Vitae",
        type: "cv",
        status: "pending",
        required: false,
      },
    ],
    activityFeed: [
      {
        id: "act_001",
        message: "Solicitud iniciada",
        timestamp: "2026-05-08T09:00:00Z",
        type: "info",
      },
      {
        id: "act_002",
        message: "Documento recibido: Cédula de Identidad",
        timestamp: "2026-05-09T10:00:00Z",
        type: "success",
      },
      {
        id: "act_003",
        message: "Documento recibido: Certificación de Notas",
        timestamp: "2026-05-09T10:05:00Z",
        type: "success",
      },
      {
        id: "act_004",
        message: "Solicitud enviada al motor de riesgo",
        timestamp: "2026-05-10T08:00:00Z",
        type: "info",
      },
      {
        id: "act_005",
        message: "Documento adicional requerido: Comprobante de ingresos actualizado",
        timestamp: "2026-05-11T09:00:00Z",
        type: "warning",
      },
    ],
  },
  {
    id: "app_002",
    studentId: "stu_002",
    program: "Economía",
    faculty: "Ciencias Económicas",
    becaType: "beca_trabajo",
    becaTypeLabel: "Beca de Trabajo",
    level: "undergraduate",
    status: "approved",
    currentStep: 5,
    steps: [
      {
        step: 1,
        name: "Definir Objetivo",
        completedAt: "2026-04-20T09:00:00Z",
        status: "completed",
      },
      {
        step: 2,
        name: "Documentos Requeridos",
        completedAt: "2026-04-22T11:00:00Z",
        status: "completed",
      },
      {
        step: 3,
        name: "Ventana de Postulación",
        completedAt: "2026-04-22T11:30:00Z",
        status: "completed",
      },
      {
        step: 4,
        name: "Evaluación Socioeconómica",
        completedAt: "2026-04-25T14:00:00Z",
        status: "completed",
      },
      {
        step: 5,
        name: "Seguimiento",
        completedAt: "2026-05-01T10:00:00Z",
        status: "completed",
      },
    ],
    submittedAt: "2026-04-22T11:30:00Z",
    estimatedDecisionDate: "2026-05-01",
    riskAssessment: {
      score: 82,
      tier: "LOW",
      decision: "APPROVED",
      reasons: [
        "Ingreso per cápita familiar bajo el umbral de elegibilidad",
        "Vivienda en condición de alquiler — indicador de vulnerabilidad",
        "Región rural con menor acceso a oportunidades",
        "Desempeño académico sobresaliente (nota promedio 8.9)",
      ],
      completedAt: "2026-04-28T10:00:00Z",
    },
    documents: [
      {
        id: "doc_010",
        name: "Cédula de Identidad",
        type: "identity",
        status: "approved",
        uploadedAt: "2026-04-22T09:00:00Z",
        fileSize: "980 KB",
        required: true,
      },
      {
        id: "doc_011",
        name: "Certificación de Notas",
        type: "academic",
        status: "approved",
        uploadedAt: "2026-04-22T09:05:00Z",
        fileSize: "1.1 MB",
        required: true,
      },
      {
        id: "doc_012",
        name: "Comprobante de Ingresos",
        type: "financial",
        status: "approved",
        uploadedAt: "2026-04-22T09:10:00Z",
        fileSize: "1.8 MB",
        required: true,
      },
      {
        id: "doc_013",
        name: "Carta de Presentación Personal",
        type: "personal",
        status: "approved",
        uploadedAt: "2026-04-22T09:15:00Z",
        fileSize: "512 KB",
        required: true,
      },
    ],
    activityFeed: [
      {
        id: "act_010",
        message: "Solicitud iniciada",
        timestamp: "2026-04-20T09:00:00Z",
        type: "info",
      },
      {
        id: "act_011",
        message: "Todos los documentos aprobados",
        timestamp: "2026-04-25T10:00:00Z",
        type: "success",
      },
      {
        id: "act_012",
        message: "Evaluación de riesgo completada — Tier: LOW",
        timestamp: "2026-04-28T10:00:00Z",
        type: "success",
      },
      {
        id: "act_013",
        message: "Beca aprobada — ¡Felicitaciones!",
        timestamp: "2026-05-01T10:00:00Z",
        type: "success",
      },
    ],
  },
];

export function getApplicationById(id: string): Application | undefined {
  return MOCK_APPLICATIONS.find((a) => a.id === id);
}

export function getApplicationByStudentId(
  studentId: string
): Application | undefined {
  return MOCK_APPLICATIONS.find((a) => a.studentId === studentId);
}
