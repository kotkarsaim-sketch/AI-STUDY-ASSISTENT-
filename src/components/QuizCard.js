'use client';

import { useState, useCallback } from 'react';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizCard({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = useCallback((optionIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  }, [isAnswered, currentQuestion]);

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

  const getOptionClass = (index) => {
    if (!isAnswered) {
      return index === selectedAnswer ? 'selected' : '';
    }
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

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let emoji = '🎉';
    let message = 'Outstanding! You really know this material!';
    if (percentage < 50) {
      emoji = '📚';
      message = 'Keep studying! Review the material and try again.';
    } else if (percentage < 75) {
      emoji = '👍';
      message = 'Good effort! A little more review and you\'ll master it.';
    } else if (percentage < 100) {
      emoji = '🌟';
      message = 'Great job! Almost perfect!';
    }

    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <div className="quiz-complete-icon">{emoji}</div>
          <h2 className="quiz-complete-title">Quiz Complete!</h2>
          <div className="quiz-complete-score gradient-text">
            {score}/{questions.length}
          </div>
          <p className="quiz-complete-message">{message}</p>
          <button className="btn btn-primary" onClick={handleRestart} id="quiz-restart-btn">
            <RotateCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="quiz-score">
          <Trophy size={16} className="quiz-score-icon" />
          Score: {score}
        </div>
      </div>

      <div className="quiz-question-card">
        <div className="quiz-question-number">{currentIndex + 1}</div>
        <h3 className="quiz-question-text">{currentQuestion.question}</h3>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${getOptionClass(index)}`}
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              id={`quiz-option-${index}`}
            >
              <span className="quiz-option-letter">{letters[index]}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`quiz-feedback ${selectedAnswer === currentQuestion.correctIndex ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === currentQuestion.correctIndex
              ? '✓ Correct! Well done!'
              : `✗ Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
            }
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
