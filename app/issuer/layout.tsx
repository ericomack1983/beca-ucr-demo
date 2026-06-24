"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Nav,
  NavAppName,
  VisaLogo,
  Button,
  Typography,
  Footer,
  Link,
} from "@visa/nova-react";
import {
  VisaDashboardLow,
  VisaSettingsLow,
  VisaAnalyticsLow,
  VisaAccountLow,
  VisaFraudLow,
  VisaCardManageLow,
  VisaSignOutLow,
  VisaLanguageLow,
} from "@visa/nova-icons-react";
import { getIssuerSession, issuerLogout } from "@/lib/issuer-auth";
import { BCRLogo } from "@/components/ui/bcr-logo";

const NAV_ITEMS = [
  { label: "Resumen",            href: "/issuer",                 icon: VisaDashboardLow  },
  { label: "Gestión de Programas", href: "/issuer/program-management", icon: VisaSettingsLow },
  { label: "Becarios",          href: "/issuer/beneficiarios",    icon: VisaAccountLow    },
  { label: "Analytics",         href: "/issuer/analytics",        icon: VisaAnalyticsLow  },
  { label: "Emisión Tarjetas",  href: "/issuer/emissao",          icon: VisaCardManageLow },
  { label: "Alertas",           href: "/issuer/alertas",          icon: VisaFraudLow      },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady]       = useState(false);
  const [tooltip, setTooltip]   = useState<string | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    if (pathname === "/issuer/login") { setReady(true); return; }
    getIssuerSession().then((session) => {
      if (!session) router.replace("/issuer/login");
      else setReady(true);
    });
  }, [router, pathname]);

  useEffect(() => {
    const handler = () => setBadgeCount((c) => c + 1);
    window.addEventListener("new-beneficiary", handler);
    return () => window.removeEventListener("new-beneficiary", handler);
  }, []);

  if (!ready) {
    return (
      <div className="v-flex v-align-items-center v-justify-center v-min-h-screen">
        <Typography className="v-typography-body-2">Cargando portal BCR...</Typography>
      </div>
    );
  }

  if (pathname === "/issuer/login") return <>{children}</>;

  const handleLogout = async () => {
    await issuerLogout();
    router.push("/issuer/login");
  };

  return (
    <div className="v-flex v-min-h-screen" style={{ minHeight: "100vh" }}>

      {/* ── Icon-only sidebar ─────────────────────────────────────────── */}
      <aside
        className="v-flex v-flex-col v-align-items-center v-flex-shrink-0"
        style={{
          width: "64px",
          background: "#fff",
          borderRight: "1px solid rgba(0,0,0,.08)",
          paddingTop: "16px",
          paddingBottom: "16px",
          gap: "8px",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Visa wordmark */}
        <div style={{ marginBottom: "20px" }}>
          <VisaLogo style={{ width: "36px", height: "auto" }} />
        </div>

        {/* Nav icon buttons with hover tooltip */}
        <nav
          aria-label="Portal navigation"
          className="v-flex v-flex-col v-align-items-center v-flex-1"
          style={{ gap: "4px" }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/issuer" && pathname.startsWith(item.href));

            return (
              <div
                key={item.href}
                style={{ position: "relative", display: "flex", justifyContent: "center" }}
                onMouseEnter={() => setTooltip(item.label)}
                onMouseLeave={() => setTooltip(null)}
              >
                <Button
                  className={isActive ? "v-action-primary" : "v-action-stateless"}
                  iconButton
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    if (item.href === "/issuer/beneficiarios") setBadgeCount(0);
                    router.push(item.href);
                  }}
                >
                  <Icon />
                </Button>

                {/* Notification badge — Beneficiários only */}
                {item.href === "/issuer/beneficiarios" && badgeCount > 0 && (
                  <div style={{
                    position: "absolute", top: 2, right: 2,
                    minWidth: 16, height: 16, borderRadius: 999,
                    background: "#EF4444", border: "2px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 800, color: "#fff",
                    lineHeight: 1, padding: "0 3px",
                    pointerEvents: "none",
                  }}>
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </div>
                )}

                {/* Hover label tooltip */}
                {tooltip === item.label && (
                  <div
                    role="tooltip"
                    style={{
                      position: "absolute",
                      left: "calc(100% + 10px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "var(--v-nav-background)",
                      color: "var(--v-nav-foreground)",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      zIndex: 100,
                      boxShadow: "0 4px 16px rgba(0,0,0,.18)",
                      pointerEvents: "none",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Right column ──────────────────────────────────────────────── */}
      <div className="v-flex v-flex-col v-flex-1 v-min-w-0">

        {/* Top navigation bar */}
        <Nav>
          <div className="v-flex v-align-items-center" style={{ gap: "14px" }}>
            <BCRLogo height={30} />
            <span style={{ width: 1, height: 26, background: "rgba(0,0,0,.14)", flexShrink: 0 }} />
            <NavAppName style={{ margin: 0 }}>Portal Adm Universidad</NavAppName>
          </div>

          {/* Removed Avatar VP per user request — just help + sign-out */}
          <div style={{ marginLeft: "auto", marginRight: "84px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Button
              className="v-action-stateless"
              iconButton
              aria-label="Sair"
              onClick={handleLogout}
            >
              <VisaSignOutLow />
            </Button>
          </div>
        </Nav>

        {/* Page content — light neutral background */}
        <main
          className="v-flex-1 v-py-8 v-px-10"
          style={{ background: "var(--palette-default-background, #f5f7fa)" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {children}
          </div>
        </main>

        <Footer
          className="v-flex v-align-items-center v-justify-between"
          style={{ gap: "40px", padding: "20px 40px", borderTop: "1px solid rgba(0,0,0,.06)" }}
        >
          {/* Left: logos + copyright — single aligned row */}
          <div className="v-flex v-align-items-center" style={{ gap: "14px" }}>
            <BCRLogo height={22} />
            <span style={{ width: 1, height: 18, background: "rgba(0,0,0,.12)", flexShrink: 0 }} />
            <VisaLogo style={{ height: "14px", width: "auto" }} aria-label="Visa" />
            <span style={{ width: 1, height: 18, background: "rgba(0,0,0,.12)", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", lineHeight: 1.4, color: "#8A94A6", fontWeight: 400 }}>
              © 2025–2026 Visa · Banco de Costa Rica. Todos los derechos reservados.
            </span>
          </div>

          {/* Center: links */}
          <div className="v-flex v-align-items-center" style={{ gap: "32px" }}>
            <Link href="#" noUnderline style={{ fontSize: "13px", fontWeight: 500, color: "#3A4358" }}>
              Contacto
            </Link>
            <Link href="#" noUnderline style={{ fontSize: "13px", fontWeight: 500, color: "#3A4358" }}>
              Términos y Condiciones
            </Link>
          </div>

          {/* Right: language selector */}
          <div className="v-flex v-align-items-center" style={{ gap: "8px", color: "#3A4358" }}>
            <VisaLanguageLow style={{ width: "18px", height: "18px" }} />
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#3A4358" }}>
              Español (Costa Rica)
            </span>
          </div>
        </Footer>
      </div>
    </div>
  );
}
