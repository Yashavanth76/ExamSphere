import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Lock, User, GraduationCap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        // Route dynamically based on user role string mapping
        const role = res.user.role?.toLowerCase();
        if (role === 'principal' || role === 'admin') navigate('/AdminDashboard');
        else if (role === 'teacher') navigate('/TeacherDashboard');
        else navigate('/StudentDashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Connection failure to ExamsSphere validation servers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
      fontFamily: 'sans-serif',
      padding: '1rem'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        width: '900px', 
        minHeight: '550px',
        background: '#ffffff', 
        borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        
        {/* 🎨 LEFT COLUMN: VIBRANT EMBEDDED BRAND PANEL */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
          padding: '3rem 2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'between', 
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background glass circles for premium polish */}
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '180px', height: '180px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />

          <div style={{ zIndex: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
              <GraduationCap size={36} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
              ExamsSphere
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: '1.05rem', lineHeight: '1.6', margin: 0, maxWidth: '320px' }}>
              Access your secure online examination hub. Monitor performance, manage evaluations, and view instant metrics profiles.
            </p>
          </div>

          <div style={{ zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', fontSize: '0.85rem', color: '#93c5fd' }}>
            🔒 Verified Enterprise Grade Assessment Cluster
          </div>
        </div>

        {/* 🔐 RIGHT COLUMN: CLEAN INTERACTIVE LOGIN DESK FORM */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', marginBottom: '0.5rem' }}>
              <LogIn size={20} />
              <span style={{ fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Portal Authentication</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>Welcome Back</h2>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>USERNAME / ID</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><User size={18} /></span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., student_bca or admin_root" 
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>ACCESS PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Lock size={18} /></span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system passcode" 
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              {loading ? 'Authenticating Credentials...' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            New student? <span onClick={() => navigate('/signup')} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}>Create an account</span>
          </div>
        </div>

      </div>
    </div>
  );
}