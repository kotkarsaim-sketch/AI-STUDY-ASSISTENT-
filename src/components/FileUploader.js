'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, File } from 'lucide-react';

export default function FileUploader({ onTextReady }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const extractTextFromPdf = useCallback(async (arrayBuffer) => {
    setIsExtracting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      setTextContent(fullText.trim());
      setIsExtracting(false);
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      setIsExtracting(false);
      return '';
    }
  }, []);

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    if (selectedFile.type === 'application/pdf') {
      const buffer = await selectedFile.arrayBuffer();
      const text = await extractTextFromPdf(buffer);
      if (text) setTextContent(text);
    } else if (selectedFile.type.startsWith('text/')) {
      const text = await selectedFile.text();
      setTextContent(text);
    }
  }, [extractTextFromPdf]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFile(selectedFile);
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    setTextContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleGenerate = useCallback(() => {
    if (textContent.trim().length >= 50 && onTextReady) {
      onTextReady(textContent);
    }
  }, [textContent, onTextReady]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const canGenerate = textContent.trim().length >= 50;

  return (
    <div className="uploader-wrapper">
      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        id="upload-dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-input"
        />
        
        <div className="dropzone-content">
          <div className="dropzone-icon">
            <Upload size={48} />
          </div>
          <h3 className="dropzone-title">
            {isExtracting ? 'Extracting text...' : 'Drop your PDF here'}
          </h3>
          <p className="dropzone-subtitle">
            or click to browse • Supports PDF, TXT, MD files
          </p>
        </div>

        {file && (
          <div className="file-preview" onClick={(e) => e.stopPropagation()}>
            <FileText className="file-preview-icon" size={24} />
            <div className="file-preview-info">
              <div className="file-preview-name">{file.name}</div>
              <div className="file-preview-size">{formatFileSize(file.size)}</div>
            </div>
            <button className="file-preview-remove" onClick={removeFile} id="remove-file-btn">
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="dropzone-divider">or paste your notes</div>

      <textarea
        className="upload-textarea"
        placeholder="Paste your study notes here... (minimum 50 characters)"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        id="notes-textarea"
      />

      <div className="upload-actions">
        <button
          className={`btn btn-primary btn-lg ${!canGenerate ? 'disabled' : ''}`}
          onClick={handleGenerate}
          disabled={!canGenerate || isExtracting}
          id="generate-btn"
          style={{ opacity: canGenerate ? 1 : 0.5, cursor: canGenerate ? 'pointer' : 'not-allowed' }}
        >
          <File size={20} />
          {isExtracting ? 'Extracting...' : 'Generate Study Materials'}
        </button>
      </div>
    </div>
  );
}
