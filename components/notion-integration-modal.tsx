'use client';

import React from 'react';
import { X, Info } from 'lucide-react';

interface NotionIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notionSecret: string;
  setNotionSecret: (secret: string) => void;
  onConnect: () => void;
}

const NotionIntegrationModal: React.FC<NotionIntegrationModalProps> = ({
  isOpen,
  onClose,
  notionSecret,
  setNotionSecret,
  onConnect,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Connect Notion</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="notionSecretInput" className="block text-sm font-medium text-[var(--muted-foreground)]">
            Notion Integration Secret
          </label>
          <a 
            href="https://pastebin.com/w2dJ6Lax" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer"
            aria-label="Learn more about Notion Integration Secret"
          >
            <Info size={16} />
          </a>
        </div>
        <input
          type="password"
          id="notionSecretInput"
          value={notionSecret}
          onChange={(e) => setNotionSecret(e.target.value)}
          className="w-full px-3 py-2 mb-6 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--gray-200)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-foreground)] focus:border-[var(--accent-foreground)] placeholder:text-[var(--muted-foreground)]"
          placeholder="Enter your Notion Integration Secret"
          autoComplete="off"
        />
        {/* Connect Button */}
        <div className="">
          <button
            type="button" // Prevent form submission
            onClick={() => {
              onConnect();
              onClose(); // Ensure modal closes on connect
            }}
            // Use high-contrast, explicit colors and revert to full-width
            className="w-full px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotionIntegrationModal; 