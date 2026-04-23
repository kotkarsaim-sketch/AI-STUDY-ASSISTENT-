'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const StudyContext = createContext(null);

/* =========================================================
   NLP UTILITIES — Client-side text analysis
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

function getWordFrequency(tokens) {
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'some', 'them',
    'than', 'its', 'over', 'such', 'that', 'this', 'with', 'will', 'each',
    'from', 'they', 'were', 'which', 'their', 'said', 'what', 'when', 'where',
    'would', 'make', 'like', 'could', 'into', 'time', 'very', 'just', 'about',
    'also', 'much', 'then', 'these', 'other', 'more', 'most', 'only', 'come',
    'made', 'after', 'being', 'well', 'back', 'through', 'does', 'should',
  ]);
  
  const freq = {};
  tokens.forEach(token => {
    if (!stopWords.has(token)) {
      freq[token] = (freq[token] || 0) + 1;
    }
  });
  return freq;
}

function scoreSentence(sentence, wordFreq, index, totalSentences) {
  const tokens = tokenize(sentence);
  if (tokens.length === 0) return 0;
  
  // Word frequency score
  let freqScore = tokens.reduce((sum, t) => sum + (wordFreq[t] || 0), 0) / tokens.length;
  
  // Position bonus: first and last sentences are often important
  let positionBonus = 0;
  if (index < 3) positionBonus = 2 - index * 0.5;
  if (index === totalSentences - 1) positionBonus = 0.5;
  
  // Length penalty for very short or very long sentences
  const wordCount = sentence.split(/\s+/).length;
  let lengthFactor = 1;
  if (wordCount < 8) lengthFactor = 0.5;
  if (wordCount > 40) lengthFactor = 0.7;
  
  // Bonus for sentences with key indicator words
  const indicatorWords = ['important', 'key', 'main', 'significant', 'essential', 
    'conclusion', 'result', 'therefore', 'however', 'furthermore', 'crucial',
    'primary', 'fundamental', 'critical', 'notably', 'defined', 'means'];
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
  
  // Take top 30% of sentences, minimum 3, maximum 10
  const count = Math.max(3, Math.min(10, Math.ceil(sentences.length * 0.3)));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(s => s.text);
}

function generateQuiz(text) {
  const sentences = getSentences(text);
  const tokens = tokenize(text);
  const wordFreq = getWordFrequency(tokens);
  
  // Find key terms (high frequency, meaningful words)
  const keyTerms = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
  
  const questions = [];
  const usedSentences = new Set();
  
  for (const sentence of sentences) {
    if (questions.length >= 8) break;
    if (usedSentences.has(sentence)) continue;
    
    // Find a key term in this sentence
    const sentenceTokens = tokenize(sentence);
    const matchingTerms = sentenceTokens.filter(t => keyTerms.includes(t));
    
    if (matchingTerms.length === 0) continue;
    
    // Pick the most important matching term
    const answerTerm = matchingTerms.sort((a, b) => 
      (wordFreq[b] || 0) - (wordFreq[a] || 0)
    )[0];
    
    // Create blanked question
    const regex = new RegExp(`\\b${answerTerm}\\b`, 'i');
    const blankedSentence = sentence.replace(regex, '________');
    
    if (blankedSentence === sentence) continue;
    
    // Generate distractors from other key terms
    const distractors = keyTerms
      .filter(t => t !== answerTerm && t.length >= 3)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    if (distractors.length < 3) continue;
    
    // Create options and shuffle
    const correctAnswer = answerTerm.charAt(0).toUpperCase() + answerTerm.slice(1);
    const options = [
      correctAnswer,
      ...distractors.map(d => d.charAt(0).toUpperCase() + d.slice(1))
    ].sort(() => Math.random() - 0.5);
    
    questions.push({
      id: questions.length,
      question: `Fill in the blank: "${blankedSentence}"`,
      options,
      correctAnswer: correctAnswer,
      correctIndex: options.indexOf(correctAnswer)
    });
    
    usedSentences.add(sentence);
  }
  
  return questions;
}

function generateFlashcards(text) {
  const sentences = getSentences(text);
  const tokens = tokenize(text);
  const wordFreq = getWordFrequency(tokens);
  
  // Find key terms
  const keyTerms = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
  
  const flashcards = [];
  const usedTerms = new Set();
  
  for (const term of keyTerms) {
    if (flashcards.length >= 10) break;
    if (usedTerms.has(term)) continue;
    
    // Find the best sentence that explains this term
    const relevantSentences = sentences
      .filter(s => s.toLowerCase().includes(term))
      .sort((a, b) => a.length - b.length); // Prefer shorter, more concise explanations
    
    if (relevantSentences.length === 0) continue;
    
    const definition = relevantSentences[0];
    
    // Clean up the definition
    const cleanDef = definition.length > 200 
      ? definition.substring(0, 200).trim() + '...' 
      : definition;
    
    flashcards.push({
      id: flashcards.length,
      term: term.charAt(0).toUpperCase() + term.slice(1),
      definition: cleanDef
    });
    
    usedTerms.add(term);
  }
  
  return flashcards;
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

  const processText = useCallback(async (text) => {
    if (!text || text.trim().length < 50) return false;
    
    setIsProcessing(true);
    setRawText(text);
    
    // Simulate processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const summaryResult = generateSummary(text);
      const quizResult = generateQuiz(text);
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

  const reset = useCallback(() => {
    setRawText('');
    setSummary([]);
    setQuizQuestions([]);
    setFlashcards([]);
    setHasResults(false);
    setIsProcessing(false);
  }, []);

  const value = {
    rawText,
    summary,
    quizQuestions,
    flashcards,
    isProcessing,
    hasResults,
    processText,
    reset,
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
