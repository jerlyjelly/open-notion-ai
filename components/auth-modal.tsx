'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff for password visibility

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We'll add more props later for handling login/signup logic
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoginView, setIsLoginView] = useState(true); // To toggle between Login and Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Only for Sign Up
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      // Handle login logic
      console.log('Login attempt:', { email, password });
      // onClose(); // Close modal on successful login/signup
    } else {
      // Handle sign up logic
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Sign up attempt:', { email, password });
      // onClose(); // Close modal on successful login/signup
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{isLoginView ? 'Log In' : 'Sign Up'}</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer">
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
              className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
              placeholder="you@example.com"
              required
              autoComplete="email"
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
              className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
              placeholder="••••••••"
              required
              autoComplete={isLoginView ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
                className="w-full px-3 py-2 text-sm bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer mb-4"
          >
            {isLoginView ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted-foreground)]">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}\
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="font-medium text-[var(--primary)] hover:underline"
          >
            {isLoginView ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal; 