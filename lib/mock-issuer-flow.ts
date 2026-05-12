import type { FlowStudent, DocumentStatus } from '@/types/issuer-flow';

function computeScore(gpa: number, dependents: number, credits: number, income: number): number {
  const gpaPoints = Math.round((gpa / 10) * 35);
  const depPoints = Math.min(Math.round((dependents / 6) * 20), 20);
  const creditPoints = Math.round(Math.min(credits / 22, 1) * 20);
  const incomePoints = Math.round(Math.max(0, 25 - (income / 600000) * 25));
  return Math.min(100, gpaPoints + depPoints + creditPoints + incomePoints);
}

function scoreCategory(score: number): 'APPROVE' | 'REVIEW' | 'DENY' {
  if (score >= 80) return 'APPROVE';
  if (score >= 60) return 'REVIEW';
  return 'DENY';
}

const DOC_LABELS = [
  'Documento de identidad verificado',
  'Matrícula activa confirmada',
  'Carta de beca universitaria',
  'Comprobante de ingresos familiares',
  'Declaración jurada de dependientes',
];

function makeDocuments(statuses: DocumentStatus[]) {
  return DOC_LABELS.map((label, i) => ({
    id: `doc_${i}`,
    label,
    status: statuses[i] ?? 'pending',
  }));
}

const RAW_STUDENTS = [
  { id: 'fs_001', name: 'María González Mora',    carne: 'B12345', program: 'Ing. Informática',      faculty: 'Ingeniería',                 gpa: 8.4, dependents: 3, credits: 18, income: 420000, docs: ['verified','verified','verified','verified','verified'] as DocumentStatus[] },
  { id: 'fs_002', name: 'Carlos Jiménez Solís',   carne: 'B67890', program: 'Medicina',              faculty: 'Ciencias de la Salud',        gpa: 9.1, dependents: 4, credits: 20, income: 310000, docs: ['verified','verified','verified','verified','verified'] as DocumentStatus[] },
  { id: 'fs_003', name: 'Ana Vargas Rojas',        carne: 'B11111', program: 'Derecho',               faculty: 'Ciencias Sociales',           gpa: 7.2, dependents: 2, credits: 15, income: 580000, docs: ['verified','uploaded','pending','pending','verified'] as DocumentStatus[] },
  { id: 'fs_004', name: 'Luis Herrera Castro',     carne: 'B22222', program: 'Arquitectura',          faculty: 'Artes y Letras',              gpa: 8.8, dependents: 5, credits: 21, income: 250000, docs: ['verified','verified','verified','verified','verified'] as DocumentStatus[] },
  { id: 'fs_005', name: 'Sofía Murillo Vega',      carne: 'B33333', program: 'Química',               faculty: 'Ciencias Exactas',            gpa: 9.3, dependents: 2, credits: 22, income: 480000, docs: ['verified','verified','uploaded','verified','verified'] as DocumentStatus[] },
  { id: 'fs_006', name: 'Diego Ramírez Prado',     carne: 'B44444', program: 'Física',                faculty: 'Ciencias Exactas',            gpa: 6.8, dependents: 1, credits: 12, income: 650000, docs: ['pending','pending','pending','pending','pending'] as DocumentStatus[] },
  { id: 'fs_007', name: 'Valentina Solano Cruz',   carne: 'B55555', program: 'Psicología',            faculty: 'Ciencias Sociales',           gpa: 8.1, dependents: 3, credits: 17, income: 390000, docs: ['verified','verified','verified','uploaded','verified'] as DocumentStatus[] },
  { id: 'fs_008', name: 'Andrés Mora Acuña',       carne: 'B66666', program: 'Agronomía',             faculty: 'Ciencias Agroalimentarias',   gpa: 7.9, dependents: 4, credits: 19, income: 340000, docs: ['verified','verified','pending','verified','verified'] as DocumentStatus[] },
  { id: 'fs_009', name: 'Camila Vásquez León',     carne: 'B77777', program: 'Biología',              faculty: 'Ciencias Exactas',            gpa: 8.6, dependents: 3, credits: 20, income: 410000, docs: ['verified','verified','verified','verified','verified'] as DocumentStatus[] },
  { id: 'fs_010', name: 'Felipe Brenes Mora',      carne: 'B88888', program: 'Historia',              faculty: 'Ciencias Sociales',           gpa: 7.5, dependents: 2, credits: 14, income: 520000, docs: ['verified','pending','pending','pending','pending'] as DocumentStatus[] },
];

export const MOCK_FLOW_STUDENTS: FlowStudent[] = RAW_STUDENTS.map((r) => {
  const score = computeScore(r.gpa, r.dependents, r.credits, r.income);
  return {
    id: r.id,
    name: r.name,
    carne: r.carne,
    program: r.program,
    faculty: r.faculty,
    gpa: r.gpa,
    dependents: r.dependents,
    credits: r.credits,
    monthlyIncome: r.income,
    score,
    scoreCategory: scoreCategory(score),
    selected: score >= 80,
    documents: makeDocuments(r.docs),
    issuanceStatus: 'pending',
  };
});
