// src/pages/ResultPage/ResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { api } from '../../services/api';
import { Award, Clock, ArrowRight, BarChart2, CheckCircle, XCircle } from 'lucide-react';
import styles from './ResultPage.module.css';

export default function ResultPage() {
  const { latestResult, resetExam } = useExam();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLatestResult() {
      if (latestResult) {
        setResult(latestResult);
        setLoading(false);
      } else {
        // Fallback to latest entry in metrics
        try {
          const metrics = await api.getMetrics();
          if (metrics && metrics.length > 0) {
            setResult(metrics[0]);
          }
        } catch (err) {
          console.error("Failed to load historical result", err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLatestResult();
  }, [latestResult]);

  const handleReturn = () => {
    resetExam();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Generating performance evaluation report...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.emptyContainer}>
        <p>No active assessment records found.</p>
        <button onClick={() => navigate('/dashboard')} className={styles.actionBtn}>
          Go to Workspace
        </button>
      </div>
    );
  }

  // Formatting variables
  const isPassed = result.score >= 70;
  const incorrectCount = result.totalQuestions - result.correctCount;
  const mins = Math.floor(result.timeSpentSeconds / 60);
  const secs = result.timeSpentSeconds % 60;

  // Custom feedback text
  let feedbackTitle = "Review Needed";
  let feedbackMessage = "Consider reviewing the core study topics and testing again to build confidence.";
  let statusThemeClass = styles.failedTheme;

  if (result.score >= 90) {
    feedbackTitle = "Mastery Level Accomplished!";
    feedbackMessage = "Exceptional performance. You've demonstrated a complete grasp of all critical subjects.";
    statusThemeClass = styles.masteryTheme;
  } else if (result.score >= 70) {
    feedbackTitle = "Assessment Successfully Passed!";
    feedbackMessage = "Great job! You have cleared the testing benchmark and verified your proficiency.";
    statusThemeClass = styles.passedTheme;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.resultCard} ${statusThemeClass}`}>
        <div className={styles.cardHeader}>
          <Award size={36} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Performance Report</h1>
            <p className={styles.subtitle}>{result.examTitle}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Visual Progress Doughnut Ring */}
          <div className={styles.chartPanel}>
            <div className={styles.doughnutOuter}>
              {/* Simple pure CSS conic gradient circle */}
              <div 
                className={styles.doughnutRing}
                style={{ 
                  background: `conic-gradient(var(--indicator-color) ${result.score}%, var(--color-bg-offset) 0)` 
                }}
              >
                <div className={styles.doughnutInner}>
                  <span className={styles.scoreVal}>{result.score}%</span>
                  <span className={styles.scoreLabel}>Final Grade</span>
                </div>
              </div>
            </div>
            <span className={`${styles.statusLabel} ${isPassed ? styles.statusPass : styles.statusFail}`}>
              {isPassed ? 'PASSING CREDENTIAL' : 'FAIL / RETAKE'}
            </span>
          </div>

          {/* Detailed metrics lists */}
          <div className={styles.detailsPanel}>
            <h2 className={styles.sectionTitle}>Evaluation Metrics</h2>
            
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <CheckCircle className={styles.correctIcon} size={20} />
                <span className={styles.statLabel}>Correct Answers</span>
                <span className={styles.statValue}>{result.correctCount} / {result.totalQuestions}</span>
              </div>
              
              <div className={styles.statBox}>
                <XCircle className={styles.incorrectIcon} size={20} />
                <span className={styles.statLabel}>Incorrect Answers</span>
                <span className={styles.statValue}>{incorrectCount} / {result.totalQuestions}</span>
              </div>
            </div>

            <div className={styles.metricItem}>
              <Clock size={18} className={styles.metricIcon} />
              <div className={styles.metricText}>
                <span className={styles.metricTitle}>Time Elapsed</span>
                <span className={styles.metricDesc}>
                  {mins} min {secs} sec of allowed test time
                </span>
              </div>
            </div>

            <div className={styles.metricItem}>
              <BarChart2 size={18} className={styles.metricIcon} />
              <div className={styles.metricText}>
                <span className={styles.metricTitle}>Pace Efficiency</span>
                <span className={styles.metricDesc}>
                  Average of {Math.round(result.timeSpentSeconds / result.totalQuestions)} seconds per question
                </span>
              </div>
            </div>

            <div className={styles.feedbackBlock}>
              <h3 className={styles.feedbackTitle}>{feedbackTitle}</h3>
              <p className={styles.feedbackText}>{feedbackMessage}</p>
            </div>

            <button onClick={handleReturn} className={styles.returnBtn}>
              <span>Return to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
