"use client";

import { authenticateStudent, type Student } from "./mock-students";

const SESSION_KEY = "ucr_session";

export interface Session {
  studentId: string;
  email: string;
  name: string;
  token: string;
}

export function login(email: string, password: string): Session | null {
  const student = authenticateStudent(email, password);
  if (!student) return null;

  const session: Session = {
    studentId: student.id,
    email: student.email,
    name: student.name,
    token: `mock_token_${student.id}_${Date.now()}`,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
