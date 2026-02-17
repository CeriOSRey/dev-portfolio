import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addUser, getUser, type UserWithAuth } from './userData';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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

  // Generate JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });

  res.status(201).json({ token, message: 'User created successfully' });
}