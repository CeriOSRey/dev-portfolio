import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile } from './userData';

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

  let email = null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };
    email = decoded.email;
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  if (email) {
    const userProfile = getUserProfile(email);
    if (userProfile) {
      res.status(200).json(userProfile);
      return;
    }
  }

  // Default fallback profile
  res.status(200).json({
    profile: {
      name: 'First Last',
      title: 'Software Engineer',
      bio: 'Short professional summary.',
      avatarUrl: '',
      location: 'City, Country'
    },
    skills: [
      { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] },
      { category: 'Backend', items: ['Node.js', 'Express'] },
      { category: 'Testing', items: ['Playwright', 'Jest'] }
    ],
    experience: [
      {
        role: 'Software Engineer',
        company: 'Company Name',
        startDate: '2022-01',
        endDate: 'Present',
        highlights: ['Built X using Y.', 'Improved Z by N%.']
      }
    ],
    projects: [
      {
        name: 'Project Name',
        description: 'Short description of the project.',
        techStack: ['React', 'Node.js'],
        liveUrl: 'https://example.com',
        sourceUrl: 'https://github.com/user/repo'
      }
    ],
    contact: {
      email: 'you@example.com',
      github: 'https://github.com/username',
      linkedin: 'https://linkedin.com/in/username'
    }
  });
}
