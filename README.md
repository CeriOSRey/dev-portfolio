# Developer Portfolio & Projects Showcase (POC)

Single-page React + Vite + Tailwind app showcasing a developer profile, skills, experience, projects, and contact info. Built for reliable Playwright automation with stable selectors.

## Features
- Sticky navbar with smooth-scrolling anchors (`About`, `Skills`, `Experience`, `Projects`, `Contact`)
- Responsive sections with Tailwind CSS
- Static JSON data (`src/data.json`)
- Stable `data-testid` attributes for E2E tests
- Playwright tests for nav scroll, project cards, links

## Get Started

### Prereqs
- Node.js 18+

### Install

```powershell
npm install
```

### Quick Start

```powershell
npm install
npm run dev:all
# Frontend: http://localhost:5173  | Backend: http://127.0.0.1:3001
```

Demo login:

- Alice: `alice@example.com` / `password123`
- Bob: `bob@example.com` / `password123`

The backend auto-seeds these users on first start; no manual setup needed.

#### Change Backend Port

If port `3001` is busy, override it via environment variable.

Windows PowerShell:

```powershell
$env:PORT='3002'; npm run server
# Or for combined dev:
$env:PORT='3002'; npm run dev:all
```
 
Notes:

- Frontend API calls target `http://127.0.0.1:<PORT>`; changing `PORT` adjusts backend only.
- Ensure any running instance on `3001` is stopped before starting a new one.

### Run Dev (manual split)

```powershell
npm run server
# In a second terminal:
npm run dev
# Open http://localhost:5173
```

### Lint & Format

```powershell
npm run lint
npm run format
```

### Build + Preview

```powershell
npm run build
npm run preview
```

### Run E2E Tests

```powershell
npx playwright install-deps  # optional on Windows
npx playwright install
npm run test:e2e
```

## CI

- GitHub Actions workflow at `.github/workflows/ci.yml` runs `npm run lint` and Playwright E2E on push/PR to `main`.
- Ensure your default branch is `main` or adjust the workflow trigger.

## Notes

- Update content in `src/data.json`.
- Backend server runs on `http://localhost:3001`. Set `JWT_SECRET` in env for production.
- Add more projects by extending `projects` array.
- Tailwind theme colors set in `tailwind.config.cjs`.

Use the dropdown on `/login` to auto-fill demo credentials.
