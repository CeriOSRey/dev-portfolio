import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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

  const validUsers: Record<string, string> = {
    'alice@example.com': 'password123',
    'bob@example.com': 'password123',
  };

  const ok = validUsers[email] && validUsers[email] === password;
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.status(200).json({ token });
}
