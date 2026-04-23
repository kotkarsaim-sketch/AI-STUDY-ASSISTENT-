'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function Flashcard({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState(new Set([0]));

  const currentCard = flashcards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setViewedCards(v => new Set([...v, currentIndex - 1]));
      }, 150);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setViewedCards(v => new Set([...v, currentIndex + 1]));
      }, 150);
    }
  }, [currentIndex, flashcards.length]);

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
      <div className="flashcard-progress">
        Card {currentIndex + 1} of {flashcards.length}
        <div className="flashcard-progress-dots">
          {flashcards.map((_, i) => (
            <div
              key={i}
              className={`flashcard-dot ${i === currentIndex ? 'active' : ''} ${viewedCards.has(i) ? 'viewed' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="flashcard-scene" onClick={handleFlip} id="flashcard-scene">
        <div className={`flashcard-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-face flashcard-front">
            <div className="flashcard-label">Term</div>
            <div className="flashcard-text">{currentCard.term}</div>
            <div className="flashcard-hint">
              <RotateCcw size={12} />
              Click to flip
            </div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-label">Definition</div>
            <div className="flashcard-text">{currentCard.definition}</div>
            <div className="flashcard-hint">
              <RotateCcw size={12} />
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-nav">
        <button
          className="flashcard-nav-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          id="flashcard-prev"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="flashcard-counter">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <button
          className="flashcard-nav-btn"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          id="flashcard-next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
