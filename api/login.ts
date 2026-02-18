import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

declare global {
  var registeredUsers: Record<string, any>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Shared user storage (in-memory, resets on deployment)
// include full profile for built-in demo users so login can sign a token containing profile data
const users: Record<string, any> = {
  'alice@example.com': {
    email: 'alice@example.com',
    password: 'password123',
    profile: {
      name: 'Alice Example',
      title: 'Frontend Developer',
      bio: 'Passionate about building beautiful UIs.',
      avatarUrl: '',
      location: 'Wonderland'
    },
    skills: [
      { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] },
      { category: 'Testing', items: ['Playwright', 'Jest'] }
    ],
    experience: [
      {
        role: 'Frontend Developer',
        company: 'Wonderland Inc.',
        startDate: '2021-06',
        endDate: 'Present',
        highlights: ['Built a magical UI.', 'Improved performance by 50%.']
      }
    ],
    projects: [
      {
        name: 'Rabbit Hole',
        description: 'A project for tracking time.',
        techStack: ['React', 'Node.js'],
        liveUrl: 'https://rabbit.example.com',
        sourceUrl: 'https://github.com/alice/rabbit-hole'
      }
    ],
    contact: {
      email: 'alice@example.com',
      github: 'https://github.com/alice',
      linkedin: 'https://linkedin.com/in/alice'
    }
  },
  'bob@example.com': {
    email: 'bob@example.com',
    password: 'password123',
    profile: {
      name: 'Bob Example',
      title: 'Backend Developer',
      bio: 'Loves scalable systems and APIs.',
      avatarUrl: '',
      location: 'Builderland'
    },
    skills: [
      { category: 'Backend', items: ['Node.js', 'Express'] },
      { category: 'Testing', items: ['Jest'] }
    ],
    experience: [
      {
        role: 'Backend Developer',
        company: 'Builderland LLC',
        startDate: '2020-01',
        endDate: 'Present',
        highlights: ['Designed REST APIs.', 'Optimized database queries.']
      }
    ],
    projects: [
      {
        name: 'Builder API',
        description: 'API for construction management.',
        techStack: ['Node.js', 'Express'],
        liveUrl: 'https://builder.example.com',
        sourceUrl: 'https://github.com/bob/builder-api'
      }
    ],
    contact: {
      email: 'bob@example.com',
      github: 'https://github.com/bob',
      linkedin: 'https://linkedin.com/in/bob'
    }
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

  // Include full profile data in the token so /api/me can return it immediately
  const payload = {
    email: user.email,
    profile: user.profile,
    skills: user.skills,
    experience: user.experience,
    projects: user.projects,
    contact: user.contact
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  res.status(200).json({ token });
}
