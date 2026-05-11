# Becas UCR — Portal Demo

Demo web app simulating the scholarship (Beca) onboarding process for the **Universidad de Costa Rica**. The risk scoring engine is owned by a separate **Issuer** entity, visually and architecturally distinct from the UCR portal.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Demo Accounts

| Email | Password | Status |
|-------|----------|--------|
| `maria@ucr.ac.cr` | `demo123` | Application in progress (Step 4) |
| `carlos@ucr.ac.cr` | `demo123` | Fully approved |
| `ana@ucr.ac.cr` | `demo123` | New, no applications |

## Architecture

### UCR ↔ Issuer Boundary

The app deliberately separates two entities:

| Concern | UCR (navy palette) | Issuer (amber/dark palette) |
|---------|---------------------|------------------------------|
| Brand | `#0B2A5B` navy, shield logo | `#F59E0B` amber, geometric logo |
| Routes | `/`, `/login`, `/dashboard/*` | `/issuer` |
| Messaging | Oficina de Becas UCR sender | "Entidad externa" badge, read-only |
| Risk scoring | Displays Issuer results | Owns the algorithm |

The `scoreApplicant()` function in `lib/risk-engine.ts` is called via the onboarding flow (Step 4) — simulating an API call to an external service. In production, replace the direct import with a `fetch()` to `https://api.issuer.cr/v1/score`.

### Swapping the Admin URL

In `lib/config.ts`:
```ts
export const ADMIN_PORTAL_URL = "https://admin.becas.ucr.ac.cr";
```
All "Portal Administrativo UCR ↗" links in the navbar, sidebar, and footer reference this constant.

### State Management

- **Auth session**: `localStorage` key `ucr_session` (`{ studentId, email, name, token }`)
- **Onboarding progress**: `localStorage` key `ucr_onboarding_progress` (auto-saved per step)
- **All other state**: in-memory modules (`lib/mock-*.ts`)

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — marketing |
| `/login` | Auth — split layout |
| `/registro` | Registration |
| `/dashboard` | Student dashboard — Mi Beca |
| `/dashboard/documentos` | Document management |
| `/dashboard/mensajes` | Inbox — UCR + Issuer messages |
| `/dashboard/calendario` | Application calendar |
| `/dashboard/perfil` | Student profile |
| `/dashboard/solicitud/nueva` | 5-step onboarding flow |
| `/issuer` | Issuer Risk Engine — live scoring demo |

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** v4 + custom design tokens
- **Framer Motion** — page transitions, scroll animations, count-up
- **Lucide React** — icons
- **Google Fonts**: Inter (UI) + Fraunces (editorial headings)
- No database — all state via `localStorage` + in-memory seed data
