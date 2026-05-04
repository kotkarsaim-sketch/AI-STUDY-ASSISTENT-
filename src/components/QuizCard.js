'use client';

import { useState, useCallback } from 'react';
import { useStudy } from '@/context/StudyContext';
import QuizAnalytics from './QuizAnalytics';
import { Trophy, ArrowRight, RotateCcw, BarChart3, Zap, Brain, Flame } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', icon: Zap, color: 'var(--accent-emerald)' },
  medium: { label: 'Medium', icon: Brain, color: 'var(--accent-amber)' },
  hard: { label: 'Hard', icon: Flame, color: 'var(--accent-red)' },
};

export default function QuizCard({ questions }) {
  const { regenerateQuiz, recordQuizAnswer, quizDifficulty } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const currentQuestion = questions[currentIndex];
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = useCallback((optionIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) setScore(prev => prev + 1);

    // Record for adaptive tracking
    if (currentQuestion.topic) {
      recordQuizAnswer(currentQuestion.topic, isCorrect);
    }
  }, [isAnswered, currentQuestion, recordQuizAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  }, []);

  const handleChangeDifficulty = useCallback((diff) => {
    regenerateQuiz(diff);
    handleRestart();
  }, [regenerateQuiz, handleRestart]);

  const getOptionClass = (index) => {
    if (!isAnswered) return index === selectedAnswer ? 'selected' : '';
    if (index === currentQuestion.correctIndex) return 'correct disabled';
    if (index === selectedAnswer) return 'incorrect disabled';
    return 'disabled';
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Not enough content to generate quiz questions. Try adding more detailed notes.
        </p>
      </div>
    );
  }

  if (showAnalytics) {
    return (
      <div className="quiz-container">
        <QuizAnalytics />
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-secondary" onClick={() => setShowAnalytics(false)}>
            Back to Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = 'Outstanding! You really know this material!';
    if (percentage < 50) message = 'Keep studying! Review the material and try again.';
    else if (percentage < 75) message = 'Good effort! A little more review and you\'ll master it.';
    else if (percentage < 100) message = 'Great job! Almost perfect!';

    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <div className="quiz-complete-ring">
            <svg viewBox="0 0 100 100" className="quiz-ring-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#quizGradient)" strokeWidth="6"
                strokeLinecap="round" strokeDasharray={`${percentage * 2.64} 264`}
                transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
              <defs>
                <linearGradient id="quizGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-blue)" />
                  <stop offset="100%" stopColor="var(--accent-emerald)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="quiz-ring-text">
              <span className="quiz-ring-score">{score}/{questions.length}</span>
            </div>
          </div>
          <h2 className="quiz-complete-title">Quiz Complete!</h2>
          <p className="quiz-complete-message">{message}</p>

          <div className="quiz-complete-actions">
            <button className="btn btn-primary" onClick={handleRestart} id="quiz-restart-btn">
              <RotateCcw size={18} /> Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAnalytics(true)} id="quiz-analytics-btn">
              <BarChart3 size={18} /> View Analytics
            </button>
          </div>

          {percentage < 75 && (
            <div className="quiz-difficulty-suggest">
              <p>Try a different difficulty:</p>
              <div className="quiz-difficulty-btns">
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <button key={key} className={`quiz-diff-btn ${quizDifficulty === key ? 'active' : ''}`}
                    onClick={() => handleChangeDifficulty(key)}
                    style={{ '--diff-color': config.color }}>
                    <config.icon size={14} /> {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Difficulty Selector */}
      <div className="quiz-top-bar">
        <div className="quiz-difficulty-selector">
          {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
            <button key={key}
              className={`quiz-diff-btn ${quizDifficulty === key ? 'active' : ''}`}
              onClick={() => handleChangeDifficulty(key)}
              style={{ '--diff-color': config.color }}
              id={`quiz-diff-${key}`}
            >
              <config.icon size={14} /> {config.label}
            </button>
          ))}
        </div>
        <button className="btn btn-icon" onClick={() => setShowAnalytics(true)} title="View Analytics">
          <BarChart3 size={18} />
        </button>
      </div>

      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className="quiz-score">
          <Trophy size={16} className="quiz-score-icon" />
          Score: {score}
        </div>
      </div>

      <div className="quiz-question-card">
        {currentQuestion.difficulty && (
          <span className="quiz-difficulty-badge"
            style={{ background: DIFFICULTY_CONFIG[currentQuestion.difficulty]?.color || 'var(--accent-blue)' }}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
        )}
        <div className="quiz-question-number">{currentIndex + 1}</div>
        <h3 className="quiz-question-text">{currentQuestion.question}</h3>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button key={index} className={`quiz-option ${getOptionClass(index)}`}
              onClick={() => handleSelect(index)} disabled={isAnswered} id={`quiz-option-${index}`}>
              <span className="quiz-option-letter">{letters[index]}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`quiz-feedback ${selectedAnswer === currentQuestion.correctIndex ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === currentQuestion.correctIndex
              ? '✓ Correct! Well done!'
              : `✗ Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
          </div>
        )}

        {isAnswered && (
          <div className="quiz-nav">
            <button className="btn btn-primary" onClick={handleNext} id="quiz-next-btn">
              {currentIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight size={18} /></>
              ) : (
                <>See Results <Trophy size={18} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
