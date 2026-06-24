"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ContentCard, ContentCardBody, Typography,
  InputContainer, Input,
} from "@visa/nova-react";
import {
  VisaStoreOpenLow, VisaStoreClosedLow, VisaCheckmarkLow,
  VisaSearchLow, VisaMapLocationLow,
} from "@visa/nova-icons-react";
import { BECA_MCC_WHITELIST } from "@/lib/config";

const GREEN = "#16834A";
const RED = "#CE1126";
const AMBER = "#B26A00";

const MERCHANTS = [
  { id: "m001", name: "Super La U",            sede: "San Pedro",   mcc: "5411", owner: "Comercial La U S.A.",        cedula: "3-101-234567", status: "active" as const,  volume: "₡12.400.000/mes" },
  { id: "m002", name: "Librería Universal",    sede: "San Pedro",   mcc: "5942", owner: "Librería Universal S.A.",    cedula: "3-101-345678", status: "active" as const,  volume: "₡3.200.000/mes"  },
  { id: "m003", name: "Soda La Faculty",       sede: "Rodrigo Facio", mcc: "5811", owner: "Coop. Estudiantil R.L.",   cedula: "3-004-456789", status: "active" as const,  volume: "₡5.800.000/mes"  },
  { id: "m004", name: "Farmacia Sucre",        sede: "San Pedro",   mcc: "5912", owner: "Farmacias Sucre Ltda.",      cedula: "3-101-567890", status: "active" as const,  volume: "₡4.100.000/mes"  },
  { id: "m005", name: "Mega Super Cartago",    sede: "Cartago",     mcc: "5411", owner: "Mega Super Ltda.",           cedula: "3-101-678901", status: "active" as const,  volume: "₡28.700.000/mes" },
  { id: "m006", name: "TecnoStore CR",         sede: "San Pedro",   mcc: "5732", owner: "TecnoStore CR Ltda.",        cedula: "3-101-789012", status: "blocked" as const, volume: "—"               },
  { id: "m007", name: "Papelería El Estudiante", sede: "San Ramón", mcc: "5111", owner: "Ana Barboza Rojas",         cedula: "2-0345-0678",  status: "pending" as const, volume: "En análisis"     },
  { id: "m008", name: "Pulpería del Campus",   sede: "Liberia",     mcc: "5411", owner: "Pedro Soto Núñez",           cedula: "5-0234-0567",  status: "active" as const,  volume: "₡6.500.000/mes"  },
];

const statusConfig = {
  active:  { label: "Activo",     fg: "#2C6849", bg: "#d6f2c4" },
  blocked: { label: "Bloqueado",  fg: "#AD2929", bg: "#ffd6e9" },
  pending: { label: "Pendiente",  fg: "#875903", bg: "#ffef99" },
};

function Pill({ fg, bg, children }: { fg: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 700, lineHeight: 1,
      color: fg, background: bg, padding: "4px 9px", borderRadius: 999,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

export default function EstablecimientosPage() {
  const [search, setSearch] = useState("");
  const filtered = MERCHANTS.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.sede.toLowerCase().includes(search.toLowerCase())
  );

  const active = MERCHANTS.filter((m) => m.status === "active").length;
  const blocked = MERCHANTS.filter((m) => m.status === "blocked").length;
  const pending = MERCHANTS.filter((m) => m.status === "pending").length;

  return (
    <div className="v-flex v-flex-col v-gap-8">
      <div>
        <Typography tag="h1" className="v-typography-headline-1">Comercios Afiliados</Typography>
        <Typography className="v-typography-subtitle-2">Gestión de la red de aceptación de la beca Visa · whitelist de MCC</Typography>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">Activos</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ color: GREEN, marginTop: 4 }}>{active}</Typography>
          </ContentCardBody>
        </ContentCard>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">Bloqueados</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ color: RED, marginTop: 4 }}>{blocked}</Typography>
          </ContentCardBody>
        </ContentCard>
        <ContentCard style={{ flex: "1 0 0" }}>
          <ContentCardBody>
            <Typography className="v-typography-label v-typography-color-subtle">En análisis</Typography>
            <Typography tag="p" className="v-typography-headline-1" style={{ color: AMBER, marginTop: 4 }}>{pending}</Typography>
          </ContentCardBody>
        </ContentCard>
      </div>

      {/* MCC whitelist */}
      <ContentCard>
        <ContentCardBody>
          <Typography className="v-typography-body-2-bold" style={{ marginBottom: 12 }}>MCCs autorizados por el programa</Typography>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BECA_MCC_WHITELIST.map((mcc) => (
              <div key={mcc.code} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(22,131,74,.08)", border: "1px solid rgba(22,131,74,.18)",
                borderRadius: 999, padding: "6px 12px",
              }}>
                <VisaCheckmarkLow style={{ width: 13, height: 13, color: GREEN }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>{mcc.code}</span>
                <Typography className="v-typography-label v-typography-color-subtle">· {mcc.label}</Typography>
              </div>
            ))}
          </div>
        </ContentCardBody>
      </ContentCard>

      {/* Search */}
      <InputContainer style={{ maxWidth: 360 }}>
        <VisaSearchLow style={{ color: "#94a3b8" }} />
        <Input
          aria-label="Buscar comercio"
          placeholder="Buscar por nombre o sede..."
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        />
      </InputContainer>

      {/* Merchants */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((merchant, i) => {
          const mccInfo = BECA_MCC_WHITELIST.find((m) => m.code === merchant.mcc);
          const isWhitelisted = !!mccInfo;
          const stat = statusConfig[merchant.status];
          const blockedRow = merchant.status === "blocked";

          return (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ContentCard style={blockedRow ? { borderLeft: `4px solid ${RED}` } : undefined}>
                <ContentCardBody>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: merchant.status === "active" ? "rgba(22,131,74,.1)"
                        : merchant.status === "blocked" ? "#ffd6e9" : "#ffef99",
                    }}>
                      {merchant.status === "blocked"
                        ? <VisaStoreClosedLow style={{ color: RED }} />
                        : <VisaStoreOpenLow style={{ color: merchant.status === "active" ? GREEN : AMBER }} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <Typography className="v-typography-body-2-bold">{merchant.name}</Typography>
                        <Pill fg={stat.fg} bg={stat.bg}>{stat.label}</Pill>
                        {!isWhitelisted && <Pill fg="#AD2929" bg="#ffd6e9">MCC no autorizado</Pill>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <VisaMapLocationLow style={{ width: 13, height: 13, color: "#94a3b8" }} />
                          <Typography className="v-typography-label v-typography-color-subtle">{merchant.sede}</Typography>
                        </span>
                        <Typography className="v-typography-label v-typography-color-subtle">
                          MCC {merchant.mcc} · {mccInfo?.label || "No afiliado"}
                        </Typography>
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8" }}>{merchant.cedula}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography className="v-typography-body-2-bold" style={{ whiteSpace: "nowrap" }}>{merchant.volume}</Typography>
                      <Typography className="v-typography-label v-typography-color-subtle">{merchant.owner}</Typography>
                    </div>
                  </div>
                </ContentCardBody>
              </ContentCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
