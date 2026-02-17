import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const [demoUser, setDemoUser] = useState<'alice' | 'bob'>('alice');
  const [error, setError] = useState<string | null>(null);
  
  // Profile fields for signup
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL ?? '';
      
      if (isSignup) {
        // Signup logic
        const signupData = {
          email,
          password,
          profile: {
            name,
            title,
            bio,
            avatarUrl: '',
            location
          },
          skills: [
            { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] }
          ],
          experience: [
            {
              role: title || 'Software Engineer',
              company: 'New Company',
              startDate: '2024-01',
              endDate: 'Present',
              highlights: ['Getting started in the industry.']
            }
          ],
          projects: [
            {
              name: 'Portfolio Project',
              description: 'My first portfolio website.',
              techStack: ['React', 'TypeScript'],
              liveUrl: '',
              sourceUrl: github || ''
            }
          ],
          contact: {
            email,
            github,
            linkedin
          }
        };
        
        const res = await fetch(`${base}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        });
        
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Signup failed');
          return;
        }
        
        const { token } = await res.json();
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        // Login logic
        const res = await fetch(`${base}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Login failed');
          return;
        }
        const { token } = await res.json();
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (e) {
      setError('Network error');
    }
  }

  return (
    <div className="section">
      <div className="container max-w-md">
        <div className="flex justify-center mb-4">
          <div className="flex border rounded">
            <button
              type="button"
              className={`px-4 py-2 rounded-l ${!isSignup ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-r ${isSignup ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={onSubmit} className="card">
          {!isSignup && (
            <label className="block mb-4">
              <span className="text-sm text-gray-600">Demo Account</span>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={demoUser}
                onChange={(e) => {
                  const val = e.target.value as 'alice' | 'bob';
                  setDemoUser(val);
                  if (val === 'alice') {
                    setEmail('alice@example.com');
                    setPassword('password123');
                  } else {
                    setEmail('bob@example.com');
                    setPassword('password123');
                  }
                }}
              >
                <option value="alice">Alice (alice@example.com)</option>
                <option value="bob">Bob (bob@example.com)</option>
              </select>
            </label>
          )}
          
          <label className="block mb-2">
            <span className="text-sm text-gray-600">Email</span>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 w-full border rounded px-3 py-2" 
              placeholder="you@example.com" 
              required
            />
          </label>
          
          <label className="block mb-4">
            <span className="text-sm text-gray-600">Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 w-full border rounded px-3 py-2" 
              placeholder="••••••••" 
              required
            />
          </label>

          {isSignup && (
            <>
              <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
              
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Full Name</span>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="Your Name" 
                  required
                />
              </label>
              
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Job Title</span>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="Software Engineer" 
                  required
                />
              </label>
              
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Bio</span>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="Tell us about yourself..." 
                  rows={3}
                  required
                />
              </label>
              
              <label className="block mb-2">
                <span className="text-sm text-gray-600">Location</span>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="City, Country" 
                />
              </label>
              
              <label className="block mb-2">
                <span className="text-sm text-gray-600">GitHub URL</span>
                <input 
                  value={github} 
                  onChange={(e) => setGithub(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="https://github.com/username" 
                />
              </label>
              
              <label className="block mb-4">
                <span className="text-sm text-gray-600">LinkedIn URL</span>
                <input 
                  value={linkedin} 
                  onChange={(e) => setLinkedin(e.target.value)} 
                  className="mt-1 w-full border rounded px-3 py-2" 
                  placeholder="https://linkedin.com/in/username" 
                />
              </label>
            </>
          )}
          
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button className="btn-link" type="submit">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
