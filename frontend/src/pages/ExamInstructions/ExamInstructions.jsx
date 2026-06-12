// src/pages/ExamInstructions/ExamInstructions.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useExam } from '../../context/ExamContext';
import { FileText, ShieldAlert, Award, Clock, ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react';
import styles from './ExamInstructions.module.css';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeExam, startInstructions, startExam } = useExam();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user loaded instructions directly by URL, restore in context
    if (!activeExam || activeExam.id !== id) {
      setLoading(true);
      api.getExamById(id).then((exam) => {
        if (exam) {
          startInstructions(exam);
        } else {
          navigate('/dashboard');
        }
      }).catch(err => {
        console.error("Failed to load instructions exam", err);
        navigate('/dashboard');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, activeExam]);

  const handleStart = async () => {
    await startExam();
    navigate(`/exam/live/${id}`);
  };

  if (loading || !activeExam) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading assessment specifications...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Return to Workspace</span>
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <FileText className={styles.titleIcon} size={28} />
            <div>
              <h1 className={styles.title}>{activeExam.title}</h1>
              <p className={styles.subtitle}>Please review the examination regulations and system rules before launching.</p>
            </div>
          </div>
          <span className={styles.badge}>{activeExam.subject}</span>
        </div>

        <div className={styles.grid}>
          {/* Instructions Panel */}
          <div className={styles.instructionsPanel}>
            <h2 className={styles.sectionTitle}>Examination Guidelines</h2>
            <ul className={styles.rulesList}>
              <li>
                <CheckCircle2 className={styles.ruleIcon} size={18} />
                <div>
                  <strong>Time Bound:</strong> You have exactly <strong>{activeExam.durationMinutes} minutes</strong> to complete this exam.
                </div>
              </li>
              <li>
                <CheckCircle2 className={styles.ruleIcon} size={18} />
                <div>
                  <strong>Timer Resilience:</strong> The timer runs continuously in the cloud. Refreshing the browser or closing the window <strong>will not pause</strong> the timer.
                </div>
              </li>
              <li>
                <CheckCircle2 className={styles.ruleIcon} size={18} />
                <div>
                  <strong>Auto Submission:</strong> When the time limit expires, all current selected answers are automatically submitted.
                </div>
              </li>
              <li>
                <CheckCircle2 className={styles.ruleIcon} size={18} />
                <div>
                  <strong>Single Attempt:</strong> Once you press 'Start Assessment', the attempt is recorded. You cannot restart or reuse links.
                </div>
              </li>
            </ul>

            <div className={styles.securityWarning}>
              <ShieldAlert className={styles.warningIcon} size={24} />
              <div>
                <strong>Proctoring & Integrity:</strong> Opening external browser tabs or switching application window focus during the live exam triggers safety reviews. Ensure your workspace is free of distractions.
              </div>
            </div>
          </div>

          {/* Quick specs card */}
          <div className={styles.specsPanel}>
            <h2 className={styles.sectionTitle}>Assessment Details</h2>
            
            <div className={styles.specBox}>
              <div className={styles.specItem}>
                <Clock className={styles.specIcon} size={20} />
                <div>
                  <span className={styles.specLabel}>Duration</span>
                  <span className={styles.specValue}>{activeExam.durationMinutes} Minutes</span>
                </div>
              </div>

              <div className={styles.specItem}>
                <Award className={styles.specIcon} size={20} />
                <div>
                  <span className={styles.specLabel}>Target Questions</span>
                  <span className={styles.specValue}>{activeExam.questionsCount} MCQs</span>
                </div>
              </div>

              <div className={styles.specItem}>
                <FileText className={styles.specIcon} size={20} />
                <div>
                  <span className={styles.specLabel}>Difficulty Tier</span>
                  <span className={styles.specValue}>{activeExam.difficulty}</span>
                </div>
              </div>
            </div>

            <button onClick={handleStart} className={styles.startBtn}>
              <PlayCircle size={20} />
              <span>Start Assessment Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
