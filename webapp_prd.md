Here’s a clean spec you can drop into another prompt to recreate a similar POC app.

---

## 1. Overview

**App name:** Developer Portfolio & Projects Showcase  
**Purpose:** Single-page web app to present a developer's profile, skills, experience, and projects, with smooth navigation and clear sections for UI automation demos (Playwright). Includes user authentication and profile creation capabilities.  
**Scope:** Dynamic content with user registration, authentication, and personalized profiles. Users can sign up and create their own portfolios.

---

## 2. Core pages and sections

The app is a **single-page site** with scrollable sections and a sticky or always-visible navigation.

### 2.1 Global layout

- **Header / Navbar**
  - **Logo/Name:** Developer name or initials.
  - **Nav links:** Anchor links to sections: `About`, `Skills`, `Experience`, `Projects`, `Contact`.
  - **Behavior:** Clicking a nav item scrolls smoothly to the corresponding section.

- **Footer**
  - **Content:** Copyright text, social links (e.g., GitHub, LinkedIn), and email.
  - **Optional:** “Back to top” link.

---

### 2.2 About section

- **Content:**
  - Developer name.
  - Short title (e.g., “Software Engineer”, “Full-Stack Developer”).
  - 2–3 sentence bio.
  - Optional avatar/profile image.
- **Layout:** Text on one side, image on the other (responsive).

---

### 2.3 Skills section

- **Content:**
  - Grouped skills by category (e.g., `Frontend`, `Backend`, `Tools`, `Testing`).
  - Each skill displayed as a tag, pill, or list item.
- **Data example:**
  - Frontend: React, Next.js, TypeScript
  - Backend: Node.js, Express
  - Testing: Playwright, Jest

---

### 2.4 Experience section

- **Content:**
  - Timeline or list of roles.
  - Each item includes:
    - Role title
    - Company / Organization
    - Date range
    - Short bullet list of responsibilities/impact
- **Layout:** Vertical list or timeline.

---

### 2.5 Projects section

- **Content:**
  - Grid or list of project cards.
  - Each project card includes:
    - Project title
    - Short description (1–3 sentences)
    - Tech stack tags
    - Links: `Live Demo` (optional), `Source Code` (GitHub)
- **Behavior:**
  - Cards are clickable or have clearly labeled buttons.
  - Optional filter by tech or category (not required for POC).

---

### 2.6 Contact section

- **Content:**
  - Short text inviting contact.
  - Email address (clickable `mailto:` link).
  - Links to GitHub, LinkedIn, and/or other profiles.
- **No form** required for POC (keeps it simple).

---

## 3. Data model

For a POC, data can be static JSON or seeded from a local file/SQLite.

### 3.1 Example JSON structure

```json
{
  "profile": {
    "name": "First Last",
    "title": "Software Engineer",
    "bio": "Short professional summary.",
    "avatarUrl": "/images/avatar.png",
    "location": "City, Country"
  },
  "skills": [
    { "category": "Frontend", "items": ["React", "Next.js", "TypeScript"] },
    { "category": "Backend", "items": ["Node.js", "Express"] },
    { "category": "Testing", "items": ["Playwright", "Jest"] }
  ],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Company Name",
      "startDate": "2022-01",
      "endDate": "Present",
      "highlights": [
        "Built X using Y.",
        "Improved Z by N%."
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Short description of the project.",
      "techStack": ["React", "Node.js"],
      "liveUrl": "https://example.com",
      "sourceUrl": "https://github.com/user/repo"
    }
  ],
  "contact": {
    "email": "you@example.com",
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  }
}
```

---

## 4. Technical stack (suggested)

- **Frontend framework:** React or Next.js (SPA/MPA acceptable; POC can be static).
- **Styling:** Tailwind CSS or CSS modules (simple, responsive layout).
- **Data source:** Local JSON file or in-memory data; no external DB required.
- **Deployment target:** Static hosting (e.g., Vercel-style deployment).

You can adjust framework names in your prompt to match your preferred stack.

---

## 5. UI/UX requirements

- **Responsive design:** Works on mobile, tablet, and desktop.
- **Smooth scrolling:** For navigation between sections.
- **Consistent theming:** One primary color, one accent color, light or dark theme.
- **Hover states:** On buttons, links, and project cards.
- **Readable typography:** Clear hierarchy for headings, subheadings, and body text.

---

## 6. Testability for Playwright

- **Stable selectors:**
  - Each main section has an `id` and a `data-testid`, e.g.:
    - `#about`, `data-testid="section-about"`
    - `#skills`, `data-testid="section-skills"`
    - `#experience`, `data-testid="section-experience"`
    - `#projects`, `data-testid="section-projects"`
    - `#contact`, `data-testid="section-contact"`
  - Project cards: `data-testid="project-card"` with `data-project-name="Project Name"`.
  - Nav links: `data-testid="nav-about"`, `data-testid="nav-projects"`, etc.
- **Deterministic content:**
  - Static data so tests can assert exact text and counts.
- **Key flows to automate:**
  - Clicking each nav item scrolls to the correct section.
  - Project cards render with correct title, description, and links.
  - External links (GitHub, LinkedIn, project source) have correct `href`.
  - Contact email link uses `mailto:`.


## 7. Current Implementation Specs (as of 2026-02-15)

### 7.1 Summary
- Single-page portfolio built with React 18, TypeScript 5, Vite 5, and Tailwind CSS 3.
- Sections: About, Skills, Experience, Projects, Contact with sticky navbar and smooth scrolling.
- IntersectionObserver highlights active nav link while scrolling; URL hash is not modified for deterministic tests.
- Design refined to match a clean reference: gradient hero text, animated nav underline, card hover states, alternating section backgrounds, and dividers.

### 7.2 Frontend
- Routing: `react-router-dom` with guarded home route (`/`) and a `/login` page.
- Auth helpers: local token storage and expiry handling; logout clears token and redirects.
- Data prior to login: static `src/data.json` for layout; after login, data comes from backend `/api/me`.
- Stable selectors for Playwright:
  - Sections: `id` + `data-testid` (e.g., `#about`, `data-testid="section-about"`, similarly for `skills`, `experience`, `projects`, `contact`).
  - Nav links: `data-testid="nav-about"`, `nav-skills`, `nav-experience`, `nav-projects`, `nav-contact`.
  - Project cards: `data-testid="project-card"` with `data-project-name="<Name>"`.

### 7.3 Backend
- Stack: Next.js API routes (serverless functions) deployed on Vercel, JWT (`jsonwebtoken`) for authentication.
- Endpoints:
  - `POST /api/login` → returns JWT on valid credentials.
  - `POST /api/signup` → creates new user account with profile data and returns JWT.
  - `GET /api/me` → returns user-specific profile data (requires `Authorization: Bearer <token>`).
- Data storage: In-memory object store for demo purposes (resets on deployment).
- Authentication: JWT-based with 2-hour expiration.

### 7.4 Demo Data & User Management
- Pre-seeded users:
  - Alice: `alice@example.com` / `password123`
  - Bob: `bob@example.com` / `password123`
- User signup: New users can register with email, password, and complete profile information.
- Profile data: Each user has personalized `name`, `title`, `bio`, `location`, plus skills, experience, projects, and contact links.
- Storage: In-memory storage managed by `/api/userData.ts` module.

### 7.5 Testing
- Playwright E2E tests cover nav anchors, content rendering, and login/route guard.
- Tests mock `POST /api/login` and `GET /api/me` to ensure deterministic behavior and independence from backend availability.
- Playwright config launches client and server via `webServer`; supports dynamic client port.

### 7.6 CI / Tooling
- ESLint + Prettier configured with scripts.
- GitHub Actions workflow runs lint and E2E tests on push/PR to `main`.

### 7.7 Runbook
- Install deps: `npm install`
- Run development server: `npm run dev`
- Deploy to Vercel: `git push` (auto-deployment configured)
- Run E2E tests: `npm run test:e2e`
- Lint: `npm run lint` | Format: `npm run format`

### 7.8 Environment & Deployment
- Frontend: Vite on `5173` (falls back to `5174` if busy) in development.
- API: Next.js serverless functions deployed on Vercel.
- Production: [dev-portfolio-enm64mahv-reycerio-1987s-projects.vercel.app](https://dev-portfolio-enm64mahv-reycerio-1987s-projects.vercel.app/)
- Authentication: JWT-based with client-side token storage.
- Playwright uses a dynamic base URL; tests avoid URL hash mutations for stability.

### 7.9 Recent Updates (2026-02-17)
- **Architecture migration**: Moved from Express + SQLite to Next.js API routes (serverless).
- **User registration**: Added signup functionality with profile creation form.
- **Vercel deployment**: Full-stack deployment with auto-scaling serverless functions.
- **Simplified development**: No separate backend server needed; single `npm run dev` command.
- **In-memory storage**: Replaced database with in-memory user storage for demo purposes.

