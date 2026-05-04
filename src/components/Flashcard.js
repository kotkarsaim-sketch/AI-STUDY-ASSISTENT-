'use client';

import { useState, useCallback, useMemo } from 'react';
import { useStudy } from '@/context/StudyContext';
import { getMasteryLevel, getTimeUntilReview, isDueForReview, QUICK_RATINGS } from '@/utils/sm2Algorithm';
import { ChevronLeft, ChevronRight, RotateCcw, Filter, Clock } from 'lucide-react';

export default function Flashcard({ flashcards }) {
  const { reviewFlashcard, getDueCards } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [dueOnly, setDueOnly] = useState(false);

  const displayCards = useMemo(() => {
    if (dueOnly) {
      const due = getDueCards();
      return due.length > 0 ? due : flashcards;
    }
    return flashcards;
  }, [dueOnly, flashcards, getDueCards]);

  const dueCount = useMemo(() => getDueCards().length, [getDueCards]);
  const currentCard = displayCards[currentIndex] || displayCards[0];
  const mastery = currentCard ? getMasteryLevel(currentCard) : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    if (!isFlipped) {
      setShowRating(true);
    }
  }, [isFlipped]);

  const handleRate = useCallback((quality) => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, quality);
    setShowRating(false);
    setIsFlipped(false);

    // Auto-advance after rating
    setTimeout(() => {
      if (currentIndex < displayCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [currentCard, reviewFlashcard, currentIndex, displayCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowRating(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < displayCards.length - 1) {
      setIsFlipped(false);
      setShowRating(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  }, [currentIndex, displayCards.length]);

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Not enough content to generate flashcards. Try adding more detailed notes.
        </p>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      {/* Top Controls */}
      <div className="flashcard-top-bar">
        <div className="flashcard-progress">
          Card {currentIndex + 1} of {displayCards.length}
        </div>
        <div className="flashcard-controls">
          {dueCount > 0 && (
            <button
              className={`flashcard-filter-btn ${dueOnly ? 'active' : ''}`}
              onClick={() => { setDueOnly(!dueOnly); setCurrentIndex(0); setIsFlipped(false); setShowRating(false); }}
              id="flashcard-due-filter"
            >
              <Filter size={14} />
              Due ({dueCount})
            </button>
          )}
        </div>
      </div>

      {/* Mastery Bar */}
      <div className="flashcard-mastery-bar">
        <span className="flashcard-mastery-label">Mastery</span>
        <div className="flashcard-mastery-track">
          <div className="flashcard-mastery-fill" style={{ width: `${mastery}%` }} />
        </div>
        <span className="flashcard-mastery-pct">{mastery}%</span>
      </div>

      {/* Card */}
      <div className="flashcard-scene" onClick={handleFlip} id="flashcard-scene">
        <div className={`flashcard-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-face flashcard-front">
            <div className="flashcard-label">Term</div>
            <div className="flashcard-text">{currentCard?.term}</div>
            <div className="flashcard-hint">
              <RotateCcw size={12} /> Click to flip
            </div>
            {currentCard && (
              <div className="flashcard-review-info">
                <Clock size={12} />
                {isDueForReview(currentCard) ? 'Due now' : `Next: ${getTimeUntilReview(currentCard)}`}
              </div>
            )}
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-label">Definition</div>
            <div className="flashcard-text">{currentCard?.definition}</div>
            <div className="flashcard-hint">
              <RotateCcw size={12} /> Click to flip back
            </div>
          </div>
        </div>
      </div>

      {/* SM-2 Rating Buttons */}
      {showRating && isFlipped && (
        <div className="flashcard-rating animate-fadeInUp" id="flashcard-rating">
          <p className="flashcard-rating-prompt">How well did you know this?</p>
          <div className="flashcard-rating-buttons">
            {QUICK_RATINGS.map(rating => (
              <button
                key={rating.value}
                className="flashcard-rate-btn"
                onClick={(e) => { e.stopPropagation(); handleRate(rating.value); }}
                style={{ '--rate-color': rating.color }}
                id={`rate-${rating.label.toLowerCase()}`}
              >
                <span className="rate-icon">{rating.icon}</span>
                <span className="rate-label">{rating.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Dots */}
      <div className="flashcard-progress-dots">
        {displayCards.map((card, i) => (
          <div
            key={i}
            className={`flashcard-dot ${i === currentIndex ? 'active' : ''} ${getMasteryLevel(card) >= 80 ? 'mastered' : getMasteryLevel(card) > 0 ? 'reviewed' : ''}`}
            onClick={() => { setCurrentIndex(i); setIsFlipped(false); setShowRating(false); }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flashcard-nav">
        <button className="flashcard-nav-btn" onClick={handlePrev}
          disabled={currentIndex === 0} id="flashcard-prev">
          <ChevronLeft size={24} />
        </button>
        <span className="flashcard-counter">{currentIndex + 1} / {displayCards.length}</span>
        <button className="flashcard-nav-btn" onClick={handleNext}
          disabled={currentIndex === displayCards.length - 1} id="flashcard-next">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
