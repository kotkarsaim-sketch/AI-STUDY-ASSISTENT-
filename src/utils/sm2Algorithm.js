/* =========================================================
   SM-2 Spaced Repetition Algorithm
   Based on SuperMemo SM-2 by P.A. Wozniak (1990)
   ========================================================= */

/**
 * Quality ratings:
 * 0 - "Again"  → Complete blackout, no recall
 * 1 - "Hard"   → Incorrect, but remembered after seeing answer
 * 2 - "Okay"   → Incorrect, but answer seemed easy to recall
 * 3 - "Good"   → Correct, but with significant effort
 * 4 - "Easy"   → Correct with little hesitation  
 * 5 - "Perfect" → Instant recall
 */

// Default card state when first created
export function createSM2Card(id, term, definition) {
  return {
    id,
    term,
    definition,
    // SM-2 parameters
    easinessFactor: 2.5,   // EF starts at 2.5
    interval: 0,           // Days until next review
    repetitions: 0,        // Successful repetition count
    nextReview: Date.now(), // When to review next (timestamp)
    lastReview: null,       // Last review timestamp
    quality: null,          // Last quality rating
    // Analytics
    totalReviews: 0,
    correctReviews: 0,
    streak: 0,
  };
}

// Core SM-2 calculation
export function calculateNextReview(card, quality) {
  let { easinessFactor, interval, repetitions, totalReviews, correctReviews, streak } = card;

  totalReviews += 1;

  // Quality >= 3 is considered "correct"
  const isCorrect = quality >= 3;

  if (isCorrect) {
    correctReviews += 1;
    streak += 1;

    if (repetitions === 0) {
      interval = 1; // First successful review → 1 day
    } else if (repetitions === 1) {
      interval = 6; // Second successful review → 6 days
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  } else {
    // Reset on failure
    repetitions = 0;
    interval = 0; // Review again immediately (same session)
    streak = 0;
  }

  // Update Easiness Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const efDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easinessFactor = Math.max(1.3, easinessFactor + efDelta);

  // Calculate next review date
  const now = Date.now();
  const nextReview = interval === 0 
    ? now  // Due immediately
    : now + interval * 24 * 60 * 60 * 1000; // interval days from now

  return {
    ...card,
    easinessFactor: Math.round(easinessFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
    lastReview: now,
    quality,
    totalReviews,
    correctReviews,
    streak,
  };
}

// Check if a card is due for review
export function isDueForReview(card) {
  return Date.now() >= card.nextReview;
}

// Get mastery level (0-100) based on SM-2 metrics
export function getMasteryLevel(card) {
  if (card.totalReviews === 0) return 0;
  
  const accuracyScore = (card.correctReviews / card.totalReviews) * 40;
  const efScore = Math.min(((card.easinessFactor - 1.3) / 1.2) * 30, 30);
  const intervalScore = Math.min((card.interval / 30) * 20, 20);
  const streakScore = Math.min((card.streak / 5) * 10, 10);

  return Math.min(100, Math.round(accuracyScore + efScore + intervalScore + streakScore));
}

// Get human-readable time until next review
export function getTimeUntilReview(card) {
  const diff = card.nextReview - Date.now();
  if (diff <= 0) return 'Due now';
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} min${minutes > 1 ? 's' : ''}`;
}

// Quality rating labels and colors
export const QUALITY_RATINGS = [
  { value: 0, label: 'Again', color: '#ef4444', description: 'No recall at all' },
  { value: 1, label: 'Hard', color: '#f97316', description: 'Barely remembered' },
  { value: 2, label: 'Okay', color: '#f59e0b', description: 'Took effort' },
  { value: 3, label: 'Good', color: '#22d3ee', description: 'Correct recall' },
  { value: 4, label: 'Easy', color: '#10b981', description: 'Quick recall' },
  { value: 5, label: 'Perfect', color: '#8b5cf6', description: 'Instant recall' },
];

// Simplified quality buttons (for UI — we use 4 main buttons)
export const QUICK_RATINGS = [
  { value: 0, label: 'Again', icon: '↩', color: '#ef4444' },
  { value: 3, label: 'Good', icon: '✓', color: '#22d3ee' },
  { value: 4, label: 'Easy', icon: '⚡', color: '#10b981' },
  { value: 5, label: 'Perfect', icon: '★', color: '#8b5cf6' },
];
