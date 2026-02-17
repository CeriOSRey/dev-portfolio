import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

declare global {
  var registeredUsers: Record<string, any>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Shared user storage (in-memory, resets on deployment)
const users: Record<string, { email: string; password: string }> = {
  'alice@example.com': {
    email: 'alice@example.com',
    password: 'password123'
  },
  'bob@example.com': {
    email: 'bob@example.com',
    password: 'password123'
  }
};

// Global variable to persist new users across function calls
// Note: This will reset on Vercel cold starts
if (!global.registeredUsers) {
  global.registeredUsers = {};
}

function getUser(email: string) {
  return users[email] || global.registeredUsers[email] || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  const user = getUser(email);
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.status(200).json({ token });
}
