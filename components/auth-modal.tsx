'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client'; // Import Supabase client

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added error message state
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // Added info message state for signup

  useEffect(() => {
    // Clear form and messages when modal is closed or view changes
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setInfoMessage(null);
      setIsLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setInfoMessage(null); // Clear info message when closing manually
    onClose();
  }

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    if (isLoginView) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        onClose(); // Close modal on successful login
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match!");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin, // Or a specific callback URL
        },
      });
      if (error) {
        setErrorMessage(error.message);
      } else if (data.user && !data.session) {
        // User created, email confirmation needed
        setInfoMessage('Please check your email to verify your account.');
      } else {
        // User created and session active (e.g., email confirmation disabled)
        onClose(); // Close modal on successful signup
      }
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{isLoginView ? 'Log In' : 'Sign Up'}</h2>
          <button onClick={handleClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer" disabled={isLoading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emailInput" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="passwordInput" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
              autoComplete={isLoginView ? "current-password" : "new-password"}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLoginView && (
            <div className="mb-6 relative">
              <label htmlFor="confirmPasswordInput" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPasswordInput"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md">
              {errorMessage}
            </div>
          )}
          {infoMessage && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 text-sm rounded-md">
              {infoMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !!infoMessage} // Disable if loading or if info message is shown (e.g. "check email")
          >
            {isLoading
              ? (isLoginView ? 'Logging In...' : 'Creating Account...')
              : (isLoginView ? 'Log In' : 'Create Account')}
          </button>
        </form>

        {!infoMessage && ( // Only show toggle if no info message (like "check email")
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}\
            <button
              onClick={toggleView}
              className="font-medium text-[var(--primary)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 