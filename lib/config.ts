export const ADMIN_PORTAL_URL = "/issuer";

export const UCR_FACULTIES = [
  "Medicina",
  "Ingeniería",
  "Derecho",
  "Ciencias Económicas",
  "Letras",
  "Ciencias Sociales",
  "Educación",
  "Farmacia",
  "Microbiología",
  "Odontología",
  "Ciencias Agroalimentarias",
  "Artes Musicales",
  "Bellas Artes",
  "Sistemas de Información",
  "Arquitectura",
  "Química",
  "Biología",
  "Física y Matemáticas",
];

export const UCR_REGIONS = [
  { value: "san_jose", label: "San José (Rodrigo Facio)", rural: false },
  { value: "cartago", label: "Cartago (Sede Atlántico)", rural: false },
  { value: "heredia", label: "Heredia (Sede Norte)", rural: false },
  { value: "limon", label: "Limón (Sede Caribe)", rural: true },
  { value: "guanacaste", label: "Guanacaste (Sede Chorotega)", rural: true },
  { value: "puntarenas", label: "Puntarenas (Sede Pacífico)", rural: true },
  { value: "san_ramon", label: "San Ramón (Sede Occidente)", rural: true },
];

export const DEMO_DATE = new Date("2026-05-11");

// MCC categories where the scholarship (beca) card is authorized to spend.
// Education-essential merchant categories for university students.
export const BECA_MCC_WHITELIST = [
  { code: "5411", label: "Supermercados y mercados" },
  { code: "5942", label: "Librerías y material de estudio" },
  { code: "5111", label: "Papelería y artículos de oficina" },
  { code: "4111", label: "Transporte público" },
  { code: "5811", label: "Sodas y comedores estudiantiles" },
  { code: "5912", label: "Farmacias (salud e higiene)" },
];

// Back-compat alias for the issuance flow.
export const AVANCEMOS_MCC_WHITELIST = BECA_MCC_WHITELIST;

export function formatCRC(amount: number): string {
  return `₡${amount.toLocaleString("es-CR")}`;
}

export function formatCRCShort(amount: number): string {
  if (amount >= 1_000_000) return `₡${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₡${(amount / 1_000).toFixed(0)}K`;
  return `₡${amount}`;
}
