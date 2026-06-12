import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initialExams } from '../../services/mockData';
import { BookOpen, Plus, UserCheck, Edit3, Save, Award, GraduationCap, LogOut, Clock, Layers, FileText } from 'lucide-react';
import StatusToast from '../../components/Layout/common/StatusToast';

export default function TeacherDashboard() {
  const { user, logout, updateUserProfile, usersDatabase } = useAuth();
  const navigate = useNavigate();
  
  const [exams, setExams] = useState(initialExams);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || 'Faculty Member',
    qualification: user?.qualification || 'Ph.D. in Computer Science',
    subjectExpertise: user?.subjectExpertise || 'Advanced Software Systems'
  });

  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    stream: 'BCA',
    subject: user?.subjectExpertise || 'General Computing'
  });

  // Sync state cleanly if user details reload
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || 'Faculty Member',
        qualification: user.qualification || 'Ph.D. in Computer Science',
        subjectExpertise: user.subjectExpertise || 'Advanced Software Systems'
      });
    }
  }, [user]);

  // 🟢 FIXED: Safe optional chaining and string/number matching fallback conversion rules
  const studentSubmissions = (usersDatabase || [])
    .filter(u => u?.role === 'student' && u?.attempts && Object.keys(u.attempts).length > 0)
    .flatMap(s => 
      Object.entries(s.attempts).map(([examId, grade]) => {
        // Coerces lookups securely matching string tokens against numeric values
        const targetExam = (exams || []).find(e => String(e?.id) === String(examId));
        return {
          studentName: s.fullName || 'Anonymous Student',
          stream: s.classStream || 'General Branch',
          examTitle: targetExam ? targetExam.title : 'General Evaluation',
          score: grade || 0
        };
      })
    );

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile(profileForm);
    }
    setIsEditingProfile(false);
    setToastMessage("Faculty credentials updated successfully!");
    setShowToast(true);
  };

  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    const examNode = {
      ...newExam,
      id: `exam-${Date.now()}`,
      questionsCount: 5,
      difficulty: 'Medium'
    };

    setExams(prev => [...prev, examNode]);
    setToastMessage(`Successfully published "${newExam.title}" to the examination catalog!`);
    setShowToast(true);
    
    setNewExam({ title: '', description: '', durationMinutes: 30, stream: 'BCA', subject: user?.subjectExpertise || 'General Computing' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* 🔹 FIXED TOP PREMIUM NAVBAR */}
      <header style={{ 
        background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        position: 'sticky', top: 0, zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
          <GraduationCap size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
            ExamsSphere <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#eff6ff', borderRadius: '4px', marginLeft: '0.25rem', fontWeight: '600' }}>Faculty Hub</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#eff6ff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#2563eb' }}>
              {profileForm.fullName.charAt(0)}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>{profileForm.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{profileForm.qualification}</div>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* 🔹 WORKSPACE MAIN TWO-COLUMN CONTAINER GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr', maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem', gap: '2rem' }}>
        
        {/* 🟥 LEFT AREA: FORM STACKS AND PARAMETERS */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* FACULTY CREDENTIALS CARD */}
          <section style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#2563eb" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Faculty Credentials</h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '0.5rem 0.85rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
              >
                {isEditingProfile ? <Clock size={14} /> : <Edit3 size={14} />}
                {isEditingProfile ? 'Cancel' : 'Modify Credentials'}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} placeholder="Full Name" required style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                  <input type="text" value={profileForm.qualification} onChange={e => setProfileForm({...profileForm, qualification: e.target.value})} placeholder="Academic Degree Status" required style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                </div>
                <input type="text" value={profileForm.subjectExpertise} onChange={e => setProfileForm({...profileForm, subjectExpertise: e.target.value})} placeholder="Core Expertise Branch" required style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                <button type="submit" style={{ padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Commit Structural Record Updates</button>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>FACULTY NAME</span>
                  <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{profileForm.fullName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>RANK STATUS</span>
                  <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{profileForm.qualification}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>DEPARTMENT CHAIR FOCUS</span>
                  <strong style={{ color: '#2563eb', fontSize: '1rem' }}>{profileForm.subjectExpertise}</strong>
                </div>
              </div>
            )}
          </section>

          {/* EXAM CREATOR FRAMEWORK PANEL */}
          <section style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Plus size={22} color="#2563eb" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Publish Subject Examination Node</h3>
            </div>
            
            <form onSubmit={handleCreateExamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="Assessment Title (e.g., Object Oriented Architecture)" required value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem' }} />
                <input type="text" placeholder="Subject Descriptor" required value={newExam.subject} onChange={e => setNewExam({...newExam, subject: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={newExam.stream} onChange={e => setNewExam({...newExam, stream: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem' }}>
                  <option value="Engineering">Engineering</option>
                  <option value="BCA">BCA</option>
                  <option value="BSc">BSc</option>
                  <option value="MSc">MSc</option>
                  <option value="BCom">BCom</option>
                  <option value="MCom">MCom</option>
                </select>
                <input type="number" placeholder="Duration (Minutes)" min="5" max="180" required value={newExam.durationMinutes} onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value, 10)})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem' }} />
              </div>
              <textarea placeholder="Provide testing summary overview and syllabus evaluation boundaries details..." required rows="3" value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'sans-serif' }}></textarea>
              <button type="submit" style={{ padding: '0.85rem', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>Deploy Exam Live to Target Stream</button>
            </form>
          </section>
        </main>

        {/* 🟨 RIGHT AREA: LIVE STUDENT PERFORMANCE AUDIT LIST SCROLLER */}
        <aside style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <UserCheck size={18} color="#16a34a" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#475569', margin: 0, letterSpacing: '0.025em' }}>STUDENT GRADE AUDIT</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {studentSubmissions.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', margin: '2rem 0' }}>No student exam evaluation records have been processed inside your parameters yet.</p>
            ) : (
              studentSubmissions.map((sub, idx) => (
                <div key={idx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{sub.studentName}</span>
                    <span style={{ 
                      fontSize: '0.8rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px',
                      background: sub.score >= 40 ? '#f0fdf4' : '#fef2f2',
                      color: sub.score >= 40 ? '#16a34a' : '#991b1b'
                    }}>{sub.score}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                    <span style={{ color: '#2563eb', fontWeight: '600' }}>{sub.stream}</span>
                    <span>•</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{sub.examTitle}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <StatusToast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}