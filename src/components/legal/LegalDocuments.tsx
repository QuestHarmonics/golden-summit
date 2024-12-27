import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './LegalDocuments.css';

interface LegalDocumentsProps {
  type: 'privacy-policy' | 'terms-of-service';
  onClose?: () => void;
}

export const LegalDocuments: React.FC<LegalDocumentsProps> = ({ type, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/legal/${type}.md`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading legal document:', error);
        setContent('Error loading document. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [type]);

  const title = type === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="legal-container">
      <div className="legal-content">
        <div className="legal-header">
          <h2>{title}</h2>
          {onClose && (
            <button onClick={onClose} className="close-button">
              ×
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="legal-text">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        <div className="legal-footer">
          <p>
            If you have any questions about these documents, please contact us at{' '}
            <a href="mailto:support@goldensummit.app">support@goldensummit.app</a>
          </p>
          {onClose && (
            <button onClick={onClose} className="close-button-bottom">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 