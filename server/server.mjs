import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const PORT = process.env.PORT || 3001;

const app = express();
// Allow all origins in local dev to handle dynamic Vite port
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let db; // sqlite connection
async function initDb() {
  db = await open({ filename: './server/app.db', driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      title TEXT,
      bio TEXT,
      avatarUrl TEXT,
      location TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      item TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT,
      company TEXT,
      startDate TEXT,
      endDate TEXT,
      highlight TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT,
      description TEXT,
      tech TEXT,
      liveUrl TEXT,
      sourceUrl TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS contacts (
      user_id INTEGER PRIMARY KEY,
      email TEXT,
      github TEXT,
      linkedin TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  await autoSeed();
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const user = await db.get('SELECT * FROM users WHERE email = ?', email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

app.get('/api/me', authMiddleware, async (req, res) => {
  const id = req.user.id;
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', id);
  const profile = await db.get('SELECT title, bio, avatarUrl, location FROM profiles WHERE user_id = ?', id);
  const skillsRows = await db.all('SELECT category, item FROM skills WHERE user_id = ?', id);
  const skills = Object.values(
    skillsRows.reduce((acc, row) => {
      if (!acc[row.category]) acc[row.category] = { category: row.category, items: [] };
      acc[row.category].items.push(row.item);
      return acc;
    }, {})
  );
  const experienceRows = await db.all('SELECT role, company, startDate, endDate, highlight FROM experience WHERE user_id = ?', id);
  const experience = [];
  for (const row of experienceRows) {
    let exp = experience.find(e => e.role === row.role && e.company === row.company && e.startDate === row.startDate && e.endDate === row.endDate);
    if (!exp) {
      exp = { role: row.role, company: row.company, startDate: row.startDate, endDate: row.endDate, highlights: [] };
      experience.push(exp);
    }
    exp.highlights.push(row.highlight);
  }
  const projectRows = await db.all('SELECT name, description, tech, liveUrl, sourceUrl FROM projects WHERE user_id = ?', id);
  const projects = projectRows.map(r => ({ name: r.name, description: r.description, techStack: r.tech.split(','), liveUrl: r.liveUrl, sourceUrl: r.sourceUrl }));
  const contact = await db.get('SELECT email, github, linkedin FROM contacts WHERE user_id = ?', id);
  res.json({
    profile: { name: user.name, title: profile?.title, bio: profile?.bio, avatarUrl: profile?.avatarUrl, location: profile?.location },
    skills,
    experience,
    projects,
    contact,
  });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
});

async function autoSeed() {
  const row = await db.get('SELECT COUNT(*) as c FROM users');
  if (row && row.c > 0) return; // already seeded

  const passwordHash = await bcrypt.hash('password123', 10);
  const { lastID: aliceId } = await db.run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', 'alice@example.com', passwordHash, 'Alice Doe');
  await db.run('INSERT INTO profiles (user_id, title, bio, avatarUrl, location) VALUES (?, ?, ?, ?, ?)', aliceId, 'Software Engineer', 'Alice is a versatile engineer.', '/images/alice.svg', 'Seattle, USA');
  const aliceSkills = [
    ['Frontend', 'React'], ['Frontend', 'TypeScript'], ['Frontend', 'Vite'],
    ['Backend', 'Node.js'], ['Backend', 'Express'],
    ['Testing', 'Playwright'], ['Testing', 'Jest']
  ];
  for (const [category, item] of aliceSkills) {
    await db.run('INSERT INTO skills (user_id, category, item) VALUES (?, ?, ?)', aliceId, category, item);
  }
  const aliceExp = [
    ['Software Engineer', 'Acme Corp', '2023-01', 'Present', 'Built X using Y.'],
    ['Software Engineer', 'Acme Corp', '2023-01', 'Present', 'Improved Z by 20%.']
  ];
  for (const [role, company, startDate, endDate, highlight] of aliceExp) {
    await db.run('INSERT INTO experience (user_id, role, company, startDate, endDate, highlight) VALUES (?, ?, ?, ?, ?, ?)', aliceId, role, company, startDate, endDate, highlight);
  }
  const aliceProjects = [
    ['Portfolio POC', 'A simple portfolio app.', 'React,Node.js', 'https://example.com', 'https://github.com/user/repo']
  ];
  for (const [name, description, tech, liveUrl, sourceUrl] of aliceProjects) {
    await db.run('INSERT INTO projects (user_id, name, description, tech, liveUrl, sourceUrl) VALUES (?, ?, ?, ?, ?, ?)', aliceId, name, description, tech, liveUrl, sourceUrl);
  }
  await db.run('INSERT INTO contacts (user_id, email, github, linkedin) VALUES (?, ?, ?, ?)', aliceId, 'alice@example.com', 'https://github.com/alice', 'https://linkedin.com/in/alice');

  const passwordHashBob = await bcrypt.hash('password123', 10);
  const { lastID: bobId } = await db.run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', 'bob@example.com', passwordHashBob, 'Bob Roe');
  await db.run('INSERT INTO profiles (user_id, title, bio, avatarUrl, location) VALUES (?, ?, ?, ?, ?)', bobId, 'Full-Stack Developer', 'Bob focuses on robust backends and clean UIs.', '/images/bob.svg', 'Austin, USA');
  const bobSkills = [
    ['Frontend', 'React'], ['Frontend', 'Tailwind CSS'],
    ['Backend', 'Node.js'], ['Backend', 'Express'], ['Backend', 'SQLite'],
    ['Testing', 'Playwright']
  ];
  for (const [category, item] of bobSkills) {
    await db.run('INSERT INTO skills (user_id, category, item) VALUES (?, ?, ?)', bobId, category, item);
  }
  const bobExp = [
    ['Full-Stack Developer', 'Beta Inc', '2022-06', 'Present', 'Delivered performant web apps.'],
    ['Full-Stack Developer', 'Beta Inc', '2022-06', 'Present', 'Implemented CI/CD with tests.']
  ];
  for (const [role, company, startDate, endDate, highlight] of bobExp) {
    await db.run('INSERT INTO experience (user_id, role, company, startDate, endDate, highlight) VALUES (?, ?, ?, ?, ?, ?)', bobId, role, company, startDate, endDate, highlight);
  }
  const bobProjects = [
    ['API Service', 'Lightweight JSON API with auth.', 'Node.js,Express', 'https://example.com/api', 'https://github.com/user/api-service']
  ];
  for (const [name, description, tech, liveUrl, sourceUrl] of bobProjects) {
    await db.run('INSERT INTO projects (user_id, name, description, tech, liveUrl, sourceUrl) VALUES (?, ?, ?, ?, ?, ?)', bobId, name, description, tech, liveUrl, sourceUrl);
  }
  await db.run('INSERT INTO contacts (user_id, email, github, linkedin) VALUES (?, ?, ?, ?)', bobId, 'bob@example.com', 'https://github.com/bob', 'https://linkedin.com/in/bob');

  console.log('Auto-seeded demo users:');
  console.log(' - alice@example.com / password123');
  console.log(' - bob@example.com / password123');
}
