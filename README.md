
# Developer Portfolio & Projects Showcase (POC)

Single-page React + Vite + Tailwind app showcasing a developer profile, skills, experience, projects, and contact info. Built for reliable Playwright automation with stable selectors.

**Now deployed on Vercel:**

[dev-portfolio-enm64mahv-reycerio-1987s-projects.vercel.app](https://dev-portfolio-enm64mahv-reycerio-1987s-projects.vercel.app/)

---

**Recent changes:**
- Migrated backend API from Express server to [Next.js API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) (Vercel serverless functions in `/api`).
- Removed the custom Express backend server; all authentication and profile APIs are now handled by serverless functions.
- Simplified local development: no need to run a separate backend server.
- Updated deployment to Vercel for seamless full-stack hosting.

---

## Features
- Sticky navbar with smooth-scrolling anchors (`About`, `Skills`, `Experience`, `Projects`, `Contact`)
- Responsive sections with Tailwind CSS
- User authentication (login/signup) with JWT tokens
- Dynamic profile creation and display
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
npm run dev
# Open http://localhost:5173
```


Demo login:

- Alice: `alice@example.com` / `password123`
- Bob: `bob@example.com` / `password123`
- Or create a new account via the "Sign Up" tab

User data is now hardcoded in the API route for demo purposes. No database setup required.


---

## Architecture

- **Frontend:** React + Vite + Tailwind CSS
- **API:** Next.js API routes (TypeScript, serverless, in `/api`)
- **Auth:** JWT-based, demo users only
- **Deployment:** [Vercel](https://vercel.com/)


---

### Lint & Format

```powershell
npm run lint
npm run format
```


### Build + Preview

```powershell
npm run build
npm run preview
# Open http://localhost:4173
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

- Create new users via the signup form or update existing user data in `/api/userData.ts`.
- Add more projects by extending the user objects in `/api/userData.ts`.
- Tailwind theme colors set in `tailwind.config.cjs`.

Use the dropdown on `/login` to auto-fill demo credentials, or try the "Sign Up" tab to create a new account.

