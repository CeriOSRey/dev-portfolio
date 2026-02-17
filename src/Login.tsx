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
  // Dynamic arrays
  const [skills, setSkills] = useState<{ category: string; itemsInput: string }[]>([]);
  const [skillCategory, setSkillCategory] = useState('Frontend');
  const [skillItemsInput, setSkillItemsInput] = useState('');

  const [experience, setExperience] = useState<{ role: string; company: string; startDate: string; endDate: string; highlightsInput: string }[]>([]);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expHighlightsInput, setExpHighlightsInput] = useState('');

  const [projects, setProjects] = useState<{ name: string; description: string; techStackInput: string; liveUrl: string; sourceUrl: string }[]>([]);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTechInput, setProjTechInput] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projSource, setProjSource] = useState('');
  
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
          skills: skills.map((s) => ({ category: s.category, items: s.itemsInput.split(',').map((t) => t.trim()).filter(Boolean) })),
          experience: experience.map((ex) => ({ role: ex.role, company: ex.company, startDate: ex.startDate, endDate: ex.endDate, highlights: ex.highlightsInput.split(',').map((h) => h.trim()).filter(Boolean) })),
          projects: projects.map((p) => ({ name: p.name, description: p.description, techStack: p.techStackInput.split(',').map((t) => t.trim()).filter(Boolean), liveUrl: p.liveUrl, sourceUrl: p.sourceUrl })),
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

              <h4 className="text-md font-semibold mt-4">Skills</h4>
              <div className="flex gap-2 items-center mb-2">
                <input value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="border rounded px-2 py-1" />
                <input value={skillItemsInput} onChange={(e) => setSkillItemsInput(e.target.value)} placeholder="comma separated (React,TypeScript)" className="flex-1 border rounded px-2 py-1" />
                <button type="button" className="btn-link" onClick={() => {
                  if (!skillItemsInput.trim()) return;
                  setSkills([...skills, { category: skillCategory || 'Misc', itemsInput: skillItemsInput }]);
                  setSkillItemsInput('');
                }}>Add</button>
              </div>
              <ul className="mb-3">
                {skills.map((s, i) => (
                  <li key={i} className="text-sm py-1">
                    <strong>{s.category}:</strong> {s.itemsInput}
                    <button type="button" className="ml-2 text-red-500" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>Remove</button>
                  </li>
                ))}
              </ul>

              <h4 className="text-md font-semibold mt-4">Experience</h4>
              <div className="grid grid-cols-1 gap-2 mb-2">
                <input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Role" className="border rounded px-2 py-1" />
                <input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company" className="border rounded px-2 py-1" />
                <div className="flex gap-2">
                  <input value={expStart} onChange={(e) => setExpStart(e.target.value)} placeholder="Start (YYYY-MM)" className="border rounded px-2 py-1" />
                  <input value={expEnd} onChange={(e) => setExpEnd(e.target.value)} placeholder="End (YYYY-MM or Present)" className="border rounded px-2 py-1" />
                </div>
                <input value={expHighlightsInput} onChange={(e) => setExpHighlightsInput(e.target.value)} placeholder="highlights comma separated" className="border rounded px-2 py-1" />
                <div>
                  <button type="button" className="btn-link" onClick={() => {
                    if (!expRole.trim() || !expCompany.trim()) return;
                    setExperience([...experience, { role: expRole, company: expCompany, startDate: expStart, endDate: expEnd || 'Present', highlightsInput: expHighlightsInput }]);
                    setExpRole(''); setExpCompany(''); setExpStart(''); setExpEnd(''); setExpHighlightsInput('');
                  }}>Add Experience</button>
                </div>
              </div>
              <ul className="mb-3">
                {experience.map((ex, i) => (
                  <li key={i} className="text-sm py-1">
                    <strong>{ex.role}</strong> @ {ex.company} ({ex.startDate} — {ex.endDate}) — {ex.highlightsInput}
                    <button type="button" className="ml-2 text-red-500" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}>Remove</button>
                  </li>
                ))}
              </ul>

              <h4 className="text-md font-semibold mt-4">Projects</h4>
              <div className="grid grid-cols-1 gap-2 mb-2">
                <input value={projName} onChange={(e) => setProjName(e.target.value)} placeholder="Project name" className="border rounded px-2 py-1" />
                <input value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Short description" className="border rounded px-2 py-1" />
                <input value={projTechInput} onChange={(e) => setProjTechInput(e.target.value)} placeholder="tech comma separated" className="border rounded px-2 py-1" />
                <input value={projLive} onChange={(e) => setProjLive(e.target.value)} placeholder="live url" className="border rounded px-2 py-1" />
                <input value={projSource} onChange={(e) => setProjSource(e.target.value)} placeholder="source url" className="border rounded px-2 py-1" />
                <div>
                  <button type="button" className="btn-link" onClick={() => {
                    if (!projName.trim()) return;
                    setProjects([...projects, { name: projName, description: projDesc, techStackInput: projTechInput, liveUrl: projLive, sourceUrl: projSource }]);
                    setProjName(''); setProjDesc(''); setProjTechInput(''); setProjLive(''); setProjSource('');
                  }}>Add Project</button>
                </div>
              </div>
              <ul className="mb-3">
                {projects.map((p, i) => (
                  <li key={i} className="text-sm py-1">
                    <strong>{p.name}</strong> — {p.description} — {p.techStackInput}
                    <button type="button" className="ml-2 text-red-500" onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}>Remove</button>
                  </li>
                ))}
              </ul>
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
