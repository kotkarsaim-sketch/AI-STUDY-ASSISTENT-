'use client';

import { useState } from 'react';
import { BookOpen, Clock, Copy, Check } from 'lucide-react';

export default function SummaryView({ summary, rawText }) {
  const [copied, setCopied] = useState(false);
  
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const summaryWordCount = summary.join(' ').split(/\s+/).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="summary-container">
      <div className="summary-stats">
        <div className="summary-stat">
          <BookOpen size={16} className="summary-stat-icon" />
          Original: <span className="summary-stat-value">{wordCount.toLocaleString()}</span> words
        </div>
        <div className="summary-stat">
          <BookOpen size={16} className="summary-stat-icon" />
          Summary: <span className="summary-stat-value">{summaryWordCount}</span> words
        </div>
        <div className="summary-stat">
          <Clock size={16} className="summary-stat-icon" />
          <span className="summary-stat-value">{readingTime}</span> min read
        </div>
      </div>

      <div className="summary-content">
        {summary.map((sentence, index) => (
          <div key={index} className="summary-sentence">
            {sentence}
          </div>
        ))}
      </div>

      <div className="summary-actions">
        <button className="btn btn-secondary btn-sm" onClick={handleCopy} id="copy-summary-btn">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </button>
      </div>
    </div>
  );
}
