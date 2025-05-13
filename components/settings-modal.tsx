'use client';

import React, { useState } from 'react';
import { X, LogOut, Lock, Trash2, AlertTriangle, Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase/client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  // States for Change Password
  const [showChangePasswordView, setShowChangePasswordView] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleLogout = async () => {
    if (!user) return;
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out from settings:', error.message);
    }
    setIsLoggingOut(false);
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeletingAccount(true);
    setDeleteAccountError(null);

    try {
      const { error: functionError } = await supabase.functions.invoke('delete-user-account', {
        method: 'POST',
      });

      if (functionError) {
        throw functionError;
      }

      console.log('Account deletion successful via Edge Function.');
      await supabase.auth.signOut();
      setShowDeleteConfirmation(false);
      onClose();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setDeleteAccountError(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const openChangePasswordView = () => {
    setShowChangePasswordView(true);
    setPasswordUpdateMessage(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const closeChangePasswordView = () => {
    setShowChangePasswordView(false);
    setPasswordUpdateMessage(null);
    setDeleteAccountError(null);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordUpdateMessage({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) { // Example: Enforce minimum password length
      setPasswordUpdateMessage({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordUpdateMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordUpdateMessage({ type: 'error', message: error.message });
    } else {
      setPasswordUpdateMessage({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally close the view after a delay or keep it open with success message
      // setTimeout(closeChangePasswordView, 2000);
    }
    setIsUpdatingPassword(false);
  };

  const actionsDisabled = isLoggingOut || isUpdatingPassword || isDeletingAccount;
  const mainSettingsActionsDisabled = showChangePasswordView || isLoggingOut || isDeletingAccount;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg shadow-xl w-full max-w-md border border-[var(--gray-200)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{showChangePasswordView ? 'Change Password' : 'Settings'}</h2>
          <button
            onClick={showChangePasswordView ? closeChangePasswordView : onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={showChangePasswordView ? "Back to settings" : "Close settings modal"}
            disabled={isLoggingOut || isUpdatingPassword}
          >
            <X size={24} />
          </button>
        </div>

        {!showChangePasswordView ? (
          <div className="space-y-4">
            {/* Log Out */}
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-md border border-[var(--gray-200)] transition-colors 
                          ${isLoggingOut ? 'justify-center cursor-wait' : 'justify-start text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)] cursor-pointer'}
                          ${mainSettingsActionsDisabled && !isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={mainSettingsActionsDisabled}
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogOut size={18} className="mr-3 text-[var(--muted-foreground)]" />
                  Log Out
                </>
              )}
            </button>

            {/* Change Password Button - Toggles View */}
            <button
              onClick={openChangePasswordView}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-md border border-[var(--gray-200)] transition-colors 
                          ${mainSettingsActionsDisabled ? 'opacity-50 cursor-not-allowed text-[var(--muted-foreground)]' : 'text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)] cursor-pointer'}`}
              disabled={mainSettingsActionsDisabled}
            >
              <Lock size={18} className="mr-3 text-[var(--muted-foreground)]" />
              Change Password
            </button>

            {/* Delete Account */}
            <button
              onClick={() => {
                if (mainSettingsActionsDisabled) return;
                setDeleteAccountError(null);
                setShowDeleteConfirmation(true);
              }}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-md border border-red-500/30 transition-colors 
                          ${mainSettingsActionsDisabled ? 'opacity-50 cursor-not-allowed text-red-600/50' : 'text-red-600 hover:bg-red-500/10 hover:text-red-700 cursor-pointer'}`}
              disabled={mainSettingsActionsDisabled}
            >
              <Trash2 size={18} className="mr-3" />
              Delete Account
            </button>
          </div>
        ) : (
          // Change Password View
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="relative">
              <label htmlFor="newPasswordInput" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">New Password</label>
              <input 
                id="newPasswordInput"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50"
                placeholder="Enter new password"
                required
                disabled={isUpdatingPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                disabled={isUpdatingPassword}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmNewPasswordInput" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Confirm New Password</label>
              <input 
                id="confirmNewPasswordInput"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50"
                placeholder="Confirm new password"
                required
                disabled={isUpdatingPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50"
                aria-label={showConfirmNewPassword ? "Hide confirm password" : "Show confirm password"}
                disabled={isUpdatingPassword}
              >
                {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwordUpdateMessage && (
              <div className={`flex items-center p-3 text-sm rounded-md border ${passwordUpdateMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                {passwordUpdateMessage.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
                {passwordUpdateMessage.message}
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {/* Delete Account Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--background)] p-6 rounded-lg shadow-xl w-full max-w-sm border border-[var(--gray-300)]">
              <div className="flex items-center mb-4">
                <AlertTriangle size={24} className="text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Confirm Deletion</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                Are you sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
              </p>
              {deleteAccountError && (
                <div className="mb-4 p-3 text-sm rounded-md border bg-red-50 border-red-300 text-red-700 flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  {deleteAccountError}
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteAccountError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] bg-[var(--secondary-background)] hover:bg-[var(--accent-background)] rounded-md border border-[var(--gray-200)] transition-colors cursor-pointer disabled:opacity-50"
                  disabled={isDeletingAccount}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                  {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
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