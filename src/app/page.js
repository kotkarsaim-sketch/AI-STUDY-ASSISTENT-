import Link from 'next/link';
import { FileText, HelpCircle, Layers, Upload, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        {/* Background Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge">
                <Sparkles size={14} />
                AI-Powered Study Tool
              </span>
            </div>

            <h1 className="hero-title">
              Study Smarter with{' '}
              <span className="gradient-text">AI-Generated</span>{' '}
              Materials
            </h1>

            <p className="hero-subtitle">
              Upload your notes or PDFs — get instant summaries, quizzes, and flashcards.
              All processing happens in your browser, keeping your data private.
            </p>

            <div className="hero-actions">
              <Link href="/upload" className="btn btn-primary btn-lg" id="hero-cta">
                <Upload size={20} />
                Get Started
                <ArrowRight size={20} />
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg" id="hero-learn-more">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="container">
          <h2 className="section-title">
            Everything You Need to <span className="gradient-text">Ace Your Studies</span>
          </h2>
          <p className="section-subtitle">
            Three powerful tools, one simple upload. Transform your notes into effective study materials in seconds.
          </p>

          <div className="features-grid">
            <div className="glass-card feature-card animate-fadeInUp">
              <div className="feature-icon feature-icon-summary">
                <FileText size={28} />
              </div>
              <h3 className="feature-title">Smart Summaries</h3>
              <p className="feature-desc">
                Extracts the most important sentences from your material, giving you a concise overview that saves hours of re-reading.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-200">
              <div className="feature-icon feature-icon-quiz">
                <HelpCircle size={28} />
              </div>
              <h3 className="feature-title">Auto Quizzes</h3>
              <p className="feature-desc">
                Generates multiple-choice questions from your content with instant scoring and feedback to test your understanding.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-400">
              <div className="feature-icon feature-icon-flash">
                <Layers size={28} />
              </div>
              <h3 className="feature-title">Flip Flashcards</h3>
              <p className="feature-desc">
                Creates interactive 3D flip-cards pairing key terms with definitions — the gold standard of active recall studying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Three simple steps to transform your study materials.
          </p>

          <div className="steps-grid">
            <div className="step-card animate-fadeInUp">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload</h3>
              <p className="step-desc">
                Drop a PDF file or paste your notes directly into the text area. We support PDF, TXT, and MD files.
              </p>
            </div>

            <div className="step-card animate-fadeInUp delay-200">
              <div className="step-number">2</div>
              <h3 className="step-title">Process</h3>
              <p className="step-desc">
                Text is extracted and analyzed entirely in your browser. Your notes never leave your device.
              </p>
            </div>

            <div className="step-card animate-fadeInUp delay-400">
              <div className="step-number">3</div>
              <h3 className="step-title">Study</h3>
              <p className="step-desc">
                Get your personalized summary, quiz questions, and flashcards instantly. Start studying smarter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <Shield size={32} style={{ color: 'var(--accent-emerald)' }} />
              <Zap size={32} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <h3 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-md)' }}>
              Private & <span className="gradient-text">Lightning Fast</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              All processing happens right in your browser using advanced NLP algorithms.
              Your notes never leave your device — no servers, no data collection, no accounts needed.
              Just pure, private studying.
            </p>
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <Link href="/upload" className="btn btn-primary" id="privacy-cta">
                <Upload size={18} />
                Try It Now — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
