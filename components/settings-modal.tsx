'use client';

import React, { useState } from 'react';
import { X, LogOut, Lock, Trash2, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleDeleteAccount = () => {
    // Logic for actual account deletion will go here
    console.log('Account deletion confirmed');
    setShowDeleteConfirmation(false);
    onClose(); // Close main modal after deletion
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg shadow-xl w-full max-w-md border border-[var(--gray-200)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            aria-label="Close settings modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Log Out */}
          <button
            onClick={() => {
              console.log('Log out clicked');
              // Actual log out logic will be added here
              onClose();
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)] rounded-md border border-[var(--gray-200)] transition-colors cursor-pointer"
          >
            <LogOut size={18} className="mr-3 text-[var(--muted-foreground)]" />
            Log Out
          </button>

          {/* Change Password */}
          <button
            onClick={() => {
              console.log('Change password clicked');
              // UI for change password will be shown here
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)] rounded-md border border-[var(--gray-200)] transition-colors cursor-pointer"
          >
            <Lock size={18} className="mr-3 text-[var(--muted-foreground)]" />
            Change Password
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-500/10 hover:text-red-700 rounded-md border border-red-500/30 transition-colors cursor-pointer"
          >
            <Trash2 size={18} className="mr-3" />
            Delete Account
          </button>
        </div>

        {/* Delete Account Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--background)] p-6 rounded-lg shadow-xl w-full max-w-sm border border-[var(--gray-300)]">
              <div className="flex items-center mb-4">
                <AlertTriangle size={24} className="text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Confirm Deletion</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                Are you sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] bg-[var(--secondary-background)] hover:bg-[var(--accent-background)] rounded-md border border-[var(--gray-200)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal; 