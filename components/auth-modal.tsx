'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script'; // Added for Google GSI
import { X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client'; // Import Supabase client
import type { CredentialResponse } from 'google-one-tap'; // Added for Google GSI

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to generate nonce (from Supabase example)
const generateNonce = async (): Promise<[string, string]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return [nonce, hashedNonce];
};

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
  const [isGsiLoaded, setIsGsiLoaded] = useState(false); // Added for Google GSI
  const googleButtonDivRef = useRef<HTMLDivElement>(null); // Ref for the Google button container

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

  // Google One-Tap Integration Effect
  useEffect(() => {
    if (!isOpen || !isGsiLoaded) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google One-Tap/Button will be disabled.');
      setErrorMessage("Google Sign-In is currently unavailable."); // User-facing message
      return;
    }

    const initializeGoogleSignIn = async () => {
      const [nonce, hashedNonce] = await generateNonce();
      console.log('Initializing Google Sign In with nonce pair.');

      if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.id) {
        console.error('Google GSI script not fully loaded or window.google is not available.');
        setErrorMessage("Google Sign-In could not be initialized. Please try again later.");
        return;
      }
      
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          setIsLoading(true);
          setErrorMessage(null);
          setInfoMessage(null);
          try {
            if (!response.credential) {
              throw new Error('No credential received from Google.');
            }
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce, 
            });
            if (error) throw error;
            console.log('Successfully logged in with Google. Session data:', data);
            onClose(); 
          } catch (error: any) {
            console.error('Error logging in with Google:', error);
            setErrorMessage(error.message || 'An error occurred during Google sign-in.');
          } finally {
            setIsLoading(false);
          }
        },
        nonce: hashedNonce, 
        use_fedcm_for_prompt: true,
        context: 'signin',
      });

      // Render the Google Sign-In button
      if (googleButtonDivRef.current) {
        const containerWidth = googleButtonDivRef.current.offsetWidth;
        let buttonWidth: number | undefined = undefined;

        if (containerWidth > 200) {
          buttonWidth = containerWidth;
        } else if (containerWidth > 0) { // If container is very small but > 0, use Google's min width
          buttonWidth = 200;
        }
        // If containerWidth is 0 (e.g. display:none, though unlikely here), buttonWidth remains undefined, Google uses default.

        window.google.accounts.id.renderButton(
          googleButtonDivRef.current,
          { theme: 'outline', size: 'large', width: buttonWidth }
        );
      } else {
        console.warn("Google Sign-In button container div not found.");
      }

      // Display the One Tap UI
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn('Google One Tap prompt was not displayed.', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.warn('Google One Tap prompt was skipped.', notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.warn('Google One Tap prompt was dismissed.', notification.getDismissedReason());
        }
      });
    };

    initializeGoogleSignIn();

    return () => {
      if (typeof window.google !== 'undefined' && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
        console.log('Google Sign In prompt/button flow cancelled on modal close/cleanup.');
      }
    };
  }, [isOpen, isGsiLoaded, supabase, onClose, setErrorMessage, setIsLoading, setInfoMessage]);

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
        // User created and session active (e.g., email confirmation disabled or social provider)
        onClose(); // Close modal on successful signup
      }
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload" // Load when browser is idle and modal might open
        onLoad={() => {
          console.log('Google GSI script loaded.');
          setIsGsiLoaded(true);
        }}
        onError={(e) => {
          console.error('Error loading Google GSI script:', e);
          setErrorMessage("Failed to load Google Sign-In. Please try again later or use email/password.");
        }}
      />
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl border border-[var(--gray-200)] p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{isLoginView ? 'Log In' : 'Sign Up'}</h2>
            <button onClick={handleClose} className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)] cursor-pointer" disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          {/* Google Sign-In Button Area */}
          {isGsiLoaded && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <>
              <div ref={googleButtonDivRef} id="googleSignInButtonContainer" className="mb-4 w-full">
                {/* Google button will be rendered here by GSI library */}
              </div>
              <div className="my-4 flex items-center">
                <hr className="flex-grow border-t border-[var(--border)]" />
                <span className="mx-2 text-xs text-[var(--muted-foreground)]">OR</span>
                <hr className="flex-grow border-t border-[var(--border)]" />
              </div>
            </>
          )}

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
              {isLoading && !isGsiLoaded // Better check for GSI loading specifically if needed
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
    </>
  );
};

export default AuthModal; 