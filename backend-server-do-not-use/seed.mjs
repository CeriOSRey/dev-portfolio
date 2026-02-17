import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
// This script seeds the SQLite database with demo users and their associated data.
async function seed() {
  const db = await open({ filename: './server/app.db', driver: sqlite3.Database });
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
  await db.exec('DELETE FROM users; DELETE FROM profiles; DELETE FROM skills; DELETE FROM experience; DELETE FROM projects; DELETE FROM contacts;');

  const passwordHash = await bcrypt.hash('password123', 10);
  const { lastID: userId } = await db.run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', 'alice@example.com', passwordHash, 'Alice Doe');

  await db.run('INSERT INTO profiles (user_id, title, bio, avatarUrl, location) VALUES (?, ?, ?, ?, ?)', userId, 'Software Engineer', 'Alice is a versatile engineer.', '/images/alice.svg', 'Seattle, USA');

  const skills = [
    ['Frontend', 'React'], ['Frontend', 'TypeScript'], ['Frontend', 'Vite'],
    ['Backend', 'Node.js'], ['Backend', 'Express'],
    ['Testing', 'Playwright'], ['Testing', 'Jest']
  ];
  for (const [category, item] of skills) {
    await db.run('INSERT INTO skills (user_id, category, item) VALUES (?, ?, ?)', userId, category, item);
  }

  const exp = [
    ['Software Engineer', 'Acme Corp', '2023-01', 'Present', 'Built X using Y.'],
    ['Software Engineer', 'Acme Corp', '2023-01', 'Present', 'Improved Z by 20%.']
  ];
  for (const [role, company, startDate, endDate, highlight] of exp) {
    await db.run('INSERT INTO experience (user_id, role, company, startDate, endDate, highlight) VALUES (?, ?, ?, ?, ?, ?)', userId, role, company, startDate, endDate, highlight);
  }

  const projects = [
    ['Portfolio POC', 'A simple portfolio app.', 'React,Node.js', 'https://example.com', 'https://github.com/user/repo']
  ];
  for (const [name, description, tech, liveUrl, sourceUrl] of projects) {
    await db.run('INSERT INTO projects (user_id, name, description, tech, liveUrl, sourceUrl) VALUES (?, ?, ?, ?, ?, ?)', userId, name, description, tech, liveUrl, sourceUrl);
  }

  await db.run('INSERT INTO contacts (user_id, email, github, linkedin) VALUES (?, ?, ?, ?)', userId, 'alice@example.com', 'https://github.com/alice', 'https://linkedin.com/in/alice');

  // Second demo user: Bob
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

  console.log('Seed complete for:');
  console.log(' - alice@example.com / password123');
  console.log(' - bob@example.com / password123');
}

seed();
