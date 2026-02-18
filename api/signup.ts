import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

declare global {
  var registeredUsers: Record<string, any>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

type UserWithAuth = {
  email: string;
  password: string;
  profile: {
    name: string;
    title: string;
    bio: string;
    avatarUrl: string;
    location: string;
  };
  skills: { category: string; items: string[] }[];
  experience: {
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    sourceUrl: string;
  }[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
};

// Shared user storage (in-memory, resets on deployment)
const users: Record<string, UserWithAuth> = {
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

function getUser(email: string): UserWithAuth | null {
  return users[email] || global.registeredUsers[email] || null;
}

function addUser(userData: UserWithAuth): void {
  global.registeredUsers[userData.email] = userData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password, profile, skills, experience, projects, contact } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (!profile?.name || !profile?.title || !profile?.bio) {
    res.status(400).json({ error: 'Name, title, and bio are required' });
    return;
  }

  // Check if user already exists
  if (getUser(email)) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  // Create new user
  const newUser: UserWithAuth = {
    email,
    password, // In production, hash this!
    profile: {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl || '',
      location: profile.location || ''
    },
    skills: skills || [
      { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] }
    ],
    experience: experience || [
      {
        role: profile.title || 'Software Engineer',
        company: 'New Company',
        startDate: '2024-01',
        endDate: 'Present',
        highlights: ['Getting started in the industry.']
      }
    ],
    projects: projects || [
      {
        name: 'Portfolio Project',
        description: 'My first portfolio website.',
        techStack: ['React', 'TypeScript'],
        liveUrl: '',
        sourceUrl: contact?.github || ''
      }
    ],
    contact: {
      email,
      github: contact?.github || '',
      linkedin: contact?.linkedin || ''
    }
  };

  // Save user
  addUser(newUser);

  // Generate JWT token with full profile payload so /api/me can return it immediately
  const tokenPayload = {
    email,
    profile: newUser.profile,
    skills: newUser.skills,
    experience: newUser.experience,
    projects: newUser.projects,
    contact: newUser.contact
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });

  res.status(201).json({ token, message: 'User created successfully' });
}