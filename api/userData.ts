// Shared user storage for demo purposes
// In production, this would be a database

export type User = {
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

export type UserWithAuth = User & {
  email: string;
  password: string;
};

// In-memory storage (will reset on server restart)
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

export function getUser(email: string): UserWithAuth | null {
  return users[email] || null;
}

export function addUser(userData: UserWithAuth): void {
  users[userData.email] = userData;
}

export function getUserProfile(email: string): User | null {
  const user = users[email];
  if (!user) return null;
  
  // Return user data without password
  const { password, ...profile } = user;
  return profile;
}