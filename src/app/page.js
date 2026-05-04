import Link from 'next/link';
import { FileText, HelpCircle, Layers, Upload, ArrowRight, Sparkles, Shield, Zap, MessageSquare, Brain, Repeat, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge">
                <Sparkles size={14} />
                AI-Powered Study Platform
              </span>
            </div>

            <h1 className="hero-title">
              Study Smarter with{' '}
              <span className="gradient-text">AI-Generated</span>{' '}
              Materials
            </h1>

            <p className="hero-subtitle">
              Upload your notes or PDFs — get instant summaries, adaptive quizzes, SM-2 spaced-repetition flashcards,
              and a RAG-powered Q&A tutor. All processing happens in your browser.
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
            Six powerful tools, one simple upload. The only study platform that combines RAG Q&A, Socratic tutoring,
            adaptive quizzes, and spaced repetition in one system.
          </p>

          <div className="features-grid features-grid-6">
            <div className="glass-card feature-card animate-fadeInUp">
              <div className="feature-icon feature-icon-summary">
                <FileText size={28} />
              </div>
              <h3 className="feature-title">Smart Summaries</h3>
              <p className="feature-desc">
                NLP-powered extractive summarization identifies key sentences using TF-IDF scoring and position analysis.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-100">
              <div className="feature-icon feature-icon-quiz">
                <Target size={28} />
              </div>
              <h3 className="feature-title">Adaptive Quizzes</h3>
              <p className="feature-desc">
                Performance-driven quiz engine that adjusts difficulty (Easy/Medium/Hard) and targets your weak areas.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-200">
              <div className="feature-icon feature-icon-flash">
                <Repeat size={28} />
              </div>
              <h3 className="feature-title">SM-2 Flashcards</h3>
              <p className="feature-desc">
                Automated spaced repetition using the SuperMemo SM-2 algorithm. Cards are scheduled based on your confidence.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-300">
              <div className="feature-icon" style={{ background: 'rgba(34, 211, 238, 0.15)', color: 'var(--accent-cyan)' }}>
                <MessageSquare size={28} />
              </div>
              <h3 className="feature-title">RAG Q&A</h3>
              <p className="feature-desc">
                Ask questions about your documents and get answers grounded in your uploaded content using TF-IDF retrieval.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-400">
              <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                <Brain size={28} />
              </div>
              <h3 className="feature-title">Socratic Tutoring</h3>
              <p className="feature-desc">
                Guides you with probing questions instead of direct answers — proven to yield deeper conceptual understanding.
              </p>
            </div>

            <div className="glass-card feature-card animate-fadeInUp delay-500">
              <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                <Layers size={28} />
              </div>
              <h3 className="feature-title">Study Dashboard</h3>
              <p className="feature-desc">
                Track mastery progress, review schedules, quiz analytics, and identify weak areas — all in one view.
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
                Text is analyzed using NLP algorithms — TF-IDF, sentence scoring, and topic extraction — entirely in your browser.
              </p>
            </div>

            <div className="step-card animate-fadeInUp delay-400">
              <div className="step-number">3</div>
              <h3 className="step-title">Study</h3>
              <p className="step-desc">
                Get summaries, adaptive quizzes, SM-2 flashcards, and a Q&A tutor. The system learns from your performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section" id="comparison">
        <div className="container">
          <h2 className="section-title">
            Why <span className="gradient-text">Choose Us</span>
          </h2>
          <p className="section-subtitle">
            No existing tool combines all four capabilities in one platform.
          </p>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>ChatGPT</th>
                  <th>Khan Academy</th>
                  <th>Anki</th>
                  <th>Quizlet</th>
                  <th className="highlight-col">Our System</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RAG on uploaded docs</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="yes highlight-col">✓</td>
                </tr>
                <tr>
                  <td>Socratic tutoring</td>
                  <td className="partial">~</td><td className="yes">✓</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="yes highlight-col">✓</td>
                </tr>
                <tr>
                  <td>Adaptive quizzes</td>
                  <td className="no">✗</td><td className="partial">~</td>
                  <td className="no">✗</td><td className="partial">~</td>
                  <td className="yes highlight-col">✓</td>
                </tr>
                <tr>
                  <td>Spaced repetition (SM-2)</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="yes">✓</td><td className="no">✗</td>
                  <td className="yes highlight-col">✓ auto</td>
                </tr>
                <tr>
                  <td>Works on your own notes</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="yes highlight-col">✓</td>
                </tr>
                <tr>
                  <td>All features integrated</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="no">✗</td><td className="no">✗</td>
                  <td className="yes highlight-col">✓</td>
                </tr>
              </tbody>
            </table>
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
