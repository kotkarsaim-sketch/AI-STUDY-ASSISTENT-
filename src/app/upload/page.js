'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/context/StudyContext';
import FileUploader from '@/components/FileUploader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FileText, Shield, Zap } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { processText, isProcessing } = useStudy();

  const handleTextReady = useCallback(async (text) => {
    const success = await processText(text);
    if (success) {
      router.push('/results');
    }
  }, [processText, router]);

  if (isProcessing) {
    return (
      <div className="upload-page">
        <div className="container">
          <LoadingSpinner message="Generating your study materials..." />
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page" id="upload-page">
      <div className="container">
        <div className="upload-page-header animate-fadeInDown">
          <h1 className="upload-page-title">
            Upload Your <span className="gradient-text">Study Material</span>
          </h1>
          <p className="upload-page-subtitle">
            Drop a PDF or paste your notes to generate summaries, quizzes, and flashcards
          </p>
        </div>

        <div className="animate-fadeInUp delay-200">
          <FileUploader onTextReady={handleTextReady} />
        </div>

        <div className="upload-tips animate-fadeInUp delay-400">
          <div className="upload-tip">
            <FileText size={18} className="upload-tip-icon" />
            <span>Works with lecture notes, textbooks, and articles</span>
          </div>
          <div className="upload-tip">
            <Shield size={18} className="upload-tip-icon" />
            <span>100% private — processed in your browser</span>
          </div>
          <div className="upload-tip">
            <Zap size={18} className="upload-tip-icon" />
            <span>Results generated in seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
