import { useEffect, useState } from 'react';
import { logout, isTokenExpired } from './auth';
import { useNavigate } from 'react-router-dom';
import dataJson from './data.json';

type Data = typeof dataJson;

export default function App() {
  const [data, setData] = useState<Data>(dataJson);
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
  const navigate = useNavigate();
  const [active, setActive] = useState<string>('about');

  useEffect(() => {
    const ids = ['about', 'skills', 'experience', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            setActive(id);
          }
        });
      },
      { threshold: 0.6 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      if (isTokenExpired(token)) { logout(); navigate('/login'); return; }
      try {
        const base = import.meta.env.VITE_API_BASE_URL ?? '';
        const res = await fetch(`${base}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          setData(json as Data);
        }
      } catch (e) {
        console.error('Failed to fetch profile', e);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-soft">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="container flex items-center justify-between px-4 py-3">
          <div className="font-extrabold text-primary text-xl">{data.profile.name || 'DL'}</div>
          <nav className="space-x-5">
            <a className={`nav-link ${active==='about' ? 'active' : ''}`} href="#about" data-testid="nav-about">About</a>
            <a className={`nav-link ${active==='skills' ? 'active' : ''}`} href="#skills" data-testid="nav-skills">Skills</a>
            <a className={`nav-link ${active==='experience' ? 'active' : ''}`} href="#experience" data-testid="nav-experience">Experience</a>
            <a className={`nav-link ${active==='projects' ? 'active' : ''}`} href="#projects" data-testid="nav-projects">Projects</a>
            <a className={`nav-link ${active==='contact' ? 'active' : ''}`} href="#contact" data-testid="nav-contact">Contact</a>
            <button className="nav-link" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </nav>
        </div>
      </header>

      <main>
        {/* About */}
        <section id="about" data-testid="section-about" className="section">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
            <div aria-hidden className="absolute -z-10 right-10 -top-10 w-40 h-40 rounded-full blur-2xl opacity-30 bg-gradient-to-br from-primary to-accent" />
            <div>
              <h1 className="hero-name">{data.profile.name}</h1>
              <p className="hero-title">{data.profile.title}</p>
              <p className="hero-bio">{data.profile.bio}</p>
              <p className="text-sm text-gray-500 mt-3">{data.profile.location}</p>
            </div>
            <div className="flex justify-center">
              {data.profile.avatarUrl ? (
                <img src={data.profile.avatarUrl} alt="Avatar" className="rounded-full w-40 h-40 object-cover" />
              ) : (
                <div className="rounded-full w-40 h-40 bg-gray-200" />
              )}
            </div>
          </div>
        </section>
        <div className="divider" aria-hidden="true" />

        {/* Skills */}
        <section id="skills" data-testid="section-skills" className="section section--alt">
          <div className="container">
            <h2>Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.skills.map((s) => (
                <div key={s.category} className="card">
                  <h3 className="text-lg font-semibold mb-2">{s.category}</h3>
                  <div>
                    {s.items.map((item) => (
                      <span key={item} className="badge">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="divider" aria-hidden="true" />

        {/* Experience */}
        <section id="experience" data-testid="section-experience" className="section">
          <div className="container">
            <h2>Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="card">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{exp.role} @ {exp.company}</h3>
                    <span className="text-sm text-gray-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside mt-2">
                    {exp.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="divider" aria-hidden="true" />

        {/* Projects */}
        <section id="projects" data-testid="section-projects" className="section section--alt">
          <div className="container">
            <h2>Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((p) => (
                <div
                  key={p.name}
                  className="card"
                  data-testid="project-card"
                  data-project-name={p.name}
                >
                  <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                  <p className="mb-3">{p.description}</p>
                  <div className="mb-3">
                    {p.techStack.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                  <div className="space-x-3">
                    {p.liveUrl && (
                      <a className="btn-link" href={p.liveUrl} target="_blank" rel="noreferrer">Live Demo</a>
                    )}
                    {p.sourceUrl && (
                      <a className="btn-link" href={p.sourceUrl} target="_blank" rel="noreferrer">Source Code</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="divider" aria-hidden="true" />

        {/* Contact */}
        <section id="contact" data-testid="section-contact" className="section">
          <div className="container">
            <h2>Contact</h2>
            <p className="mb-4">I’d love to connect. Reach out via email or socials.</p>
            <div className="space-x-4">
              <a className="nav-link text-primary font-semibold" href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
              <a className="nav-link text-primary font-semibold" href={data.contact.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="nav-link text-primary font-semibold" href={data.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {data.profile.name}. All rights reserved.</p>
          <p className="mt-2">
            <a className="nav-link text-primary" href="#top">Back to top</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
