import { useState, useEffect } from 'react';
import { signUpWithEmail, signInWithEmail, signOut, onAuthStateChange, syncFromSupabase } from './supabaseClient';

export default function SupabaseSync({ onToggle, onUserChange }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const supabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChange(user => {
      setUser(user);
      onUserChange(user);
    });
    return unsubscribe;
  }, [onUserChange]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
        setError('Check your email to confirm signup!');
      } else {
        const u = await signInWithEmail(email, password);
        setUser(u);
        onUserChange(u);
        // Sync data from cloud
        const cloudData = await syncFromSupabase(u.id);
        if (cloudData) {
          localStorage.setItem('eb_points', JSON.stringify(cloudData.points));
          localStorage.setItem('eb_logs', JSON.stringify(cloudData.logs));
          localStorage.setItem('eb_tasks', JSON.stringify(cloudData.tasks));
          window.location.reload();
        }
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    onUserChange(null);
    setShowPanel(false);
  };

  if (!supabaseConfigured) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 150,
          width: 56, height: 56, borderRadius: '50%',
          background: user ? '#00C980' : '#666',
          border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700
        }}
        title={user ? `Synced as ${user.email}` : 'Enable cloud sync'}
      >
        {user ? '☁️' : '⚙️'}
      </button>

      {/* Panel */}
      {showPanel && (
        <div style={{
          position: 'fixed', bottom: 90, right: 20, width: 320,
          background: '#161620', border: '1px solid #2a2a3a', borderRadius: 14,
          padding: 20, zIndex: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          {user ? (
            <>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12, letterSpacing: 1 }}>CLOUD SYNC ENABLED</div>
              <div style={{ background: '#111', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: '#00E676', fontWeight: 700, marginBottom: 4 }}>✓ {user.email}</div>
                <div style={{ fontSize: 11, color: '#555' }}>Data syncs automatically</div>
              </div>
              <button onClick={handleLogout} style={{
                width: '100%', padding: 10, borderRadius: 8, border: 'none',
                background: '#FF4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12
              }}>Sign Out</button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </div>
              <form onSubmit={handleAuth}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', marginBottom: 8, borderRadius: 8,
                    border: '1px solid #333', background: '#111', color: '#fff',
                    fontSize: 12, outline: 'none', boxSizing: 'border-box'
                  }}
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', marginBottom: 12, borderRadius: 8,
                    border: '1px solid #333', background: '#111', color: '#fff',
                    fontSize: 12, outline: 'none', boxSizing: 'border-box'
                  }}
                  disabled={loading}
                />
                {error && <div style={{ fontSize: 11, color: '#FF7070', marginBottom: 10 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: 10, borderRadius: 8, border: 'none',
                  background: '#00C980', color: '#000', fontWeight: 700, cursor: 'pointer',
                  fontSize: 12, opacity: loading ? 0.5 : 1
                }}>
                  {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                  style={{
                    width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: '1px solid #333',
                    background: 'none', color: '#666', fontWeight: 600, cursor: 'pointer', fontSize: 11
                  }}
                >
                  {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
