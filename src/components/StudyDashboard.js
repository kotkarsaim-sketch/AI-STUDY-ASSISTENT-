'use client';

import { useMemo } from 'react';
import { useStudy } from '@/context/StudyContext';
import { getMasteryLevel, getTimeUntilReview, isDueForReview } from '@/utils/sm2Algorithm';
import { Calendar, Award, Clock, BarChart3, Flame, BookCheck } from 'lucide-react';

export default function StudyDashboard() {
  const { flashcards, getDueCards, getOverallMastery, quizHistory } = useStudy();

  const stats = useMemo(() => {
    const dueCards = getDueCards();
    const mastery = getOverallMastery();
    const totalReviews = flashcards.reduce((s, c) => s + c.totalReviews, 0);
    const bestStreak = flashcards.reduce((max, c) => Math.max(max, c.streak), 0);
    const masteredCards = flashcards.filter(c => getMasteryLevel(c) >= 80).length;

    return { dueCards, mastery, totalReviews, bestStreak, masteredCards };
  }, [flashcards, getDueCards, getOverallMastery]);

  const quizStats = useMemo(() => {
    if (quizHistory.length === 0) return null;
    const correct = quizHistory.filter(q => q.correct).length;
    return {
      total: quizHistory.length,
      correct,
      accuracy: Math.round((correct / quizHistory.length) * 100),
    };
  }, [quizHistory]);

  if (flashcards.length === 0) {
    return (
      <div className="dashboard-empty">
        <BarChart3 size={48} className="dashboard-empty-icon" />
        <h3>No Study Data Yet</h3>
        <p>Upload materials and start reviewing flashcards to see your progress here.</p>
      </div>
    );
  }

  return (
    <div className="dashboard" id="study-dashboard">
      <h2 className="dashboard-title">
        <BarChart3 size={24} />
        Study <span className="gradient-text">Dashboard</span>
      </h2>

      {/* Stat Cards */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card stat-due">
          <Clock size={24} />
          <div className="dashboard-stat-value">{stats.dueCards.length}</div>
          <div className="dashboard-stat-label">Cards Due</div>
        </div>
        <div className="dashboard-stat-card stat-mastery">
          <Award size={24} />
          <div className="dashboard-stat-value">{stats.mastery}%</div>
          <div className="dashboard-stat-label">Mastery</div>
        </div>
        <div className="dashboard-stat-card stat-reviews">
          <BookCheck size={24} />
          <div className="dashboard-stat-value">{stats.totalReviews}</div>
          <div className="dashboard-stat-label">Total Reviews</div>
        </div>
        <div className="dashboard-stat-card stat-streak">
          <Flame size={24} />
          <div className="dashboard-stat-value">{stats.bestStreak}</div>
          <div className="dashboard-stat-label">Best Streak</div>
        </div>
      </div>

      {/* Mastery Progress Ring */}
      <div className="dashboard-mastery-section">
        <h3>Overall Mastery</h3>
        <div className="mastery-ring-container">
          <svg className="mastery-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#masteryGradient)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${stats.mastery * 3.267} 326.7`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <defs>
              <linearGradient id="masteryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-blue)" />
                <stop offset="50%" stopColor="var(--accent-violet)" />
                <stop offset="100%" stopColor="var(--accent-pink)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mastery-ring-text">
            <span className="mastery-ring-value">{stats.mastery}%</span>
          </div>
        </div>
        <div className="mastery-breakdown">
          <span>{stats.masteredCards}/{flashcards.length} cards mastered</span>
        </div>
      </div>

      {/* Card Schedule */}
      <div className="dashboard-schedule">
        <h3><Calendar size={18} /> Review Schedule</h3>
        <div className="schedule-list">
          {flashcards.map((card, i) => (
            <div key={i} className={`schedule-item ${isDueForReview(card) ? 'due' : ''}`}>
              <span className="schedule-term">{card.term}</span>
              <div className="schedule-meta">
                <span className={`schedule-status ${isDueForReview(card) ? 'due' : 'upcoming'}`}>
                  {isDueForReview(card) ? 'Due Now' : getTimeUntilReview(card)}
                </span>
                <div className="schedule-mastery-mini">
                  <div
                    className="schedule-mastery-fill"
                    style={{ width: `${getMasteryLevel(card)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Performance */}
      {quizStats && (
        <div className="dashboard-quiz-section">
          <h3>Quiz Performance</h3>
          <div className="dashboard-quiz-stats">
            <span>{quizStats.accuracy}% accuracy</span>
            <span>{quizStats.total} questions attempted</span>
          </div>
        </div>
      )}
    </div>
  );
}
