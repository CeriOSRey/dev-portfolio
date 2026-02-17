import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';


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

  // Hardcoded user data for Alice and Bob
  type User = {
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

  const users: Record<string, User> = {
    'alice@example.com': {
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

  if (email && users[email]) {
    res.status(200).json(users[email]);
  } else {
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
}
