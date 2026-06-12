import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { examQuestions, initialExams } from '../../services/mockData';
import { useNavigate, useParams } from 'react-router-dom';
import { Timer, AlertTriangle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import styles from './LiveExam.module.css';

export default function LiveExam() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Simulated exam target selection (defaults to BCA exam for sandbox testing)
  const examId = "exam-react-202"; 
  const examMeta = initialExams.find(e => e.id === examId);
  const questions = examQuestions[examId] || [];

  // Active state management tracking
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Persistent Answer State: Load previous progress or start empty
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const savedAns = localStorage.getItem(`exam_ans_${examId}`);
    return savedAns ? JSON.parse(savedAns) : {};
  });

  // Persistent Timer State: Set up countdown cache markers
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`exam_time_${examId}`);
    if (savedTime) return parseInt(savedTime, 10);
    return examMeta ? examMeta.durationMinutes * 60 : 30 * 60;
  });

  // Sync answer arrays to localStorage on modification
  useEffect(() => {
    localStorage.setItem(`exam_ans_${examId}`, JSON.stringify(selectedAnswers));
  }, [selectedAnswers, examId]);

  // Countdown timer processing effect loop
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = prev - 1;
        localStorage.setItem(`exam_time_${examId}`, nextTime.toString());
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, examId]);

  const handleOptionSelect = (optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: optionIdx
    }));
  };

  // Automated trigger when time runs out
  const handleAutoSubmit = () => {
    alert("Time has completely expired! Your current progress is being automatically processed.");
    submitExamEvaluation();
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you absolutely sure you want to end your exam and submit answers for continuous grading?")) {
      submitExamEvaluation();
    }
  };

  const submitExamEvaluation = () => {
    // Basic automatic evaluator script computation logic
    let scoreCount = 0;
    const activeQuestionsList = examQuestions[examId] || [];
    
    activeQuestionsList.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        scoreCount += 1;
      }
    });

    const percentageScore = Math.round((scoreCount / activeQuestionsList.length) * 100);

    // Save final grade directly into user context profile state logs
    if (user) {
      const currentAttempts = { ...user.attempts };
      currentAttempts[examId] = percentageScore;
      updateUserProfile({ attempts: currentAttempts });
    }

    // Clean up local layout storage footprints
    localStorage.removeItem(`exam_ans_${examId}`);
    localStorage.removeItem(`exam_time_${examId}`);

    navigate('/ResultPage', { state: { score: percentageScore, total: activeQuestionsList.length } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!examMeta || questions.length === 0) {
    return <div className={styles.loadingWrapper}>Exam data error or structure unassigned.</div>;
  }

  const activeQuestion = questions[currentIdx];

  return (
    <div className={styles.examMainViewport}>
      {/* Upper Status Panel */}
      <header className={styles.examTopBar}>
        <div className={styles.metaTitleGroup}>
          <h2>{examMeta.title}</h2>
          <span>Allocated Stream: <strong>{examMeta.stream}</strong></span>
        </div>
        <div className={`${styles.timerBlock} ${timeLeft < 120 ? styles.criticalTime : ''}`}>
          <Timer size={20} />
          <span className={styles.countdownValue}>{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Container System Split Layout */}
      <div className={styles.workspaceBodySplit}>
        {/* Left Side: Dynamic Workspace Area */}
        <main className={styles.questionPanelArea}>
          <div className={styles.questionCardContainer}>
            <div className={styles.cardIndicatorHeader}>
              <span>Question {currentIdx + 1} of {questions.length}</span>
              {selectedAnswers[activeQuestion.id] !== undefined && (
                <span className={styles.savedStatusBadge}>Answer Logged</span>
              )}
            </div>
            
            <h3 className={styles.questionPromptText}>{activeQuestion.text}</h3>

            <div className={styles.optionsStackLayout}>
              {activeQuestion.options.map((optionText, idx) => {
                const isSelected = selectedAnswers[activeQuestion.id] === idx;
                return (
                  <label 
                    key={idx} 
                    className={`${styles.customOptionSelectorRow} ${isSelected ? styles.selectedRowOption : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question_choice_${activeQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(idx)}
                    />
                    <span className={styles.optionAlphaMarker}>{String.fromCharCode(65 + idx)}</span>
                    <span className={styles.optionBodyText}>{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Nav Actions Row */}
          <div className={styles.navigationControlDock}>
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className={styles.secondaryNavBtn}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className={styles.primaryNavBtn}
              >
                Next Question <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleManualSubmit} className={styles.submitFinalAssessmentBtn}>
                <Send size={18} /> Finalize & Submit Exam
              </button>
            )}
          </div>
        </main>

        {/* Right Side: Navigation Tracker Sidebar */}
        <aside className={styles.trackerSidebarPanel}>
          <h3>Assessment Overview</h3>
          <p className={styles.sidebarInstructions}>Click any box label sequence to instantly toggle your active view node context.</p>
          
          <div className={styles.questionNumbersGridTrack}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = selectedAnswers[q.id] !== undefined;
              
              let boxStyleClass = styles.numberNodeBox;
              if (isCurrent) boxStyleClass += ` ${styles.nodeActive}`;
              else if (isAnswered) boxStyleClass += ` ${styles.nodeAnswered}`;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={boxStyleClass}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>

          <div className={styles.securityWarningNoticeBlock}>
            <AlertTriangle size={20} />
            <div>
              <h4>Security Protocol</h4>
              <p>Refreshing your browser tab will not clear active tracking cache indices, but clock exhaustion continues seamlessly.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}