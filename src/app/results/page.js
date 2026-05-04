'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudy } from '@/context/StudyContext';
import TabSwitcher from '@/components/TabSwitcher';
import SummaryView from '@/components/SummaryView';
import QuizCard from '@/components/QuizCard';
import Flashcard from '@/components/Flashcard';
import QAChat from '@/components/QAChat';
import StudyDashboard from '@/components/StudyDashboard';
import { Upload, FileX } from 'lucide-react';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const { summary, quizQuestions, flashcards, hasResults, rawText, reset } = useStudy();
  const router = useRouter();

  const handleUploadNew = () => {
    reset();
    router.push('/upload');
  };

  if (!hasResults) {
    return (
      <div className="results-page" id="results-page">
        <div className="container">
          <div className="results-empty animate-fadeInUp">
            <FileX size={64} className="results-empty-icon" />
            <h2 className="results-empty-title">No Results Yet</h2>
            <p className="results-empty-text">
              Upload your study materials first to generate summaries, quizzes, and flashcards.
            </p>
            <Link href="/upload" className="btn btn-primary" id="go-upload-btn">
              <Upload size={18} />
              Upload Materials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page" id="results-page">
      <div className="container">
        <div className="results-header animate-fadeInDown">
          <h1 className="results-title">
            Your <span className="gradient-text">Study Materials</span>
          </h1>
          <p className="results-subtitle">
            {summary.length} key points • {quizQuestions.length} quiz questions • {flashcards.length} flashcards
          </p>
        </div>

        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="results-content">
          {activeTab === 'summary' && (
            <SummaryView summary={summary} rawText={rawText} />
          )}
          {activeTab === 'quiz' && (
            <QuizCard questions={quizQuestions} />
          )}
          {activeTab === 'flashcards' && (
            <Flashcard flashcards={flashcards} />
          )}
          {activeTab === 'ask' && (
            <QAChat />
          )}
          {activeTab === 'dashboard' && (
            <StudyDashboard />
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <button className="btn btn-secondary" onClick={handleUploadNew} id="upload-new-btn">
            <Upload size={18} />
            Upload New Material
          </button>
        </div>
      </div>
    </div>
  );
}
