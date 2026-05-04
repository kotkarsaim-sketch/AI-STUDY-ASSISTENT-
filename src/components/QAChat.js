'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStudy } from '@/context/StudyContext';
import { Send, Bot, User, Sparkles, Eye, MessageCircle, Lightbulb } from 'lucide-react';

export default function QAChat() {
  const { chatMessages, sendMessage, isSocraticMode, setIsSocraticMode } = useStudy();
  const [input, setInput] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  }, [input, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleReveal = (index) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const suggestedQuestions = [
    "What are the main concepts discussed?",
    "Explain the key terminology",
    "What is the most important takeaway?",
    "How do these concepts relate to each other?",
  ];

  return (
    <div className="qa-chat-container" id="qa-chat">
      {/* Mode Toggle */}
      <div className="qa-mode-toggle">
        <button
          className={`qa-mode-btn ${!isSocraticMode ? 'active' : ''}`}
          onClick={() => setIsSocraticMode(false)}
          id="qa-direct-mode"
        >
          <MessageCircle size={16} />
          Direct Answer
        </button>
        <button
          className={`qa-mode-btn ${isSocraticMode ? 'active' : ''}`}
          onClick={() => setIsSocraticMode(true)}
          id="qa-socratic-mode"
        >
          <Lightbulb size={16} />
          Socratic Mode
        </button>
      </div>

      {isSocraticMode && (
        <div className="qa-mode-info">
          <Sparkles size={14} />
          Socratic Mode guides you with questions instead of direct answers — deeper learning through self-discovery.
        </div>
      )}

      {/* Messages */}
      <div className="qa-messages" id="qa-messages">
        {chatMessages.length === 0 && (
          <div className="qa-empty">
            <Bot size={48} className="qa-empty-icon" />
            <h3>Ask about your study material</h3>
            <p>I&apos;ll find answers directly from your uploaded content.</p>
            <div className="qa-suggestions">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="qa-suggestion-btn"
                  onClick={() => { setInput(q); }}
                  id={`qa-suggestion-${i}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, index) => (
          <div key={index} className={`qa-message qa-message-${msg.role}`}>
            <div className="qa-message-avatar">
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className="qa-message-body">
              <div className="qa-message-content">{msg.content}</div>

              {msg.role === 'assistant' && msg.confidence !== undefined && (
                <div className="qa-message-meta">
                  <span className={`qa-confidence qa-confidence-${msg.confidence >= 50 ? 'high' : 'low'}`}>
                    {msg.confidence}% match
                  </span>
                  {msg.source && <span className="qa-source">{msg.source}</span>}
                  {msg.mode === 'socratic' && <span className="qa-badge-socratic">Socratic</span>}
                </div>
              )}

              {msg.mode === 'socratic' && msg.revealAnswer && (
                <div className="qa-reveal-section">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => toggleReveal(index)}
                    id={`qa-reveal-${index}`}
                  >
                    <Eye size={14} />
                    {revealedAnswers.has(index) ? 'Hide Answer' : 'Reveal Answer'}
                  </button>
                  {revealedAnswers.has(index) && (
                    <div className="qa-revealed-answer animate-fadeInUp">
                      {msg.revealAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="qa-input-area" id="qa-input-area">
        <textarea
          className="qa-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your notes..."
          rows={1}
          id="qa-input"
        />
        <button
          className="qa-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
          id="qa-send-btn"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
