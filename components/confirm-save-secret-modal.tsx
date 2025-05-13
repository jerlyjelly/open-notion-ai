'use client';

import React from 'react';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmSaveSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Make onConfirm async
  isLoading: boolean; // Add isLoading prop
  error: string | null; // Add error prop
}

const ConfirmSaveSecretModal: React.FC<ConfirmSaveSecretModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  error,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm();
    // onClose will be handled by the parent component upon successful save or if an error occurs that should close the modal
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <AlertTriangle size={22} className="mr-2 text-yellow-500" />
            Save Notion Secret to Cloud?
          </h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          Saving your Notion Integration Secret to the cloud will allow you to access it from any device where you are logged in. It will be stored securely using end-to-end encryption where only you can decrypt it.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</>
            ) : (
              'Save to Cloud'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSaveSecretModal; 