"use client";

const ISSUER_SESSION_KEY = "issuer_session";

const ISSUER_CREDENTIALS = [
  { email: "admin@banconal.fi.cr", password: "issuer123", name: "Administrador BN" },
  { email: "oficial@banconal.fi.cr", password: "issuer123", name: "Oficial de Crédito" },
];

export interface IssuerSession {
  email: string;
  name: string;
  token: string;
}

export function issuerLogin(email: string, password: string): IssuerSession | null {
  const user = ISSUER_CREDENTIALS.find(
    (c) => c.email === email && c.password === password
  );
  if (!user) return null;

  const session: IssuerSession = {
    email: user.email,
    name: user.name,
    token: `issuer_${Date.now()}`,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(ISSUER_SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function issuerLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ISSUER_SESSION_KEY);
  }
}

export function getIssuerSession(): IssuerSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ISSUER_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IssuerSession;
  } catch {
    return null;
  }
}

export function isIssuerAuthenticated(): boolean {
  return getIssuerSession() !== null;
}
