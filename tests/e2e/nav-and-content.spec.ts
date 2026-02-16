import { test, expect } from '@playwright/test';

const sections = ['about', 'skills', 'experience', 'projects', 'contact'];

test.beforeEach(async ({ page }) => {
  // Mock backend responses and pre-set token
  await page.route('http://localhost:3001/api/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        profile: { name: 'Alice Doe', title: 'Software Engineer', bio: 'Alice is a versatile engineer.', avatarUrl: '', location: 'Seattle, USA' },
        skills: [
          { category: 'Frontend', items: ['React', 'TypeScript', 'Vite'] },
          { category: 'Backend', items: ['Node.js', 'Express'] },
          { category: 'Testing', items: ['Playwright', 'Jest'] },
        ],
        experience: [
          { role: 'Software Engineer', company: 'Acme Corp', startDate: '2023-01', endDate: 'Present', highlights: ['Built X using Y.', 'Improved Z by 20%.'] },
        ],
        projects: [
          { name: 'Portfolio POC', description: 'A simple portfolio app.', techStack: ['React','Node.js'], liveUrl: 'https://example.com', sourceUrl: 'https://github.com/user/repo' }
        ],
        contact: { email: 'alice@example.com', github: 'https://github.com/alice', linkedin: 'https://linkedin.com/in/alice' }
      }),
    });
  });
  const dummyToken = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600 })) + '.sig';
  await page.addInitScript((t) => localStorage.setItem('token', t), dummyToken);
  await page.goto('/');
  await page.waitForSelector('#about');
});

for (const id of sections) {
  test(`nav link scrolls to #${id}`, async ({ page }) => {
    await page.goto('/');
    const link = page.locator(`[data-testid="nav-${id}"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const section = page.locator(`#${id}`);
    await expect(section).toBeVisible();
  });
}

test('projects render with correct attributes and links', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-testid="project-card"]');
  await expect(cards).toHaveCount(1);
  const first = cards.first();
  await expect(first).toHaveAttribute('data-project-name', 'Portfolio POC');
  const sourceLink = first.locator('a', { hasText: 'Source Code' });
  await expect(sourceLink).toHaveAttribute('href', 'https://github.com/user/repo');
});

test('contact email uses mailto:', async ({ page }) => {
  await page.goto('/');
  const emailLink = page.locator('[data-testid="section-contact"] a').first();
  await expect(emailLink).toHaveAttribute('href', /mailto:/);
});
