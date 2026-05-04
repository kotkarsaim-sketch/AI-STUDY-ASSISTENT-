'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createSM2Card, calculateNextReview, isDueForReview, getMasteryLevel } from '@/utils/sm2Algorithm';

const StudyContext = createContext(null);

/* =========================================================
   NLP UTILITIES
   ========================================================= */

function tokenize(text) {
  return text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
}

function getSentences(text) {
  return text
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.split(/\s+/).length >= 4);
}

const STOP_WORDS = new Set([
  'the','and','for','are','but','not','you','all','can','had',
  'her','was','one','our','out','has','have','been','some','them',
  'than','its','over','such','that','this','with','will','each',
  'from','they','were','which','their','said','what','when','where',
  'would','make','like','could','into','time','very','just','about',
  'also','much','then','these','other','more','most','only','come',
  'made','after','being','well','back','through','does','should',
]);

function getWordFrequency(tokens) {
  const freq = {};
  tokens.forEach(token => {
    if (!STOP_WORDS.has(token)) {
      freq[token] = (freq[token] || 0) + 1;
    }
  });
  return freq;
}

function scoreSentence(sentence, wordFreq, index, totalSentences) {
  const tokens = tokenize(sentence);
  if (tokens.length === 0) return 0;
  let freqScore = tokens.reduce((sum, t) => sum + (wordFreq[t] || 0), 0) / tokens.length;
  let positionBonus = 0;
  if (index < 3) positionBonus = 2 - index * 0.5;
  if (index === totalSentences - 1) positionBonus = 0.5;
  const wordCount = sentence.split(/\s+/).length;
  let lengthFactor = 1;
  if (wordCount < 8) lengthFactor = 0.5;
  if (wordCount > 40) lengthFactor = 0.7;
  const indicatorWords = ['important','key','main','significant','essential',
    'conclusion','result','therefore','however','furthermore','crucial',
    'primary','fundamental','critical','notably','defined','means'];
  const hasIndicator = indicatorWords.some(w => sentence.toLowerCase().includes(w));
  return (freqScore + positionBonus) * lengthFactor * (hasIndicator ? 1.5 : 1);
}

function generateSummary(text) {
  const sentences = getSentences(text);
  if (sentences.length === 0) return [];
  const tokens = tokenize(text);
  const wordFreq = getWordFrequency(tokens);
  const scored = sentences.map((s, i) => ({
    text: s,
    score: scoreSentence(s, wordFreq, i, sentences.length),
    originalIndex: i
  }));
  const count = Math.max(3, Math.min(10, Math.ceil(sentences.length * 0.3)));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(s => s.text);
}

/* =========================================================
   ADAPTIVE QUIZ ENGINE
   ========================================================= */

function generateAdaptiveQuiz(text, difficulty = 'medium', weakTopics = []) {
  const sentences = getSentences(text);
  const tokens = tokenize(text);
  const wordFreq = getWordFrequency(tokens);

  const keyTerms = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word);

  const questions = [];
  const usedSentences = new Set();
  const maxQ = difficulty === 'hard' ? 10 : 8;

  // Prioritize sentences containing weak topics
  const sortedSentences = [...sentences].sort((a, b) => {
    const aWeak = weakTopics.some(t => a.toLowerCase().includes(t));
    const bWeak = weakTopics.some(t => b.toLowerCase().includes(t));
    if (aWeak && !bWeak) return -1;
    if (!aWeak && bWeak) return 1;
    return 0;
  });

  for (const sentence of sortedSentences) {
    if (questions.length >= maxQ) break;
    if (usedSentences.has(sentence)) continue;

    const sentenceTokens = tokenize(sentence);
    const matchingTerms = sentenceTokens.filter(t => keyTerms.includes(t));
    if (matchingTerms.length === 0) continue;

    const answerTerm = matchingTerms.sort((a, b) =>
      (wordFreq[b] || 0) - (wordFreq[a] || 0)
    )[0];

    const regex = new RegExp(`\\b${answerTerm}\\b`, 'i');
    const blankedSentence = sentence.replace(regex, '________');
    if (blankedSentence === sentence) continue;

    // Generate distractors based on difficulty
    let distractors;
    if (difficulty === 'hard') {
      // Closer distractors — same length range, similar frequency
      const answerFreq = wordFreq[answerTerm] || 1;
      distractors = keyTerms
        .filter(t => t !== answerTerm && Math.abs(t.length - answerTerm.length) <= 3
          && Math.abs((wordFreq[t] || 0) - answerFreq) <= 3)
        .slice(0, 3);
      if (distractors.length < 3) {
        distractors = keyTerms
          .filter(t => t !== answerTerm && t.length >= 3)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }
    } else if (difficulty === 'easy') {
      // Very different distractors — different lengths
      distractors = keyTerms
        .filter(t => t !== answerTerm && Math.abs(t.length - answerTerm.length) > 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      if (distractors.length < 3) {
        distractors = keyTerms.filter(t => t !== answerTerm).sort(() => Math.random() - 0.5).slice(0, 3);
      }
    } else {
      distractors = keyTerms
        .filter(t => t !== answerTerm && t.length >= 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }

    if (distractors.length < 3) continue;

    const correctAnswer = answerTerm.charAt(0).toUpperCase() + answerTerm.slice(1);
    const options = [
      correctAnswer,
      ...distractors.map(d => d.charAt(0).toUpperCase() + d.slice(1))
    ].sort(() => Math.random() - 0.5);

    // Determine question topic (most frequent keyword in sentence)
    const topic = matchingTerms[0];

    questions.push({
      id: questions.length,
      question: difficulty === 'hard'
        ? `Based on your understanding, fill in: "${blankedSentence}"`
        : `Fill in the blank: "${blankedSentence}"`,
      options,
      correctAnswer,
      correctIndex: options.indexOf(correctAnswer),
      difficulty,
      topic,
    });

    usedSentences.add(sentence);
  }

  return questions;
}

/* =========================================================
   RAG Q&A ENGINE (TF-IDF Cosine Similarity)
   ========================================================= */

function buildChunks(text) {
  const sentences = getSentences(text);
  const chunks = [];
  for (let i = 0; i < sentences.length; i++) {
    const chunk = sentences.slice(i, i + 3).join(' ');
    chunks.push({ text: chunk, startIndex: i });
  }
  return chunks;
}

function computeTFIDF(tokens, docFreq, totalDocs) {
  const tf = {};
  tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
  const tfidf = {};
  Object.keys(tf).forEach(t => {
    const idf = Math.log((totalDocs + 1) / ((docFreq[t] || 0) + 1)) + 1;
    tfidf[t] = (tf[t] / tokens.length) * idf;
  });
  return tfidf;
}

function cosineSimilarity(vec1, vec2) {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dot = 0, mag1 = 0, mag2 = 0;
  allKeys.forEach(k => {
    const v1 = vec1[k] || 0;
    const v2 = vec2[k] || 0;
    dot += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });
  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function answerQuestion(query, text) {
  const chunks = buildChunks(text);
  if (chunks.length === 0) return { answer: "Not enough content to answer.", confidence: 0 };

  // Build document frequency
  const docFreq = {};
  const chunkTokens = chunks.map(c => {
    const tokens = tokenize(c.text).filter(t => !STOP_WORDS.has(t));
    tokens.forEach(t => {
      if (!docFreq[t]) docFreq[t] = 0;
      docFreq[t]++;
    });
    return tokens;
  });

  const queryTokens = tokenize(query).filter(t => !STOP_WORDS.has(t));
  const queryVec = computeTFIDF(queryTokens, docFreq, chunks.length);

  let bestScore = 0;
  let bestChunk = chunks[0];

  chunkTokens.forEach((tokens, i) => {
    const chunkVec = computeTFIDF(tokens, docFreq, chunks.length);
    const score = cosineSimilarity(queryVec, chunkVec);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunks[i];
    }
  });

  const confidence = Math.min(100, Math.round(bestScore * 200));

  return {
    answer: bestChunk.text,
    confidence,
    source: `Passage ${bestChunk.startIndex + 1}`,
  };
}

function generateSocraticResponse(query, text) {
  const { answer, confidence } = answerQuestion(query, text);
  const queryTokens = tokenize(query).filter(t => !STOP_WORDS.has(t));
  const keyTerm = queryTokens[0] || 'this concept';

  const templates = [
    `That's a great question! Before I give you the answer, let me ask you: What do you already know about "${keyTerm}"? Think about how it connects to the passage.`,
    `Interesting! Let's think through this together. The text discusses this topic. Can you recall what the key factors related to "${keyTerm}" are?`,
    `Good thinking! Here's a hint — the answer relates to this part of your notes: "${answer.substring(0, 80)}..." Can you now piece together the full answer?`,
    `Let me guide you: Consider what role "${keyTerm}" plays in the broader context of your material. What would happen if "${keyTerm}" were different or absent?`,
    `Before revealing the answer, reflect on this: How does "${keyTerm}" relate to the other key concepts you've studied? Try connecting the dots yourself first.`,
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    response: template,
    hint: answer.substring(0, 120) + '...',
    confidence,
    revealAnswer: answer,
  };
}

/* =========================================================
   FLASHCARD GENERATOR
   ========================================================= */

function generateFlashcards(text) {
  const sentences = getSentences(text);
  const tokens = tokenize(text);
  const wordFreq = getWordFrequency(tokens);

  const keyTerms = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  const flashcards = [];
  const usedTerms = new Set();

  for (const term of keyTerms) {
    if (flashcards.length >= 10) break;
    if (usedTerms.has(term)) continue;

    const relevantSentences = sentences
      .filter(s => s.toLowerCase().includes(term))
      .sort((a, b) => a.length - b.length);

    if (relevantSentences.length === 0) continue;

    const definition = relevantSentences[0];
    const cleanDef = definition.length > 200
      ? definition.substring(0, 200).trim() + '...'
      : definition;

    // Create SM-2 enhanced flashcard
    flashcards.push(
      createSM2Card(
        flashcards.length,
        term.charAt(0).toUpperCase() + term.slice(1),
        cleanDef
      )
    );

    usedTerms.add(term);
  }

  return flashcards;
}

/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

const STORAGE_KEY = 'studyai_data';

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/* =========================================================
   CONTEXT PROVIDER
   ========================================================= */

export function StudyProvider({ children }) {
  const [rawText, setRawText] = useState('');
  const [summary, setSummary] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  // Adaptive quiz state
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [quizHistory, setQuizHistory] = useState([]); // { topic, correct, timestamp }
  const [weakTopics, setWeakTopics] = useState([]);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [isSocraticMode, setIsSocraticMode] = useState(false);

  // Load persisted flashcard data on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved?.flashcards?.length > 0) {
      setFlashcards(saved.flashcards);
      if (saved.quizHistory) setQuizHistory(saved.quizHistory);
    }
  }, []);

  // Persist flashcard SM-2 data when it changes
  useEffect(() => {
    if (flashcards.length > 0) {
      saveToStorage({ flashcards, quizHistory });
    }
  }, [flashcards, quizHistory]);

  // Calculate weak topics from quiz history
  const calculateWeakTopics = useCallback((history) => {
    const topicStats = {};
    history.forEach(({ topic, correct }) => {
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
      topicStats[topic].total += 1;
      if (correct) topicStats[topic].correct += 1;
    });
    return Object.entries(topicStats)
      .filter(([, stats]) => stats.total >= 2 && (stats.correct / stats.total) < 0.6)
      .map(([topic]) => topic);
  }, []);

  const processText = useCallback(async (text) => {
    if (!text || text.trim().length < 50) return false;

    setIsProcessing(true);
    setRawText(text);
    setChatMessages([]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const summaryResult = generateSummary(text);
      const quizResult = generateAdaptiveQuiz(text, 'medium', []);
      const flashcardResult = generateFlashcards(text);

      setSummary(summaryResult);
      setQuizQuestions(quizResult);
      setFlashcards(flashcardResult);
      setHasResults(true);
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error('Error processing text:', error);
      setIsProcessing(false);
      return false;
    }
  }, []);

  // Regenerate quiz with specific difficulty
  const regenerateQuiz = useCallback((difficulty) => {
    if (!rawText) return;
    setQuizDifficulty(difficulty);
    const weak = calculateWeakTopics(quizHistory);
    setWeakTopics(weak);
    const newQuiz = generateAdaptiveQuiz(rawText, difficulty, weak);
    setQuizQuestions(newQuiz);
  }, [rawText, quizHistory, calculateWeakTopics]);

  // Record quiz answer for adaptive tracking
  const recordQuizAnswer = useCallback((topic, correct) => {
    const entry = { topic, correct, timestamp: Date.now() };
    setQuizHistory(prev => [...prev, entry]);
  }, []);

  // Q&A Chat
  const sendMessage = useCallback((query) => {
    if (!rawText || !query.trim()) return;

    const userMsg = { role: 'user', content: query, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let aiResponse;
      if (isSocraticMode) {
        const result = generateSocraticResponse(query, rawText);
        aiResponse = {
          role: 'assistant',
          content: result.response,
          hint: result.hint,
          revealAnswer: result.revealAnswer,
          confidence: result.confidence,
          mode: 'socratic',
          timestamp: Date.now(),
        };
      } else {
        const result = answerQuestion(query, rawText);
        aiResponse = {
          role: 'assistant',
          content: result.answer,
          confidence: result.confidence,
          source: result.source,
          mode: 'direct',
          timestamp: Date.now(),
        };
      }
      setChatMessages(prev => [...prev, aiResponse]);
    }, 500);
  }, [rawText, isSocraticMode]);

  // SM-2 Flashcard review
  const reviewFlashcard = useCallback((cardId, quality) => {
    setFlashcards(prev =>
      prev.map(card =>
        card.id === cardId ? calculateNextReview(card, quality) : card
      )
    );
  }, []);

  // Get due flashcards
  const getDueCards = useCallback(() => {
    return flashcards.filter(isDueForReview);
  }, [flashcards]);

  // Get overall mastery
  const getOverallMastery = useCallback(() => {
    if (flashcards.length === 0) return 0;
    const total = flashcards.reduce((sum, c) => sum + getMasteryLevel(c), 0);
    return Math.round(total / flashcards.length);
  }, [flashcards]);

  const reset = useCallback(() => {
    setRawText('');
    setSummary([]);
    setQuizQuestions([]);
    setFlashcards([]);
    setHasResults(false);
    setIsProcessing(false);
    setChatMessages([]);
    setQuizHistory([]);
    setWeakTopics([]);
  }, []);

  const value = {
    rawText, summary, quizQuestions, flashcards,
    isProcessing, hasResults, processText, reset,
    // Adaptive quiz
    quizDifficulty, regenerateQuiz, recordQuizAnswer,
    quizHistory, weakTopics, calculateWeakTopics,
    // Chat / Q&A
    chatMessages, sendMessage, isSocraticMode, setIsSocraticMode,
    // SM-2
    reviewFlashcard, getDueCards, getOverallMastery,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
