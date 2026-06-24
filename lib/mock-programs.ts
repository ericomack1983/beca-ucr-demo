// Registered scholarship (beca) programs — shared between the Programs
// management page (/issuer/program-management) and the card issuance
// flow (/issuer/emissao). Banco de Costa Rica · Portal Adm Universidad.

export type CardType = "Debit" | "Prepaid";

export type Program = {
  id: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  active: boolean;
  type: CardType;
};

const TZ_CR = "Central Standard Time";

export const PROGRAMS: Program[] = [
  { id: "39201", name: "Beca Socioeconómica",        country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39202", name: "Beca de Estímulo",           country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39203", name: "Horas Estudiante",           country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39204", name: "Beca de Posgrado",           country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Debit"   },
  { id: "39205", name: "Beca Préstamo CONAPE",       country: "CRI", currency: "CRC", timezone: TZ_CR, active: false, type: "Prepaid" },
  { id: "39206", name: "Residencias Estudiantiles",  country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39207", name: "Préstamo Estudiantil BCR",    country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Debit"   },
  { id: "39208", name: "Beca de Equidad Regional",   country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39209", name: "Beca Deportiva-Cultural",    country: "CRI", currency: "CRC", timezone: TZ_CR, active: false, type: "Debit"   },
  { id: "39210", name: "Beca Alimentación",          country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39211", name: "Beca Transporte",            country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39236", name: "Convenio Universidad BCR",    country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
  { id: "39237", name: "Test Prepaid VGS",           country: "CRI", currency: "CRC", timezone: TZ_CR, active: true,  type: "Prepaid" },
];
