import { test, expect } from '@playwright/test';

test('redirects to login then UI login populates profile (mocked API)', async ({ page }) => {
  // Mock login and me endpoints
  await page.route('http://localhost:3001/api/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600 })) + '.sig' }),
    });
  });
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
  // Verify guard redirects to login, then perform UI login
  await page.goto('/');
  await page.waitForURL(/\/login$/);
  await page.fill('input[placeholder="you@example.com"]', 'alice@example.com');
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.click('button:has-text("Login")');
  await page.waitForSelector('#about');
  const name = page.locator('#about h1');
  await expect(name).toHaveText('Alice Doe');
});
