'use client';

import { useMemo } from 'react';
import { useStudy } from '@/context/StudyContext';
import { Target, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

export default function QuizAnalytics() {
  const { quizHistory, weakTopics, regenerateQuiz, calculateWeakTopics } = useStudy();

  const analytics = useMemo(() => {
    if (quizHistory.length === 0) return null;

    const topicStats = {};
    let totalCorrect = 0;

    quizHistory.forEach(({ topic, correct }) => {
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
      topicStats[topic].total += 1;
      if (correct) {
        topicStats[topic].correct += 1;
        totalCorrect += 1;
      }
    });

    const overallAccuracy = Math.round((totalCorrect / quizHistory.length) * 100);

    const topics = Object.entries(topicStats).map(([name, stats]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      accuracy: Math.round((stats.correct / stats.total) * 100),
      total: stats.total,
      correct: stats.correct,
    })).sort((a, b) => a.accuracy - b.accuracy);

    return { overallAccuracy, topics, totalAnswered: quizHistory.length, totalCorrect };
  }, [quizHistory]);

  const currentWeakTopics = useMemo(() => calculateWeakTopics(quizHistory), [quizHistory, calculateWeakTopics]);

  if (!analytics) {
    return (
      <div className="quiz-analytics-empty">
        <Target size={40} className="quiz-analytics-empty-icon" />
        <p>Complete some quiz questions to see your performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="quiz-analytics" id="quiz-analytics">
      <h3 className="quiz-analytics-title">
        <TrendingUp size={20} />
        Performance Analytics
      </h3>

      {/* Overall Stats */}
      <div className="quiz-analytics-stats">
        <div className="quiz-stat-card">
          <div className="quiz-stat-value gradient-text">{analytics.overallAccuracy}%</div>
          <div className="quiz-stat-label">Overall Accuracy</div>
        </div>
        <div className="quiz-stat-card">
          <div className="quiz-stat-value">{analytics.totalAnswered}</div>
          <div className="quiz-stat-label">Questions Answered</div>
        </div>
        <div className="quiz-stat-card">
          <div className="quiz-stat-value" style={{ color: 'var(--accent-emerald)' }}>{analytics.totalCorrect}</div>
          <div className="quiz-stat-label">Correct</div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="quiz-topic-breakdown">
        <h4>Topic Breakdown</h4>
        {analytics.topics.map((topic, i) => (
          <div key={i} className="quiz-topic-row">
            <div className="quiz-topic-info">
              <span className="quiz-topic-name">{topic.name}</span>
              <span className="quiz-topic-score">{topic.correct}/{topic.total}</span>
            </div>
            <div className="quiz-topic-bar">
              <div
                className="quiz-topic-bar-fill"
                style={{
                  width: `${topic.accuracy}%`,
                  background: topic.accuracy >= 80 ? 'var(--gradient-success)'
                    : topic.accuracy >= 50 ? 'var(--gradient-secondary)'
                    : 'var(--gradient-danger)'
                }}
              />
            </div>
            <span className="quiz-topic-pct">{topic.accuracy}%</span>
          </div>
        ))}
      </div>

      {/* Weak Areas */}
      {currentWeakTopics.length > 0 && (
        <div className="quiz-weak-areas">
          <h4>
            <AlertTriangle size={16} />
            Weak Areas — Focus Here
          </h4>
          <div className="quiz-weak-tags">
            {currentWeakTopics.map((topic, i) => (
              <span key={i} className="quiz-weak-tag">
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </span>
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => regenerateQuiz('medium')}
            id="focus-weak-btn"
          >
            <RefreshCw size={16} />
            Quiz Me on Weak Areas
          </button>
        </div>
      )}
    </div>
  );
}
