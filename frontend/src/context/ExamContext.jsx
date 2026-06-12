// src/context/ExamContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const [activeExam, setActiveExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStatus, setExamStatus] = useState('idle'); // 'idle' | 'instructions' | 'active' | 'finished'
  const [latestResult, setLatestResult] = useState(null);

  const timerRef = useRef(null);

  // Sync state with localStorage on initial render
  useEffect(() => {
    const savedExam = localStorage.getItem('oes_active_exam');
    const savedAnswers = localStorage.getItem('oes_exam_answers');
    const savedStatus = localStorage.getItem('oes_exam_status');

    if (savedExam && savedStatus) {
      const exam = JSON.parse(savedExam);
      setActiveExam(exam);
      setExamStatus(savedStatus);
      
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }

      // Restore questions
      api.getExamQuestions(exam.id).then((questionsData) => {
        setQuestions(questionsData);
        
        if (savedStatus === 'active') {
          initializeTimer(exam.id);
        }
      });
    }
  }, []);

  // Timer runner
  const initializeTimer = (examId) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const savedExpiry = localStorage.getItem(`oes_exam_expiry_${examId}`);
    let expiryTime = savedExpiry ? parseInt(savedExpiry) : null;

    if (!expiryTime) {
      const duration = JSON.parse(localStorage.getItem('oes_active_exam')).durationMinutes;
      expiryTime = Date.now() + duration * 60 * 1000;
      localStorage.setItem(`oes_exam_expiry_${examId}`, expiryTime.toString());
    }

    const updateTimer = () => {
      const remainingTime = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(timerRef.current);
        // Auto-submit when time runs out
        submitExam(true);
      }
    };

    updateTimer(); // Initial call
    timerRef.current = setInterval(updateTimer, 1000);
  };

  const startInstructions = (exam) => {
    setActiveExam(exam);
    setExamStatus('instructions');
    setAnswers({});
    setQuestions([]);
    
    localStorage.setItem('oes_active_exam', JSON.stringify(exam));
    localStorage.setItem('oes_exam_status', 'instructions');
    localStorage.removeItem('oes_exam_answers');
  };

  const startExam = async () => {
    if (!activeExam) return;
    
    setIsSubmitting(true);
    try {
      const questionsData = await api.getExamQuestions(activeExam.id);
      setQuestions(questionsData);
      setExamStatus('active');
      localStorage.setItem('oes_exam_status', 'active');
      
      initializeTimer(activeExam.id);
    } catch (error) {
      console.error("Failed to load exam questions", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectAnswer = (questionId, optionIndex) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    setAnswers(updatedAnswers);
    localStorage.setItem('oes_exam_answers', JSON.stringify(updatedAnswers));
  };

  const submitExam = async (isAutoSubmit = false) => {
    if (!activeExam || isSubmitting) return;

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Calculate scores
      let correctCount = 0;
      questions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer !== undefined && userAnswer === q.correctIndex) {
          correctCount++;
        }
      });

      const totalQuestions = questions.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // Get time spent
      const expiryTime = parseInt(localStorage.getItem(`oes_exam_expiry_${activeExam.id}`));
      const totalSeconds = activeExam.durationMinutes * 60;
      const secondsLeft = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      const timeSpentSeconds = isAutoSubmit ? totalSeconds : (totalSeconds - secondsLeft);

      const resultPayload = {
        examId: activeExam.id,
        examTitle: activeExam.title,
        score,
        totalQuestions,
        correctCount,
        timeSpentSeconds
      };

      const savedResult = await api.submitResult(resultPayload);
      setLatestResult(savedResult);
      setExamStatus('finished');
      localStorage.setItem('oes_exam_status', 'finished');
      
      // Cleanup this specific exam cache from localStorage
      localStorage.removeItem('oes_active_exam');
      localStorage.removeItem('oes_exam_status');
      localStorage.removeItem('oes_exam_answers');
      localStorage.removeItem(`oes_exam_expiry_${activeExam.id}`);
      
      return savedResult;
    } catch (error) {
      console.error("Error submitting exam results", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveExam(null);
    setQuestions([]);
    setAnswers({});
    setTimeLeft(0);
    setExamStatus('idle');
    setLatestResult(null);

    // Clean storage
    localStorage.removeItem('oes_active_exam');
    localStorage.removeItem('oes_exam_status');
    localStorage.removeItem('oes_exam_answers');
  };

  // Auto clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const value = {
    activeExam,
    questions,
    answers,
    timeLeft,
    isSubmitting,
    examStatus,
    latestResult,
    startInstructions,
    startExam,
    selectAnswer,
    submitExam,
    resetExam
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
