import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import API from '../../services/api'; 
import StatusToast from '../../components/Layout/common/StatusToast';

export default function Profile() {
  // 🟢 FIXED: Grab updateUserProfile straight out of your live AuthContext wrapper
  const { user, updateUserProfile } = useAuth(); 
  const navigate = useNavigate();

  // Initialization Logic: Fallback to reading raw local cache values if context is slow
  const getInitialUserValue = (field, fallback) => {
    if (user && user[field]) return user[field];
    const cached = JSON.parse(localStorage.getItem('exam_active_user') || '{}');
    return cached[field] || fallback;
  };

  const [fullName, setFullName] = useState(() => getInitialUserValue('fullName', 'Dr. K. S. Sharma'));
  const [email, setEmail] = useState(() => getInitialUserValue('email', 'principal.office@university.edu')); 
  const [qualification, setQualification] = useState(() => getInitialUserValue('qualification', ''));
  const [focusArea, setFocusArea] = useState(() => getInitialUserValue('subjectExpertise', getInitialUserValue('focusArea', ''))); 
  
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Sync Effect Block: Keeps forms bound if user variables change mid-session
  useEffect(() => {
    const activeUser = user || JSON.parse(localStorage.getItem('exam_active_user') || '{}');
    if (activeUser && Object.keys(activeUser).length > 0) {
      setFullName(activeUser.fullName || 'Dr. K. S. Sharma');
      setEmail(activeUser.email || 'principal.office@university.edu');
      setQualification(activeUser.qualification || '');
      setFocusArea(activeUser.subjectExpertise || activeUser.focusArea || '');
    }
  }, [user]);

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      /* 🟢 THE PRECISE ROUTE PATH: */
      const response = await API.put('admin/update-profile', {
        fullName,
        email,
        qualification,
        focusArea
      });

      if (response.data) {
        const updatedUserData = response.data;
        
        // Wipe local storage out to replace it with fresh MySQL data array rows
        localStorage.setItem('exam_active_user', JSON.stringify(updatedUserData));
        
        // 🟢 FIXED LOOP: Calls the accurate state context handler defined inside AuthContext.jsx
        if (updateUserProfile) {
          updateUserProfile(updatedUserData);
        }
        
        setShowToast(true); 
      }
    } catch (err) {
      console.error("Profile cache persistence link breakdown:", err);
      alert("Failed to sync structural changes locally: " + (err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
      <button 
        type="button"
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: '500', marginBottom: '1.5rem', padding: 0 }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '50%', display: 'inline-flex' }}>
            <User size={36} color="#2563eb" />
          </div>
        </div>

        <h2 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>Profile Management</h2>
        <p style={{ textAlign: 'center', color: '#64748b', margin: '0 0 2rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Review role assignments and maintain your official university account parameters.
        </p>

        <form onSubmit={handleUpdateProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>SYSTEM AUTHORIZATION ID</label>
            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '0.75rem 1rem', color: '#2563eb', fontWeight: '600', fontSize: '0.95rem' }}>
              🛡️ @{user?.username || JSON.parse(localStorage.getItem('exam_active_user') || '{}').username || 'principal_root'} (PRINCIPAL)
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>FULL NAME</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>OFFICIAL CORRESPONDENCE DISPATCH EMAIL (SENDER OUTBOX)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g., principal@institution.edu"
              required 
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }}
            />
            <small style={{ display: 'block', color: '#64748b', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              All automated system registrations and welcome notices will display this as the return address.
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>ADMINISTRATIVE QUALIFICATION</label>
              <input 
                type="text" 
                value={qualification} 
                onChange={(e) => setQualification(e.target.value)} 
                placeholder="e.g., Ph.D. in CS"
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>INSTITUTIONAL FOCUS AREA</label>
              <input 
                type="text" 
                value={focusArea} 
                onChange={(e) => setFocusArea(e.target.value)} 
                placeholder="e.g., Academic Oversight"
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            <Save size={18} /> {saving ? 'Saving Adjustments...' : 'Update Profile Settings'}
          </button>
        </form>
      </div>

      <StatusToast 
        show={showToast} 
        message="Institutional profile parameters and dispatch email updated successfully!" 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}