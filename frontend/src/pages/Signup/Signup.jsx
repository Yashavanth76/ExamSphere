import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, User, Mail, Lock, BookOpen, Calendar, ArrowLeft, UserPlus } from 'lucide-react';
import StatusToast from '../../components/Layout/common/StatusToast';
import API from '../../services/api';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Registration form field parameters matrix
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    classStream: 'BCA', // Default selection matching standard database parameters
    dob: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (signup) {
        const res = await signup(formData);
        if (res.success) {
          setShowSuccessToast(true);
          // Redirect to login interface after a clean 2-second visual delay
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(res.message || "Registration parameter mismatch validation failure.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to transport signup payload packet to ExamsSphere master node.");
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
      padding: '1.5rem'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.2fr', // Giving slightly more breathing space to the registration input matrix
        width: '1000px', 
        minHeight: '620px',
        background: '#ffffff', 
        borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        
        {/* 🎨 LEFT COLUMN: VIBRANT BRAND INDUCTION PANEL */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
          padding: '3.5rem 2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'between', 
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative ambient glass backdrops perfectly matching the Login visual structure */}
          <div style={{ position: 'absolute', top: '-12%', left: '-10%', width: '260px', height: '260px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-8%', right: '-5%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />

          <div style={{ zIndex: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
              <UserPlus size={36} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
              Join ExamsSphere
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: '1.05rem', lineHeight: '1.6', margin: 0, maxWidth: '320px' }}>
              Create your unified candidate profile container node. Access real-time grading indices, unlock pending evaluation modules, and track performance tracking logs safely.
            </p>
          </div>

          <div style={{ zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', fontSize: '0.85rem', color: '#93c5fd' }}>
            🛡️ Academic Admission Integrity Framework Active
          </div>
        </div>

        {/* 🔐 RIGHT COLUMN: SPLIT COHORT REGISTRATION FIELDS */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', marginBottom: '0.5rem' }}>
                <UserPlus size={18} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Student Registration Desk</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>Initialize Account</h2>
            </div>
            
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Row Split: Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><User size={16} /></span>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Ajay Sharma" 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Mail size={16} /></span>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@university.edu" 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Row Split: Username & Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>CHOOSE USERNAME</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><User size={16} /></span>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g., roy_bca" 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>PORTAL ACCESS PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Lock size={16} /></span>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Construct strong code access" 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Row Split: Class Stream & Date of Birth */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>ACADEMIC STREAM BRANCH</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><BookOpen size={16} /></span>
                  <select 
                    name="classStream"
                    value={formData.classStream}
                    onChange={handleInputChange}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', background: '#ffffff', outline: 'none', appearance: 'none' }}
                  >
                    <option value="BCA">BCA (Computer Applications)</option>
                    <option value="BScCS">B.Sc Computer Science</option>
                    <option value="BBA">BBA (Business Administration)</option>
                    <option value="MCA">MCA (Post Graduate Masters)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>DATE OF BIRTH</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><Calendar size={16} /></span>
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              {loading ? 'Transmitting Registry Payload...' : 'Submit Profile for Verification'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Already initialized? <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Sign in to account</span>
          </div>
        </div>

      </div>

      <StatusToast 
        show={showSuccessToast} 
        message="Registration submitted successfully! Redirecting to login desk..." 
        onClose={() => setShowSuccessToast(false)} 
      />
    </div>
  );
}