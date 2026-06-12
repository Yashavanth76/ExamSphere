import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Play, GraduationCap, LogOut, Bell, Award } from 'lucide-react';
import API from '../../services/api';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Simulated exam allocation arrays matching your database architecture rules
  const [allocatedExams, setAllocatedExams] = useState([
    {
      examId: 1,
      stream: 'COMPUTER SCIENCE',
      title: 'Data Structures & Algorithms',
      subject: 'DSA Core',
      durationMinutes: 45,
      description: 'Evaluate your knowledge on Trees, Graphs, Sorting algorithms, and Time Complexity optimization.'
    }
  ]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: 'sans-serif',
      color: '#1e293b'
    }}>
      
      {/* 🔹 TOP PREMIUM NAVBAR (FIXED EDGE-TO-EDGE ALIGNMENT) */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', // 🟢 Fixes smashed layout by locking items to outer edges
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* LEFT WRAPPER: LOGO BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
          <GraduationCap size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#0f172a' }}>
            ExamsSphere <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#eff6ff', borderRadius: '4px', marginLeft: '0.25rem', fontWeight: '600' }}>Portal</span>
          </span>
        </div>

        {/* RIGHT WRAPPER: IDENTIFIER ACCENTS & LOGOUT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              background: '#eff6ff', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', // 🟢 Fixed case typo from layout pipeline crash
              fontWeight: '700', 
              color: '#2563eb' 
            }}>
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>{user?.fullName || 'Shayesh'}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{user?.classStream || 'Engineering Stream'}</div>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#64748b'; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* 🔹 MAIN LAYOUT CONTAINER */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '3.2fr 1fr', 
        maxWidth: '1400px', 
        margin: '2rem auto', 
        padding: '0 1.5rem', 
        gap: '2rem' 
      }}>
        
        {/* LEFT COLUMN: GREETINGS & ALLOCATED EXAMS */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* PREMIUM WELCOME BANNER CARD */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.15)'
          }}>
            <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', right: '10%', bottom: '-30%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
                Welcome back, {user?.fullName || 'Shayesh'}!
              </h2>
              <p style={{ color: '#bfdbfe', margin: 0, fontSize: '1rem', maxWidth: '500px', lineHeight: '1.5' }}>
                Below are the digital evaluations allocated exclusively for your branch parameters. Good luck with your assessments today.
              </p>
            </div>
          </div>

          {/* EXAM MATRIX SECTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BookOpen size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Your Academic Evaluations ({allocatedExams.length})
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {allocatedExams.map((exam) => (
                <div 
                  key={exam.examId}
                  style={{ 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'between',
                    minHeight: '220px',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', background: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: '6px', letterSpacing: '0.05em' }}>
                        {exam.stream}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> {exam.durationMinutes} Mins
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: '1.3' }}>
                      {exam.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                      {exam.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate(`/exam-engine/${exam.examId}`)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: '#2563eb', 
                      color: '#ffffff', 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                  >
                    <Play size={14} fill="#ffffff" /> Launch Exam Engine
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: SIDE METRICS & NOTIFICATIONS FEED */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* PROFILE SUMMARY MINI CARD */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Academic Standing</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px' }}>
                <Award size={20} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Status Profile</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#16a34a' }}>Active Eligible</div>
              </div>
            </div>
          </div>

          {/* REAL-TIME ANNOUNCEMENTS BOX */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <Bell size={16} color="#64748b" />
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Live Notices</h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#0f172a', display: 'block' }}>DSA Exam Unlocked</span>
                <span style={{ color: '#64748b' }}>Your data structure evaluation block is open until midnight tonight.</span>
              </div>
              <div style={{ fontSize: '0.8rem', borderLeft: '3px solid #cbd5e1', paddingLeft: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#475569', display: 'block' }}>System Maintenance</span>
                <span style={{ color: '#94a3b8' }}>ExamsSphere portals will experience brief updates at 02:00 AM.</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}