'use client';

import {
  useState,
  useEffect,
  useRef // Added for click outside detection
} from 'react';
import {
  ChevronDown,
  Sun,
  Moon,
  User,
  Github, // Added Github icon
  Plus,
  Send,
  Search,
  Brain,
  ImageIcon,
  PanelLeftOpen
} from 'lucide-react';
import CollapsibleSidebar from "@/components/collapsible-sidebar";
import UserProfileDropdown from '@/components/user-profile-dropdown'; // Import the new component
import ModelSelectorDropdown from '@/components/model-selector-dropdown'; // Import the model selector dropdown

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);
  const userProfileRef = useRef<HTMLDivElement>(null);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [currentModelId, setCurrentModelId] = useState('gpt-4o'); // Default model
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserProfileDropdown = () => {
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };

  const closeUserProfileDropdown = () => {
    setIsUserProfileDropdownOpen(false);
  };

  const toggleModelSelectorDropdown = () => {
    setIsModelSelectorOpen(!isModelSelectorOpen);
  };

  const closeModelSelectorDropdown = () => {
    setIsModelSelectorOpen(false);
  };

  const handleSelectModel = (modelId: string) => {
    setCurrentModelId(modelId);
    // Potentially trigger other actions, like fetching new data or updating UI elsewhere
  };

  // Initialize theme state based on system preference or localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // First check localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Then check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light theme on server
  });

  // Apply theme effect
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Apply theme class to document element
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode]);

  // Click outside handler for user profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userProfileRef.current && !userProfileRef.current.contains(event.target as Node)) {
        closeUserProfileDropdown();
      }
    };

    if (isUserProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserProfileDropdownOpen]);

  // Click outside handler for model selector dropdown
  useEffect(() => {
    const handleClickOutsideModelSelector = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        closeModelSelectorDropdown();
      }
    };

    if (isModelSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutsideModelSelector);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModelSelector);
    };
  }, [isModelSelectorOpen]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <CollapsibleSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main content wrapper for sidebar transition */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out h-screen overflow-hidden ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="flex items-center space-x-2 relative" ref={modelSelectorRef}> {/* Added relative and ref */}
          {/* Sidebar Toggle Button - Conditionally rendered */}
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
          {/* Model Selector Button */}
          <button
            id="model-selector-button"
            onClick={toggleModelSelectorDropdown}
            className="flex items-center space-x-1 px-2 py-1 hover:bg-[var(--gray-100)] rounded-md cursor-pointer" // Adjusted styling
            aria-haspopup="true"
            aria-expanded={isModelSelectorOpen}
          >
            {/* TODO: Get model display name properly, perhaps from a map or the dropdown component itself */}
            <span className="text-sm font-medium">
              {currentModelId === 'gpt-4o' ? 'ChatGPT 4o' : 
               currentModelId === 'o3' ? 'o3' :
               currentModelId === 'o4-mini' ? 'o4-mini' :
               currentModelId === 'o4-mini-high' ? 'o4-mini-high' :
               'Select Model'}
            </span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
          </button>
          <ModelSelectorDropdown 
            isOpen={isModelSelectorOpen}
            onClose={closeModelSelectorDropdown}
            selectedModelId={currentModelId}
            onSelectModel={handleSelectModel}
          />
        </div>
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
            aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* GitHub Icon Button */}
          <a 
            href="https://github.com/jerlyjelly/open-notion-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
            aria-label="View on GitHub"
          >
            <Github size={18} />
          </a>

          {/* User Icon and Dropdown */}
          <div className="relative" ref={userProfileRef}>
            <button 
              onClick={toggleUserProfileDropdown}
              className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
              aria-label="User menu"
              id="user-menu-button"
              aria-haspopup="true"
              aria-expanded={isUserProfileDropdownOpen}
            >
              <User size={18} />
            </button>
            <UserProfileDropdown isOpen={isUserProfileDropdownOpen} onClose={closeUserProfileDropdown} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-grow items-center p-4 justify-center md:justify-center sm:justify-end pb-4"> 
        {/* Input Bar Container */}
        <div className="w-full max-w-xl lg:max-w-2xl bg-[var(--gray-50)]/50 p-3 sm:p-4 rounded-xl shadow-lg border border-[var(--gray-200)]">
          {/* Top part: input field and main action buttons */}
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

          {/* Bottom part: action suggestions */}
          <div className="mt-3 flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1">
            {[
              { icon: <Search size={14} />, textKey: 'home.searchAction', defaultText: 'Search' },
              { icon: <Brain size={14} />, textKey: 'home.deepResearchAction', defaultText: 'Deep research' },
              { icon: <ImageIcon size={14} />, textKey: 'home.createImageAction', defaultText: 'Create image' },
            ].map((action, index) => (
              <button
                key={index}
                className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] rounded-lg text-xs font-medium text-[var(--gray-700)] cursor-pointer"
              >
                {action.icon}
                <span>{action.defaultText}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer (optional, for balance) */}
      <footer className="p-4 text-center text-xs text-[var(--gray-500)] flex-shrink-0">
        OpenNotionAI
      </footer>
      </div> {/* Closing main content wrapper */}
    </div>
  );
}
