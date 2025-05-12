'use client'; // Assuming some interactions might need client components, icons are often better this way.

import {
  useState,
  useEffect
} from 'react'; // Added hooks for theme toggle
import {
  ChevronDown,
  Sun,
  Moon,
  Globe,
  User,
  Plus,
  Send,
  Search,
  Brain,
  ImageIcon,
  PanelLeftOpen // Added Menu icon
} from 'lucide-react';
import CollapsibleSidebar from "@/components/collapsible-sidebar"; // Adjusted path assuming 'components' is aliased or directly under root for app dir structure. If not, will be '../components/collapsible-sidebar'

// A placeholder for your i18n function
// You'll need to replace this with your actual i18n implementation
// For example, using 'next-international' or 'react-i18next'
const t = (key: string, defaultValue?: string) => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "header.chatModelName": "ChatGPT 4o",
      "avatar.plus": "PLUS",
      "home.askAnythingPlaceholder": "Ask anything",
      "home.searchAction": "Search",
      "home.deepResearchAction": "Deep research",
      "home.createImageAction": "Create image"
    },
    // Add other languages here, e.g., 'ko'
    ko: {
      "header.chatModelName": "ChatGPT 4o",
      "avatar.plus": "플러스",
      "home.askAnythingPlaceholder": "무엇이든 물어보세요",
      "home.searchAction": "검색",
      "home.deepResearchAction": "심층 연구",
      "home.createImageAction": "이미지 생성"
    }
  };
  // Simple fallback, assuming 'en' is the default language.
  // In a real app, you'd get the current language from context or settings.
  const currentLang = 'en'; // Or 'ko', or dynamically set
  return translations[currentLang]?.[key] || defaultValue || key;
};


export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <CollapsibleSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main content wrapper for sidebar transition */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center"> {/* Removed border-b and border color classes */}
        <div className="flex items-center space-x-2">
          {/* Sidebar Toggle Button - Conditionally rendered */}
          {!isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
              aria-label={t('header.toggleSidebar', 'Toggle sidebar')}
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
          {/* Existing left header items */}
          <span className="text-sm font-medium">{t('header.chatModelName', 'ChatGPT 4o')}</span>
          <ChevronDown size={16} className="text-gray-500 cursor-pointer" />
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

          {/* Globe Icon Button */}
          <button 
            className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer"
            aria-label="Select language"
          >
            <Globe size={18} />
          </button>

          {/* User Icon */}
          <div className="p-2 text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-full cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-grow items-center justify-center p-4">
        {/* Input Bar Container */}
        <div className="w-full max-w-xl lg:max-w-2xl bg-[var(--gray-50)]/50 p-3 sm:p-4 rounded-xl shadow-lg border border-[var(--gray-200)]">
          {/* Top part: input field and main action buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-[var(--gray-500)] hover:bg-[var(--gray-200)] rounded-full cursor-pointer">
              <Plus size={22} />
            </button>
            <input
              type="text"
              placeholder={t('home.askAnythingPlaceholder', 'Ask anything')}
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
                <span>{t(action.textKey, action.defaultText)}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer (optional, for balance) */}
      <footer className="p-4 text-center text-xs text-[var(--gray-500)]">
        OpenNotionAI
      </footer>
      </div> {/* Closing main content wrapper */}
    </div>
  );
}
