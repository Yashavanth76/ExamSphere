import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
/* 🟢 FIXED SECURE IMPORT: Maps perfectly to your real sidebar tree structure */
import ConfirmationModal from "../../components/Layout/common/ConfirmationModal";
import StatusToast from '../../components/Layout/common/StatusToast'; // 🟢 NEW: Premium Card Toast Notification
import { useNavigate } from 'react-router-dom';
import API, { api } from '../../services/api'; // Pulls our unified Axios instance configuration
import { Users, FileSpreadsheet, Activity, UserPlus, Check, X, ShieldAlert, LogOut, Mail, Trash2, UserCheck } from 'lucide-react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Live Data State Management Matrix (Connected to MySQL Schema)
  const [exams, setExams] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [retakeRequests, setRetakeRequests] = useState([]);
  const [pendingStudentsList, setPendingStudentsList] = useState([]);
  const [approvedStudentsList, setApprovedStudentsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  
  const [activeTab, setActiveTab] = useState('approvals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [teacherForm, setTeacherForm] = useState({ fullName: '', email: '', username: '', password: '', qualification: '', subjectExpertise: '' });
  const [simulatedEmailNotification, setSimulatedEmailNotification] = useState(null);

  // 🟢 NEW: State controller hooks for the visual card toast notification
  const [showToast, setShowToast] = useState(false);

  // Centralized Pipeline to Fetch Real Data from RequestController / ExamController
  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fires off concurrent HTTP requests over the wire to your backend controllers
      const [pendingRes, verifiedRes, teachersRes, examsRes, retakesRes] = await Promise.all([
        API.get('/admin/pending-students'),
        API.get('/admin/verified-students'),
        API.get('/admin/teachers'),
        API.get('/exams/all'),
        API.get('/admin/pending-retakes')
      ]);

      setPendingStudentsList(pendingRes.data);
      setApprovedStudentsList(verifiedRes.data);
      setTeachersList(teachersRes.data);
      setExams(examsRes.data);
      setRetakeRequests(retakesRes.data);
      setError('');
    } catch (err) {
      console.error("Administrative dashboard hydration error:", err);
      setError("Network Error: Could not load data indices from the Spring Boot server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  // Controls the customized deletion alert modal layout states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetUsername: '',
    targetRole: ''
  });

  // Helper method to keep track of operations in the local view panel sidebar
  const appendSystemLog = (actionText) => {
    setSystemLogs(prev => [{
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user?.username || 'principal_root',
      action: actionText
    }, ...prev]);
  };

  // Live Faculty Provisioning Handler (Pipes into requestService / userService BCrypt engine)
  const handleAddTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post the plain teacher form payload to your RequestController endpoint mapping
      const response = await API.post('/admin/provision-teacher', teacherForm);
      
      if (response.data) {
        setSimulatedEmailNotification({
          type: 'FACULTY_PROVISION',
          to: teacherForm.fullName,
          email: teacherForm.email,
          username: teacherForm.username,
          password: teacherForm.password
        });

        appendSystemLog(`Provisioned teacher profile for '${teacherForm.fullName}' and verified columns mapping updates.`);
        setTeacherForm({ fullName: '', email: '', username: '', password: '', qualification: '', subjectExpertise: '' });
        fetchAllDashboardData(); // Instantly refresh our lists
      }
    } catch (err) {
      alert(err.response?.data || "Failed to provision faculty profile account registry.");
    }
  };

  // Live Dynamic Student Admission Processing Desk Handler
  const handleProcessStudentAdmission = async (studentUsername, studentEmail, studentName, action) => {
    try {
      // Maps value fields exactly like processStudentAdmission's Map reader expects
      const backendAction = action === 'approve' ? 'APPROVED' : 'REJECTED';
      
      await API.post('/admin/process-admission', {
        username: studentUsername,
        action: backendAction
      });

      if (action === 'approve') {
        setSimulatedEmailNotification({
          type: 'STUDENT_WELCOME',
          to: studentName,
          email: studentEmail,
          username: studentUsername
        });
      }

      appendSystemLog(`${backendAction} student registration account entry for ${studentName} (@${studentUsername})`);
      alert(`Student profile record marked as ${action === 'approve' ? 'Approved' : 'Rejected'} successfully.`);
      fetchAllDashboardData(); // Sync live view components table states
    } catch (err) {
      console.error(err);
      alert("Error processing student verification change parameters.");
    }
  };

  // Step A: Triggers the new visual custom modal instead of the raw window prompt box
  const handleRemoveUserProfile = (targetUsername, targetRole) => {
    setDeleteModal({
      isOpen: true,
      targetUsername,
      targetRole
    });
  };

  // Step B: Fires the actual API operation once the user confirms inside the modal card
  const executeConfirmedPurge = async () => {
    const { targetUsername, targetRole } = deleteModal;
    
    try {
      // Close the modal instantly
      setDeleteModal({ isOpen: false, targetUsername: '', targetRole: '' });
      
      // Hits your live backend DELETE endpoint
      await API.delete(`/admin/purge-user/${targetUsername}`);
      
      appendSystemLog(`Permanently DELETED and purged ${targetRole} registration profile node [@${targetUsername}]`);
      
      // 🟢 FIXED: Replaced raw browser alert layout with your custom premium StatusToast trigger
      setShowToast(true);
      
      fetchAllDashboardData(); // Refresh table datasets
    } catch (err) {
      alert("Server rejection: Could not delete user file due to active constraint keys.");
    }
  };


  // Live Assessment Unlock and Retake Evaluation Logic Gateway
  const handleProcessRetake = async (requestId, studentUsername, action) => {
    try {
      const backendAction = action === 'approve' ? 'APPROVED' : 'REJECTED';
      
      // Hits: POST /api/admin/process-retake
      await API.post('/admin/process-retake', {
        requestId: requestId.toString(),
        action: backendAction
      });

      if (action === 'approve') {
        alert(`Retake access cleared. ${studentUsername}'s attempt registry has been unlocked inside MySQL repositories.`);
      } else {
        alert(`Retake request for ${studentUsername} denied.`);
      }

      appendSystemLog(`${backendAction} assessment retake clearance request for user ${studentUsername}`);
      fetchAllDashboardData();
    } catch (err) {
      alert("Failed to process retake verification command.");
    }
  };

  if (loading) return <div className={styles.adminMainViewport} style={{ color: 'white', padding: '2rem' }}>Hydrating academic dashboards out of ExamsSphere server...</div>;
  if (error) return <div className={styles.adminMainViewport} style={{ color: 'var(--color-danger)', padding: '2rem' }}>{error}</div>;

  return (
    <div className={styles.adminMainViewport}>
      <header className={styles.topNavbar}>
        <div className={styles.brandTitle}>
          <ShieldAlert size={22} color="var(--color-danger)" />
          <span>ExamsSphere <small>Principal Portal</small></span>
        </div>
        <div className={styles.adminMetaSection}>
          <div 
            className={styles.adminMeta} 
            onClick={() => navigate('/Profile')}
            style={{ cursor: 'pointer' }}
            title="View & Edit Principal Profile Settings"
          >
            <strong>{user?.fullName || 'Dr. K. S. Sharma'}</strong>
            <span style={{ color: '#94a3b8' }}>Role: Principal (Head of Institution)</span>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login'); 
            }} 
            className={styles.logoutBtn}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className={styles.workspaceSplitContainer}>
        <main className={styles.primaryContentBlock}>
          <section className={styles.metricsCardGrid} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <div onClick={() => setActiveTab('approvals')} className={`${styles.metricItemCard} ${activeTab === 'approvals' ? styles.activeCardMetric : ''}`}>
              <UserCheck size={24} color="#ea580c" />
              <div><h3>{pendingStudentsList.length}</h3><span>Pending Files</span></div>
            </div>
            <div onClick={() => setActiveTab('students')} className={`${styles.metricItemCard} ${activeTab === 'students' ? styles.activeCardMetric : ''}`}>
              <Users size={24} color="#16a34a" />
              <div><h3>{approvedStudentsList.length}</h3><span>Enrolled Students</span></div>
            </div>
            <div onClick={() => setActiveTab('teachers')} className={`${styles.metricItemCard} ${activeTab === 'teachers' ? styles.activeCardMetric : ''}`}>
              <UserPlus size={24} color="#2563eb" />
              <div><h3>{teachersList.length}</h3><span>Faculty Teachers</span></div>
            </div>
            <div onClick={() => setActiveTab('exams')} className={`${styles.metricItemCard} ${activeTab === 'exams' ? styles.activeCardMetric : ''}`}>
              <FileSpreadsheet size={24} color="#64748b" />
              <div><h3>{exams.length}</h3><span>Scheduled Exams</span></div>
            </div>
            <div onClick={() => setActiveTab('retakes')} className={`${styles.metricItemCard} ${activeTab === 'retakes' ? styles.activeCardMetric : ''}`}>
              <Activity size={24} color="var(--color-danger)" />
              <div><h3>{retakeRequests.length}</h3><span>Retake Requests</span></div>
            </div>
          </section>

          <div className={styles.contentDisplayCard}>
            {activeTab === 'approvals' && (
              <div>
                <h2 className={styles.viewHeadlineTitle}>Student Admission Verification Queue</h2>
                {pendingStudentsList.length === 0 ? (
                  <p className={styles.emptyRequestsPlaceholderText}>No new student registration profiles are waiting inside the verification workspace.</p>
                ) : (
                  <table className={styles.adminDataGridTable}>
                    <thead>
                      <tr><th>Student Name</th><th>Stream Branch</th><th>Email Reference</th><th>Username Handle</th><th>Verification Options</th></tr>
                    </thead>
                    <tbody>
                      {pendingStudentsList.map((s) => (
                        <tr key={s.userId}>
                          <td><strong>{s.fullName}</strong></td>
                          <td><span className={styles.streamBadgeTag}>{s.classStream}</span></td>
                          <td><code>{s.email || 'N/A'}</code></td>
                          <td><code>@{s.username}</code></td>
                          <td>
                            <div className={styles.actionButtonPillWrapperStack}>
                              <button onClick={() => handleProcessStudentAdmission(s.username, s.email, s.fullName, 'approve')} className={styles.tableInlineApproveActionActionBtn} style={{ backgroundColor: '#e6f4ea', color: 'var(--color-success)' }}><Check size={14} /> Approve admission</button>
                              <button onClick={() => handleProcessStudentAdmission(s.username, s.email, s.fullName, 'reject')} className={styles.tableInlineDenyActionActionBtn}><X size={14} /> Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'exams' && (
              <div>
                <h2 className={styles.viewHeadlineTitle}>Active University Examination Matrix</h2>
                <table className={styles.adminDataGridTable}>
                  <thead>
                    <tr><th>Stream</th><th>Exam Title</th><th>Allocated Course Subject</th><th>Evaluation Limit</th></tr>
                  </thead>
                  <tbody>
                    {exams.map(e => (
                      <tr key={e.examId}>
                        <td><span className={styles.streamBadgeTag}>{e.stream}</span></td>
                        <td><strong>{e.title}</strong></td>
                        <td>{e.subject}</td>
                        <td>{e.durationMinutes} Minutes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className={styles.viewHeadlineTitle}>Verified Enrolled Student Directory Index</h2>
                <table className={styles.adminDataGridTable}>
                  <thead>
                    <tr><th>Full Name</th><th>Stream Branch</th><th>Username ID</th><th>DOB</th><th>Oversight Actions</th></tr>
                  </thead>
                  <tbody>
                    {approvedStudentsList.map((s) => (
                      <tr key={s.userId}>
                        <td><strong>{s.fullName}</strong></td>
                        <td><span className={styles.streamBadgeTag}>{s.classStream}</span></td>
                        <td><code>{s.username}</code></td>
                        <td>{s.dob}</td>
                        <td>
                          <button onClick={() => handleRemoveUserProfile(s.username, 'student')} className={styles.inlineDeleteRowBtn} title="Purge Student Profile"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className={styles.teachersTwinLayoutSplit}>
                <div>
                  <h2 className={styles.viewHeadlineTitle}>Faculty Teacher Registrations</h2>
                  <table className={styles.adminDataGridTable}>
                    <thead>
                      <tr><th>Faculty Name</th><th>Username</th><th>Core Qualification</th><th>Oversight Actions</th></tr>
                    </thead>
                    <tbody>
                      {teachersList.map((t) => (
                        <tr key={t.userId}>
                          <td><strong>{t.fullName}</strong></td>
                          <td><code>{t.username}</code></td>
                          <td>{t.qualification}</td>
                          <td>
                            <button onClick={() => handleRemoveUserProfile(t.username, 'teacher')} className={styles.inlineDeleteRowBtn} title="Purge Teacher Profile"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.addTeacherFormPanelCard}>
                  <h3>Register New Faculty Profile</h3>
                  <form onSubmit={handleAddTeacherSubmit} className={styles.teacherFormInputGrid}>
                    <input type="text" placeholder="Full Name (e.g., Dr. Roy)" required value={teacherForm.fullName} onChange={e => setTeacherForm({...teacherForm, fullName: e.target.value})} />
                    <input type="email" placeholder="Faculty Email Address" required value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} />
                    <input type="text" placeholder="Username Handle" required value={teacherForm.username} onChange={e => setTeacherForm({...teacherForm, username: e.target.value})} />
                    <input type="password" placeholder="System Passcode Access Key" required value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} />
                    <input type="text" placeholder="Qualification (e.g., Ph.D. in IT)" required value={teacherForm.qualification} onChange={e => setTeacherForm({...teacherForm, qualification: e.target.value})} />
                    <input type="text" placeholder="Subject Expertise" required value={teacherForm.subjectExpertise} onChange={e => setTeacherForm({...teacherForm, subjectExpertise: e.target.value})} />
                    <button type="submit" className={styles.formTeacherRegisterActionSubmitBtn}>Provision Faculty Account</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'retakes' && (
              <div>
                <h2 className={styles.viewHeadlineTitle}>Pending Assessment Unlock Clearance Requests</h2>
                {retakeRequests.length === 0 ? (
                  <p className={styles.emptyRequestsPlaceholderText}>No unresolved student exam retake requests are currently pending inside the administrative pool.</p>
                ) : (
                  <table className={styles.adminDataGridTable}>
                    <thead>
                      <tr><th>Student User ID</th><th>Requested Exam Targeted Node</th><th>Current Status Tracking</th><th>Actions Authorization</th></tr>
                    </thead>
                    <tbody>
                      {retakeRequests.map(r => (
                        <tr key={r.requestId}>
                          <td><code>{r.student?.username}</code></td>
                          <td><strong>{r.exam?.title}</strong></td>
                          <td><span className={styles.pendingStatusBadgeIndicator}>{r.status}</span></td>
                          <td>
                            <div className={styles.actionButtonPillWrapperStack}>
                              <button onClick={() => handleProcessRetake(r.requestId, r.student?.username, 'approve')} className={styles.tableInlineApproveActionActionBtn}><Check size={14} /> Clear Retake</button>
                              <button onClick={() => handleProcessRetake(r.requestId, r.student?.username, 'deny')} className={styles.tableInlineDenyActionActionBtn}><X size={14} /> Deny</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>

        <aside className={styles.activityFeedAuditLogsSidebarPanel}>
          <h3 className={styles.sidebarSectionHeadingTitle}><Activity size={16} color="var(--color-primary)" /> Global System Activity Log</h3>
          <div className={styles.systemScrollingLogsVerticalContainerList}>
            {systemLogs.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem', padding: '1rem' }}>No session events triggered yet.</p>
            ) : (
              systemLogs.map(log => (
                <div key={log.id} className={styles.individualLogItemRowNode}>
                  <div className={styles.logMetaMetaHeaderRow}>
                    <span className={styles.logActorUsernameTextLabel}>@{log.user}</span>
                    <span className={styles.logTimestampStringTextLabel}>{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className={styles.logMessageContentStringDescriptionBody}>{log.action}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {simulatedEmailNotification && (
        <div className={styles.emailNotificationModalPopupOverlay}>
          <div className={styles.emailContentCardFrameBox}>
            <div className={styles.emailModalHeaderTopSummaryArea}>
              <Mail size={24} color="var(--color-success)" />
              <h4>Simulated Server Email Outbox Dispatch</h4>
            </div>
            {simulatedEmailNotification.type === 'STUDENT_WELCOME' ? (
              <div className={styles.simulatedEmailRawBodyContainerBlock}>
                <p><strong>From:</strong> {user?.fullName || 'Office of the Principal'} &lt;{user?.email || 'principal.office@university.edu'}&gt;</p>
                <p><strong>To:</strong> {simulatedEmailNotification.to} &lt;{simulatedEmailNotification.email}&gt;</p>
                <p><strong>Subject:</strong> Admission Verified: Welcome to ExamsSphere Portal</p>
                <hr />
                <p>Dear {simulatedEmailNotification.to},</p>
                <p>Great news! The Principal has successfully verified your identity data parameters against our official university campus registration records.</p>
                <p>Your institutional portal access block has been removed. You can now use your chosen username handle <strong><code>@{simulatedEmailNotification.username}</code></strong> to sign in and complete scheduled examinations.</p>
                <br />
                <p>Best regards,<br />Office of the Principal, Academic Verification Bureau</p>
              </div>
            ) : (
              <div className={styles.simulatedEmailRawBodyContainerBlock}>
                <p><strong>From:</strong> {user?.fullName || 'Office of the Principal'} &lt;{user?.email || 'principal.office@university.edu'}&gt;</p>
                <p><strong>To:</strong> {simulatedEmailNotification.to} &lt;{simulatedEmailNotification.email}&gt;</p>
                <p><strong>Subject:</strong> Account Provisioned: Welcome to ExamsSphere Portal</p>
                <hr />
                <p>Dear {simulatedEmailNotification.to},</p>
                <p>Your administrator profile has successfully generated your core operational access key credentials within our primary evaluation cluster network portal.</p>
                <p>Use the following authentication parameters to log in, construct subject questions parameters datasets, and monitor grading metrics:</p>
                <ul>
                  <li><strong>Portal Login Username ID:</strong> <code>{simulatedEmailNotification.username}</code></li>
                  <li><strong>Assigned Initial Access Passcode:</strong> <code>{simulatedEmailNotification.password}</code></li>
                </ul>
                <br />
                <p>Best regards,<br />University Evaluation Bureau Office Control</p>
              </div>
            )}
            <button onClick={() => setSimulatedEmailNotification(null)} className={styles.closeEmailToastBtn}>Close Notification Overlay</button>
          </div>
        </div>
      )}

      {/* 🟢 CONFIRMATION ALERT MODAL INTEGRATION */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, targetUsername: '', targetRole: '' })}
        onConfirm={executeConfirmedPurge}
        title="Confirm Profile Permanent Purge"
        message={`Are you absolutely certain you want to remove the ${deleteModal.targetRole} profile for @${deleteModal.targetUsername}? All system access, registries, and progress states associated with this user will be permanently deleted from MySQL databases.`}
      />

      {/* 🟢 NEW PREMIUM CARD TOAST NOTIFICATION FOR USER PURGES */}
      <StatusToast 
        show={showToast} 
        message="The faculty profile handle was successfully wiped out." 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}