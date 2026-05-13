export type ScoreCategory = 'APPROVE' | 'REVIEW' | 'DENY';
export type CardType = 'debit' | 'prepaid';
export type DeliveryType = 'digital' | 'digital_apple' | 'digital_google' | 'digital_both' | 'digital_physical';
export type ValidityPeriod = 'semestral' | 'anual' | 'custom';
export type DocumentStatus = 'pending' | 'uploaded' | 'verified';
export type IssuanceStatus = 'pending' | 'generating' | 'sending' | 'active' | 'error';
export type BatchPhase = 'idle' | 'generating' | 'validating' | 'sending' | 'processing' | 'complete' | 'error';

export interface DocumentItem {
  id: string;
  label: string;
  status: DocumentStatus;
}

export interface FlowStudent {
  id: string;
  name: string;
  carne: string;
  program: string;
  faculty: string;
  gpa: number;
  dependents: number;
  credits: number;
  monthlyIncome: number;
  score: number;
  scoreCategory: ScoreCategory;
  selected: boolean;
  documents: DocumentItem[];
  issuanceStatus: IssuanceStatus;
}

export interface FilterState {
  gpaMin: number;
  gpaMax: number;
  dependentsMin: number;
  dependentsMax: number;
  creditsMin: number;
  creditsMax: number;
}

export interface MccCategory {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface CardConfig {
  cardType: CardType;
  mccEnabled: boolean;
  mccs: string[];
  monthlyAmount: number;
  deliveryTypes: DeliveryType[];
  walletEnabled: boolean;
  validity: ValidityPeriod;
  dailyLimit: number;
  notificationsEnabled: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  gpaMin: 0,
  gpaMax: 10,
  dependentsMin: 0,
  dependentsMax: 10,
  creditsMin: 0,
  creditsMax: 24,
};

export const DEFAULT_CARD_CONFIG: CardConfig = {
  cardType: 'prepaid',
  mccEnabled: false,
  mccs: ['education', 'food'],
  monthlyAmount: 150000,
  deliveryTypes: ['digital'],
  walletEnabled: false,
  validity: 'semestral',
  dailyLimit: 50000,
  notificationsEnabled: true,
};

export const MCC_CATEGORIES: MccCategory[] = [
  { id: 'education', icon: '🎓', label: 'Educación', description: 'Librerías, materiales, matrículas' },
  { id: 'food', icon: '🍽️', label: 'Alimentación', description: 'Supermercados, sodas' },
  { id: 'transport', icon: '🚌', label: 'Transporte', description: 'Buses, gasolina' },
  { id: 'health', icon: '💊', label: 'Salud', description: 'Farmacias, clínicas' },
];
