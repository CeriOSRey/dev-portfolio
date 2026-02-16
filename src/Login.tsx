import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const [demoUser, setDemoUser] = useState<'alice' | 'bob'>('alice');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/login', {
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
    } catch (e) {
      setError('Network error');
    }
  }

  return (
    <div className="section">
      <div className="container max-w-md">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="card">
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
          <label className="block mb-2">
            <span className="text-sm text-gray-600">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="you@example.com" />
          </label>
          <label className="block mb-4">
            <span className="text-sm text-gray-600">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="••••••••" />
          </label>
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button className="btn-link" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
