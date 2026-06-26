import React, { useEffect, useState } from 'react';

interface NavbarProps {
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-scheme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    let nextTheme: 'light' | 'dark' = 'dark';
    
    // If it's system, we need to figure out what the system currently is and pick the opposite to pin it.
    if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextTheme = isSystemDark ? 'light' : 'dark';
    } else {
      nextTheme = theme === 'light' ? 'dark' : 'light';
    }

    setTheme(nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', nextTheme);
    }
    localStorage.setItem('color-scheme', nextTheme);
  };

  const ThemeToggleBtn = (
    <button onClick={toggleTheme} title="Toggle theme" style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      )}
    </button>
  );

  return (
    <nav className="sticky-top navbar-container" style={{
      marginBottom: '2rem',
      marginLeft: '-1.5rem',
      marginRight: '-1.5rem',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border-color)',
      marginTop: '1rem'
    }}>
      <div className="navbar-brand">
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1' }}>
          3-String Chords
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a href="https://ko-fi.com/vemoose" target="_blank" rel="noopener noreferrer" style={{
            fontSize: '0.75rem',
            color: 'var(--text-main)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 600,
            background: 'var(--surface-color)',
            padding: '0.3rem 0.6rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            Buy me a coffee
          </a>
          <div className="mobile-only">
            {ThemeToggleBtn}
          </div>
        </div>
      </div>
      <div className="navbar-actions">
        {children}
        <div className="desktop-only">
          {ThemeToggleBtn}
        </div>
      </div>
    </nav>
  );
};
