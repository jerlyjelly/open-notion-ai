'use client';

import React from 'react';
import { X, Info, Cloud, Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface NotionIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notionSecretInput: string;
  setNotionSecretInput: (secret: string) => void;
  onConnectLocally: () => void;
  onSaveToCloud: () => void;
  isSavingToCloud: boolean;
  cloudSaveError: string | null;
  isConnected: boolean;
  isCloudSaved: boolean;
}

const NotionIntegrationModal: React.FC<NotionIntegrationModalProps> = ({
  isOpen,
  onClose,
  notionSecretInput,
  setNotionSecretInput,
  onConnectLocally,
  onSaveToCloud,
  isSavingToCloud,
  cloudSaveError,
  isConnected,
  isCloudSaved,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConnectLocally = () => {
    onConnectLocally();
    // onClose(); // Parent should decide to close based on connection success
  };

  const handleSaveToCloud = () => {
    onSaveToCloud();
    // Parent will handle modal closure or further actions
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Connect Notion</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer" disabled={isSavingToCloud}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="notionSecretInput" className="block text-sm font-medium text-[var(--muted-foreground)]">
            Notion Integration Secret
          </label>
          <a 
            href="https://www.notion.so/my-integrations" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer flex items-center"
            aria-label="Learn more about Notion Integration Secret"
          >
            <Info size={14} className="mr-1" /> Get your secret
          </a>
        </div>
        <input
          type="password"
          id="notionSecretInput"
          value={notionSecretInput}
          onChange={(e) => setNotionSecretInput(e.target.value)}
          className="w-full px-3 py-2 mb-4 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
          placeholder="Enter your Notion Integration Secret"
          autoComplete="off"
          disabled={isSavingToCloud}
        />

        {cloudSaveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md flex items-center">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
            <span>{cloudSaveError}</span>
          </div>
        )}

        {isConnected && (
            <div className="mb-4 p-3 bg-green-50 border border-green-400 text-green-700 text-sm rounded-md flex items-center">
                <CheckCircle size={18} className="mr-2 flex-shrink-0" />
                <span>Notion connected. {isCloudSaved ? "(Using saved secret)" : "(Using secret for this session)"}</span>
            </div>
        )}

        {/* Action Buttons */} 
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleConnectLocally}
            disabled={isSavingToCloud || !notionSecretInput}
            className="w-full px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            <Zap size={16} className="mr-2" /> Use for this session only
          </button>

          <button
            type="button"
            onClick={handleSaveToCloud} 
            disabled={isSavingToCloud || !notionSecretInput}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isSavingToCloud ? (
              <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</>
            ) : (
              <><Cloud size={16} className="mr-2" /> Save to Cloud & Use</>
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-[var(--muted-foreground)]">
          Secrets saved to the cloud are end-to-end encrypted.
        </p>
      </div>
    </div>
  );
};

export default NotionIntegrationModal; 