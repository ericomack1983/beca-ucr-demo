"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography, Divider, Button, Checkbox, Input, InputContainer, Select,
  Table, TableWrapper, Thead, Tbody, Tr, Th, Td,
} from "@visa/nova-react";
import {
  VisaFileDownloadLow, VisaFileUploadLow, VisaAddLow,
  VisaSearchLow, VisaSuccessLow, VisaChevronUpLow, VisaChevronDownLow,
  VisaChevronLeftLow, VisaChevronRightLow,
} from "@visa/nova-icons-react";
import { PROGRAMS } from "@/lib/mock-programs";

const VISA_BLUE = "#1434CB";
const VISA_NAVY = "#1A1F71";
const GREEN = "#16834A";

const TYPE_OPTIONS = ["Debit", "Prepaid"];
const CARD_TYPE_LABELS: Record<string, string> = { Debit: "Débito", Prepaid: "Prepago" };
const PAGE_SIZES = [10, 25, 50];

type SortKey = "name" | "timezone";

function SortIcon() {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0, marginLeft: 6, color: VISA_BLUE }}>
      <VisaChevronUpLow style={{ width: 11, height: 11, marginBottom: -3 }} />
      <VisaChevronDownLow style={{ width: 11, height: 11, marginTop: -3 }} />
    </span>
  );
}

export default function ProgramManagementPage() {
  const router = useRouter();

  // search / filter — committed on "Search"
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [query, setQuery] = useState({ text: "", type: "" });

  // sort
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  // selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = PROGRAMS.filter((p) => {
      const t = query.text.trim().toLowerCase();
      const matchesText = !t || p.name.toLowerCase().includes(t) || p.id.includes(t);
      const matchesType = !query.type || p.type === query.type;
      return matchesText && matchesType;
    });
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = a[sort.key].localeCompare(b[sort.key]);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [query, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const applySearch = () => { setQuery({ text: searchText, type: filterType }); setPage(1); };
  const reset = () => { setSearchText(""); setFilterType(""); setQuery({ text: "", type: "" }); setSort(null); setPage(1); };

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((p) => selected.has(p.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageRows.forEach((p) => next.delete(p.id));
      else pageRows.forEach((p) => next.add(p.id));
      return next;
    });
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="v-flex v-flex-col v-gap-6">
      {/* Header */}
      <div className="v-flex v-align-items-start v-justify-between v-gap-4" style={{ flexWrap: "wrap" }}>
        <div>
          <Typography tag="h1" style={{ fontSize: 28, fontWeight: 600, color: VISA_NAVY }}>Programas</Typography>
          <Typography style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>
            Cree y administre los programas de esta organización
          </Typography>
        </div>
        <div className="v-flex v-align-items-center v-gap-3 v-flex-shrink-0" style={{ flexWrap: "wrap", marginLeft: "auto", justifyContent: "flex-end" }}>
          <Button colorScheme="secondary" style={btnContent}><VisaFileDownloadLow />Descargar</Button>
          <Button style={btnContent}><VisaFileUploadLow />Cargar programa</Button>
          <Button colorScheme="secondary" style={btnContent} onClick={() => router.push("/issuer/program-management/create")}>
            <VisaAddLow />Crear programa
          </Button>
        </div>
      </div>

      <Divider />

      {/* Search + filter row */}
      <div className="v-flex v-align-items-end v-gap-4" style={{ flexWrap: "wrap" }}>
        <div className="v-flex v-flex-col" style={{ gap: 6, flex: "1 1 320px", maxWidth: 420 }}>
          <Typography style={{ fontSize: 13, color: "#64748B" }}>Buscar</Typography>
          <InputContainer>
            <Input
              type="text"
              placeholder="Buscar por nombre, ID o BIN"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
            <Button iconButton colorScheme="tertiary" aria-label="Buscar" onClick={applySearch}>
              <VisaSearchLow />
            </Button>
          </InputContainer>
        </div>

        <div className="v-flex v-flex-col" style={{ gap: 6, flex: "1 1 240px", maxWidth: 320 }}>
          <Typography style={{ fontSize: 13, color: "#64748B" }}>Filtrar por</Typography>
          <InputContainer>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Tipo de programa">
              <option value="">Tipo de programa</option>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{CARD_TYPE_LABELS[t] ?? t}</option>)}
            </Select>
          </InputContainer>
        </div>

        <div className="v-flex v-align-items-center v-gap-3">
          <Button onClick={applySearch}>Buscar</Button>
          <Button colorScheme="secondary" onClick={reset}>Restablecer</Button>
        </div>
      </div>

      {/* Table */}
      <TableWrapper>
        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: 48 }}>
                <Checkbox aria-label="Seleccionar todo" checked={allOnPageSelected} onChange={toggleAll} />
              </Th>
              <Th>
                <button onClick={() => toggleSort("name")} style={sortBtn}>Nombre del programa <SortIcon /></button>
              </Th>
              <Th>N.º de ID</Th>
              <Th>Tipo de tarjeta</Th>
              <Th>País</Th>
              <Th>Moneda</Th>
              <Th>
                <button onClick={() => toggleSort("timezone")} style={sortBtn}>Zona horaria <SortIcon /></button>
              </Th>
              <Th style={{ textAlign: "right" }}>Estado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map((p) => (
              <Tr key={p.id}>
                <Td><Checkbox aria-label={`Seleccionar ${p.name}`} checked={selected.has(p.id)} onChange={() => toggleRow(p.id)} /></Td>
                <Td><Typography style={{ fontWeight: 500, color: "#1E293B" }}>{p.name}</Typography></Td>
                <Td>{p.id}</Td>
                <Td>{CARD_TYPE_LABELS[p.type] ?? p.type}</Td>
                <Td>{p.country}</Td>
                <Td>{p.currency}</Td>
                <Td>{p.timezone}</Td>
                <Td style={{ textAlign: "right" }}>
                  <span style={{ display: "inline-flex", color: p.active ? GREEN : "#CBD5E1" }} title={p.active ? "Activo" : "Inactivo"}>
                    <VisaSuccessLow />
                  </span>
                </Td>
              </Tr>
            ))}
            {pageRows.length === 0 && (
              <Tr>
                <Td colSpan={8} style={{ textAlign: "center", color: "#94A3B8", padding: "32px 0" }}>
                  Ningún programa coincide con su búsqueda.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableWrapper>

      {/* Pagination */}
      <div className="v-flex v-align-items-center v-justify-between v-gap-4" style={{ flexWrap: "wrap" }}>
        <div className="v-flex v-align-items-center v-gap-3">
          <Typography style={{ fontSize: 13, color: "#64748B" }}>Elementos por página</Typography>
          <div style={{ width: 84 }}>
            <InputContainer>
              <Select
                aria-label="Elementos por página"
                value={String(pageSize)}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </InputContainer>
          </div>
          <Typography style={{ fontSize: 13, color: "#64748B" }}>
            Mostrando {total === 0 ? 0 : start + 1} - {Math.min(start + pageSize, total)} de {total}
          </Typography>
        </div>

        <div className="v-flex v-align-items-center v-gap-2">
          <Button iconButton colorScheme="tertiary" buttonSize="small" aria-label="Página anterior" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <VisaChevronLeftLow />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              buttonSize="small"
              colorScheme={n === safePage ? "primary" : "tertiary"}
              aria-label={`Página ${n}`}
              aria-current={n === safePage ? "page" : undefined}
              onClick={() => setPage(n)}
              style={{ minWidth: 36 }}
            >
              {n}
            </Button>
          ))}
          <Button iconButton colorScheme="tertiary" buttonSize="small" aria-label="Página siguiente" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <VisaChevronRightLow />
          </Button>
        </div>
      </div>
    </div>
  );
}

const btnContent: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
};

const sortBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", background: "none", border: "none",
  padding: 0, cursor: "pointer", font: "inherit", color: "inherit", fontWeight: 600,
};
