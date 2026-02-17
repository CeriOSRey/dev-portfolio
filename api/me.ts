import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import data from '../src/data.json';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  res.status(200).json(data);
}
