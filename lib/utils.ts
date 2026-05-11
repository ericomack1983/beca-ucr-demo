import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCRC(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date("2026-05-11T17:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "hace unos minutos";
  if (diffHours === 1) return "hace 1 hora";
  if (diffHours < 24) return `hace ${diffHours} horas`;
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;

  return date.toLocaleDateString("es-CR", { day: "numeric", month: "short" });
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
