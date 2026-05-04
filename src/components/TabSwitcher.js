'use client';

import { FileText, HelpCircle, Layers, MessageSquare, BarChart3 } from 'lucide-react';

export default function TabSwitcher({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'ask', label: 'Ask AI', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="tab-switcher" id="tab-switcher">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            id={`tab-${tab.id}`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
