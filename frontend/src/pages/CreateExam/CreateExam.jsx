// src/pages/CreateExam/CreateExam.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import styles from './CreateExam.module.css';

export default function CreateExam() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with one blank question
  const [questions, setQuestions] = useState([
    {
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) {
      alert("An exam must contain at least one question.");
      return;
    }
    setQuestions(prev => prev.filter((_, qIdx) => qIdx !== idx));
  };

  const handleQuestionTextChange = (qIdx, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].text = value;
      return copy;
    });
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = value;
      return copy;
    });
  };

  const handleCorrectIndexChange = (qIdx, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].correctIndex = parseInt(value);
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!title || !subject || !description) {
      alert("Please fill in all core exam metadata fields.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question #${i + 1} cannot be left empty.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Option ${String.fromCharCode(65 + j)} for Question #${i + 1} cannot be left empty.`);
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      const examPayload = {
        title,
        subject,
        durationMinutes,
        difficulty,
        description,
        questions
      };
      
      await api.createExam(examPayload);
      alert("Examination successfully created and published!");
      navigate('/admin');
    } catch (err) {
      console.error("Error saving exam", err);
      alert("Failed to publish exam. Please check logs.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/admin')} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Administrative Panel</span>
      </button>

      <form onSubmit={handleSubmit} className={styles.formLayout}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Examination Builder</h1>
            <p className={styles.subtitle}>Define metadata parameters and formulate multiple choice question items.</p>
          </div>
          <button 
            type="submit" 
            disabled={isSaving}
            className={styles.saveBtn}
          >
            <Save size={18} />
            <span>{isSaving ? 'Publishing...' : 'Publish Assessment'}</span>
          </button>
        </header>

        {/* Core Metadata Fields */}
        <section className={styles.metaSection}>
          <h2 className={styles.sectionTitle}>1. Assessment Specifications</h2>
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Exam Title</label>
              <input
                type="text"
                required
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Python Basics & Functions"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Subject Domain</label>
              <input
                type="text"
                required
                className={styles.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Backend Engineering"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Duration (Minutes)</label>
              <input
                type="number"
                required
                min="5"
                max="300"
                className={styles.input}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Difficulty Rating</label>
              <select 
                className={styles.select}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel}>Exam Summary / Instructions Description</label>
            <textarea
              required
              rows="2"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of subjects, guidelines, and pass limits."
            />
          </div>
        </section>

        {/* Dynamic Questions Form Listing */}
        <section className={styles.questionsSection}>
          <div className={styles.questionsHeader}>
            <h2 className={styles.sectionTitle}>2. Questions List ({questions.length})</h2>
            <button 
              type="button" 
              onClick={handleAddQuestion}
              className={styles.addBtn}
            >
              <Plus size={16} />
              <span>Add Question Item</span>
            </button>
          </div>

          <div className={styles.questionsStack}>
            {questions.map((question, qIdx) => (
              <div key={qIdx} className={styles.questionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.questionNumber}>
                    <HelpCircle size={16} />
                    <span>Question Item #{qIdx + 1}</span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className={styles.removeBtn}
                    title="Remove Question"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>

                <div className={styles.questionFields}>
                  <div className={styles.fieldGroupFull}>
                    <label className={styles.fieldLabel}>Question Statement</label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={question.text}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      placeholder="Write your MCQ question details here..."
                    />
                  </div>

                  {/* Options items */}
                  <div className={styles.optionsGrid}>
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className={styles.optionInputWrapper}>
                        <span className={styles.optionLetter}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <input
                          type="text"
                          required
                          className={styles.input}
                          value={option}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          placeholder={`Enter Option ${String.fromCharCode(65 + optIdx)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.keySelectionRow}>
                    <label className={styles.keyLabel}>Correct Option Answer Key:</label>
                    <select
                      className={styles.keySelect}
                      value={question.correctIndex}
                      onChange={(e) => handleCorrectIndexChange(qIdx, e.target.value)}
                    >
                      {question.options.map((_, optIdx) => (
                        <option key={optIdx} value={optIdx}>
                          Option {String.fromCharCode(65 + optIdx)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>
    </div>
  );
}
