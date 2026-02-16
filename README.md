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
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npm install
Pop-Location
```

### Quick Start
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npm install
npm run dev:all
# Frontend: http://localhost:5173  | Backend: http://127.0.0.1:3001
Pop-Location
```

Demo login:
- Alice: `alice@example.com` / `password123`
- Bob: `bob@example.com` / `password123`

The backend auto-seeds these users on first start; no manual setup needed.

#### Change Backend Port
If port `3001` is busy, override it via environment variable.

Windows PowerShell:
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
$env:PORT='3002'; npm run server
# Or for combined dev:
$env:PORT='3002'; npm run dev:all
Pop-Location
```
Notes:
- Frontend API calls target `http://127.0.0.1:<PORT>`; changing `PORT` adjusts backend only.
- Ensure any running instance on `3001` is stopped before starting a new one.

### Run Dev (manual split)
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npm run server
# In a second terminal:
npm run dev
# Open http://localhost:5173
Pop-Location
```

### Lint & Format
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npm run lint
npm run format
Pop-Location
```

### Build + Preview
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npm run build
npm run preview
Pop-Location
```

### Run E2E Tests
```powershell
Push-Location "c:\Users\reyce\OneDrive\Desktop\POC web app for Avanade AI Hackathon\dev-portfolio"
npx playwright install-deps  # optional on Windows
npx playwright install
npm run test:e2e
Pop-Location
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
