import React from "react";

interface ValidLogoProps {
  color?: string;
  height?: number;
  className?: string;
}

export function ValidLogo({ color = "#FFFFFF", height = 24, className }: ValidLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${className}`}
      style={{ fontSize: height * 0.75, color }}
    >
      <div
        className="rounded flex items-center justify-center font-black"
        style={{
          width: height,
          height: height,
          background: color === "#FFFFFF" ? "rgba(255,255,255,0.15)" : "#1A3C6E",
          fontSize: height * 0.55,
          color: color === "#FFFFFF" ? "#FFFFFF" : "white",
          border: `1.5px solid ${color === "#FFFFFF" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"}`,
        }}
      >
        V
      </div>
      <span>Valid</span>
    </div>
  );
}
