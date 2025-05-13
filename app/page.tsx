'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback // Added useCallback
} from 'react';
import {
  ChevronDown,
  Sun,
  Moon,
  User,
  Github,
  Plus,
  Send,
  PanelLeftOpen,
  Check,
  X,
  OctagonAlert,
  LogOut,
  Loader2,
  Cloud, // Added Cloud icon
  Lock,  // Added Lock icon
  Unlock // Added Unlock icon
} from 'lucide-react';
import CollapsibleSidebar from "@/components/collapsible-sidebar";
import UserProfileDropdown from '@/components/user-profile-dropdown';
import ModelSelectorDropdown from '@/components/model-selector-dropdown';
import NotionIntegrationModal from '@/components/notion-integration-modal';
import AuthModal from '@/components/auth-modal';
import ConfirmSaveSecretModal from '@/components/confirm-save-secret-modal'; // Import the new modal
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { encryptSecret, decryptSecret } from '@/lib/crypto-utils'; // Import crypto utils

const LOCAL_STORAGE_NOTION_SECRET_KEY = 'notion_integration_secret';

export default function HomePage() {
  const { session, user, isLoading: isAuthLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);
  const userProfileRef = useRef<HTMLDivElement>(null);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [currentModelId, setCurrentModelId] = useState('gpt-4o');
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // Notion State
  const [notionSecretInput, setNotionSecretInput] = useState(''); // For the modal input field
  const [activeNotionSecret, setActiveNotionSecret] = useState<string | null>(null); // The secret currently in use (decrypted)
  const [isNotionConnected, setIsNotionConnected] = useState(false); // True if a secret is active
  const [isNotionSecretCloudSaved, setIsNotionSecretCloudSaved] = useState(false); // True if active secret came from cloud
  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [isConfirmSaveSecretModalOpen, setIsConfirmSaveSecretModalOpen] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaveError, setCloudSaveError] = useState<string | null>(null);
  const [notionConnectionStatusMessage, setNotionConnectionStatusMessage] = useState<string | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- Notion Logic --- 

  const clearNotionState = () => {
    setActiveNotionSecret(null);
    setIsNotionConnected(false);
    setIsNotionSecretCloudSaved(false);
    setNotionSecretInput('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_NOTION_SECRET_KEY);
    }
    setNotionConnectionStatusMessage('Notion disconnected.');
  };

  // Function to simulate Notion connection check
  const checkNotionConnection = useCallback(async (secret: string) => {
    // In a real app, you'd make an API call to Notion here
    // For now, just simulate success if secret is present
    if (secret && secret.startsWith('ntn_')) { // Basic check
      setIsNotionConnected(true);
      setNotionConnectionStatusMessage(isNotionSecretCloudSaved ? 'Notion connected (using saved secret).': 'Notion connected for this session.');
      return true;
    } else {
      setIsNotionConnected(false);
      setActiveNotionSecret(null); // Clear invalid secret
      setNotionConnectionStatusMessage('Failed to connect to Notion. Invalid secret.');
      return false;
    }
  }, [isNotionSecretCloudSaved]);

  // Load secret on mount or user change
  useEffect(() => {
    const loadSecret = async () => {
      if (user && session?.access_token) {
        try {
          const { data, error } = await supabase.functions.invoke('get-notion-secret', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (error) throw error;

          if (data && data.encryptedNotionSecret) {
            const decryptedSecret = await decryptSecret(data.encryptedNotionSecret, session.access_token);
            setActiveNotionSecret(decryptedSecret);
            setNotionSecretInput(decryptedSecret); // Pre-fill input if loaded from cloud
            setIsNotionSecretCloudSaved(true);
            await checkNotionConnection(decryptedSecret);
            return;
          }
        } catch (err: any) {
          console.error('Failed to load or decrypt Notion secret from cloud:', err);
          setNotionConnectionStatusMessage('Could not load saved Notion secret. Try entering it manually.');
          // Fall through to check local storage if cloud fails
        }
      }
      // If not logged in, or cloud fetch failed/returned no secret, try localStorage
      if (typeof window !== 'undefined') {
        const localSecret = localStorage.getItem(LOCAL_STORAGE_NOTION_SECRET_KEY);
        if (localSecret) {
          setActiveNotionSecret(localSecret);
          setNotionSecretInput(localSecret); // Pre-fill input if loaded from local
          setIsNotionSecretCloudSaved(false);
          await checkNotionConnection(localSecret);
        }
      }
    };
    loadSecret();
  }, [user, session, checkNotionConnection]);
  

  const handleConnectNotionLocally = async () => {
    if (!notionSecretInput) {
      setCloudSaveError('Please enter a Notion secret.'); // Use cloudSaveError for modal msg
      return;
    }
    setActiveNotionSecret(notionSecretInput);
    setIsNotionSecretCloudSaved(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_NOTION_SECRET_KEY, notionSecretInput);
    }
    const connected = await checkNotionConnection(notionSecretInput);
    if (connected) {
      setIsNotionModalOpen(false); // Close modal on successful local connection
    }
  };

  const handleOpenSaveToCloud = () => {
    if (!notionSecretInput) {
      setCloudSaveError('Please enter a Notion secret to save.');
      return;
    }
    setCloudSaveError(null); // Clear previous errors
    if (!user) {
      setIsNotionModalOpen(false); // Close Notion modal
      setIsAuthModalOpen(true); // Open Auth modal
    } else {
      // User is logged in, open confirmation modal
      setIsConfirmSaveSecretModalOpen(true);
    }
  };

  const handleConfirmSaveSecretToSupabase = async () => {
    if (!notionSecretInput || !user || !session?.access_token) {
      setCloudSaveError('Cannot save secret. User not authenticated or secret missing.');
      setIsSavingToCloud(false);
      return;
    }
    setIsSavingToCloud(true);
    setCloudSaveError(null);
    try {
      const encryptedSecret = await encryptSecret(notionSecretInput, session.access_token);
      const { error: functionError } = await supabase.functions.invoke('save-notion-secret', {
        body: { encryptedNotionSecret: encryptedSecret },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (functionError) throw functionError;

      setActiveNotionSecret(notionSecretInput);
      setIsNotionSecretCloudSaved(true);
      if (typeof window !== 'undefined') { // Clear local if successfully saved to cloud
        localStorage.removeItem(LOCAL_STORAGE_NOTION_SECRET_KEY);
      }
      await checkNotionConnection(notionSecretInput);
      setIsConfirmSaveSecretModalOpen(false);
      setIsNotionModalOpen(false); // Close main Notion modal too
      setNotionConnectionStatusMessage('Notion secret securely saved to cloud!');

    } catch (err: any) {
      console.error('Error saving Notion secret to Supabase:', err);
      setCloudSaveError(err.message || 'Failed to save secret to cloud.');
      // Keep confirm modal open to show error
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Other UI toggles and handlers
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleUserProfileDropdown = () => setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  const closeUserProfileDropdown = () => setIsUserProfileDropdownOpen(false);
  const toggleModelSelectorDropdown = () => setIsModelSelectorOpen(!isModelSelectorOpen);
  const closeModelSelectorDropdown = () => setIsModelSelectorOpen(false);
  const handleSelectModel = (modelId: string) => setCurrentModelId(modelId);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userProfileRef.current && !userProfileRef.current.contains(event.target as Node)) closeUserProfileDropdown();
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) closeModelSelectorDropdown();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update Notion button text/icon based on connection status
  const NotionButtonIcon = isNotionConnected ? (isNotionSecretCloudSaved ? Lock : Unlock) : OctagonAlert;
  const NotionButtonText = isNotionConnected 
    ? (isNotionSecretCloudSaved ? 'Notion Linked (Cloud)' : 'Notion Linked (Local)') 
    : 'Link Notion';
  const NotionButtonClass = isNotionConnected ? 'text-green-500' : 'text-red-500';

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={toggleSidebar} aria-hidden="true" />}
      <CollapsibleSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out h-screen overflow-hidden ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <header className="p-3 sm:p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-2 relative" ref={modelSelectorRef}>
            {!isSidebarOpen && (
              <button onClick={toggleSidebar} className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer" aria-label="Toggle sidebar">
                <PanelLeftOpen size={20} />
              </button>
            )}
            <button
              id="model-selector-button"
              onClick={toggleModelSelectorDropdown}
              className="flex items-center space-x-1 px-2 py-1 hover:bg-[var(--gray-100)] rounded-md cursor-pointer"
              aria-haspopup="true"
              aria-expanded={isModelSelectorOpen}
            >
              <span className="text-sm font-medium">
                {currentModelId === 'gpt-4o' ? 'ChatGPT 4o' : currentModelId}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
            </button>
            <ModelSelectorDropdown isOpen={isModelSelectorOpen} onClose={closeModelSelectorDropdown} selectedModelId={currentModelId} onSelectModel={handleSelectModel} />
          </div>
          <div className="flex items-center space-x-3">
            {isAuthLoading ? (
              <div className="px-3 py-1.5 h-[31px] w-[60px] animate-pulse bg-[var(--gray-200)] rounded-md"></div> 
            ) : !user ? (
              <button onClick={openAuthModal} className="px-3 py-1.5 text-sm font-medium text-[var(--foreground)] bg-[var(--btn-background)] hover:bg-[var(--btn-background-hover)] border border-[var(--gray-200)] rounded-md cursor-pointer">
                Log In
              </button>
            ) : null}
            <button onClick={toggleTheme} className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer" aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="https://github.com/jerlyjelly/open-notion-ai" target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer" aria-label="View on GitHub">
              <Github size={18} />
            </a>
            {!isAuthLoading && user && (
              <div className="relative" ref={userProfileRef}>
                <button onClick={toggleUserProfileDropdown} className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer" aria-label="User menu" id="user-menu-button" aria-haspopup="true" aria-expanded={isUserProfileDropdownOpen}>
                  <User size={18} />
                </button>
                <UserProfileDropdown isOpen={isUserProfileDropdownOpen} onClose={closeUserProfileDropdown} />
              </div>
            )}
          </div>
        </header>

        <main className="flex flex-col flex-grow items-center p-4 justify-end sm:justify-end md:justify-center pb-4">
          <div className="w-full max-w-xl lg:max-w-2xl bg-[var(--gray-50)]/50 p-3 sm:p-4 rounded-xl shadow-lg border border-[var(--gray-200)]">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-[var(--gray-500)] hover:bg-[var(--gray-200)] rounded-full cursor-pointer">
                <Plus size={22} />
              </button>
              <input
                type="text"
                placeholder="Ask anything"
                className="flex-grow bg-transparent focus:outline-none p-2 text-base placeholder-[var(--gray-500)]"
              />
              <button className="p-2.5 bg-black text-white rounded-full hover:bg-gray-800 cursor-pointer">
                <Send size={18} />
              </button>
            </div>
            <div className="mt-3 flex items-start">
              <button
                onClick={() => {
                    setCloudSaveError(null); // Clear previous errors when opening modal
                    setIsNotionModalOpen(true);
                }}
                className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] rounded-lg text-xs font-medium text-[var(--gray-700)] cursor-pointer"
              >
                <NotionButtonIcon size={14} className={NotionButtonClass} />
                <span>{NotionButtonText}</span>
              </button>
            </div>
            {notionConnectionStatusMessage && (
                <p className={`text-xs mt-2 ${isNotionConnected ? 'text-green-600' : 'text-red-600'}`}>{notionConnectionStatusMessage}</p>
            )}
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-[var(--gray-500)] flex-shrink-0">
          OpenNotionAI
        </footer>
      </div>

      <NotionIntegrationModal
        isOpen={isNotionModalOpen}
        onClose={() => setIsNotionModalOpen(false)}
        notionSecretInput={notionSecretInput}
        setNotionSecretInput={setNotionSecretInput}
        onConnectLocally={handleConnectNotionLocally}
        onSaveToCloud={handleOpenSaveToCloud}
        isSavingToCloud={isSavingToCloud}
        cloudSaveError={cloudSaveError}
        isConnected={isNotionConnected}
        isCloudSaved={isNotionSecretCloudSaved}
      />
      <ConfirmSaveSecretModal
        isOpen={isConfirmSaveSecretModalOpen}
        onClose={() => setIsConfirmSaveSecretModalOpen(false)}
        onConfirm={handleConfirmSaveSecretToSupabase}
        isLoading={isSavingToCloud}
        error={cloudSaveError}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
            closeAuthModal();
            // If user logged in to save secret, reopen Notion modal
            if(notionSecretInput && !isConfirmSaveSecretModalOpen && session) { // Check if flow was to save secret & user is now logged in (session exists)
                setIsNotionModalOpen(true);
                // Optionally, directly open confirm modal if desired after login
                // setIsConfirmSaveSecretModalOpen(true); 
            }
        }}
      />
    </div>
  );
}
