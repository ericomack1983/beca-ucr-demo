import React from "react";

/**
 * Banco de Costa Rica (BCR) logo — faithful recreation of the brand mark:
 * a red slanted parallelogram + bold blue "BCR", with an optional
 * "SOMOS EL BANCO DE COSTA RICA" tagline.
 *
 * Pure SVG so it renders consistently regardless of surrounding CSS.
 */

const BCR_RED = "#E1251D";
const BCR_BLUE = "#2A4B9C";

interface BCRIconProps {
  /** Rendered size in px (square). */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Square BCR app icon — a rounded blue tile with the red parallelogram and
 * white "BCR". Matches /public/favicon.svg. Use for compact brand spots.
 */
export function BCRIcon({ size = 40, className, style }: BCRIconProps) {
  const gid = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      role="img"
      aria-label="Banco de Costa Rica"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", ...style }}
    >
      <defs>
        <linearGradient id={`bcr-tile-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E52AE" />
          <stop offset="1" stopColor="#16306E" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill={`url(#bcr-tile-${gid})`} />
      <rect x="40" y="40" width="432" height="190" rx="92" fill="#ffffff" opacity="0.06" />
      <path d="M120 150 L398 150 L362 214 L84 214 Z" fill={BCR_RED} />
      <text
        x="256"
        y="392"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="168"
        letterSpacing="-7"
        fill="#ffffff"
      >
        BCR
      </text>
    </svg>
  );
}

interface BCRLogoProps {
  /** Rendered height in px (width scales to preserve aspect ratio). */
  height?: number;
  /** Show the "SOMOS EL BANCO DE COSTA RICA" tagline beneath the mark. */
  tagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BCRLogo({ height = 32, tagline = false, className, style }: BCRLogoProps) {
  // Mark-only is wider/shorter; tagline version is taller.
  const vbW = 380;
  const vbH = tagline ? 150 : 104;
  const width = Math.round(height * (vbW / vbH));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      fill="none"
      role="img"
      aria-label="Banco de Costa Rica"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", ...style }}
    >
      {/* Red slanted parallelogram */}
      <path d="M30 26 L171 26 L156 76 L15 76 Z" fill={BCR_RED} />

      {/* BCR wordmark */}
      <text
        x="184"
        y="79"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="74"
        letterSpacing="-3"
        fill={BCR_BLUE}
      >
        BCR
      </text>

      {/* Tagline */}
      {tagline && (
        <text
          x="200"
          y="125"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="19"
          letterSpacing="0.5"
        >
          <tspan fill={BCR_RED}>SOMOS EL </tspan>
          <tspan fill={BCR_BLUE}>BANCO DE COSTA RICA</tspan>
        </text>
      )}
    </svg>
  );
}
