import { Brain } from 'lucide-react';

export default function LoadingSpinner({ message = 'Analyzing your notes...' }) {
  return (
    <div className="loading-container" id="loading-spinner">
      <div className="loading-icon">
        <div className="loading-ring" />
        <div className="loading-ring-inner" />
        <div className="loading-brain">
          <Brain size={28} />
        </div>
      </div>
      <div className="loading-text">{message}</div>
      <div className="loading-subtext">This won&apos;t take long</div>
    </div>
  );
}
