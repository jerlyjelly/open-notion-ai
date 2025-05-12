'use client'; // Assuming some interactions might need client components, icons are often better this way.

import {
  useState
} from 'react'; // Added useState for theme toggle
import {
  ChevronDown,
  Edit3,
  Plus,
  Search,
  Brain,
  Image as ImageIcon,
  MoreHorizontal,
  Mic,
  Send,
  User,
  Sun, // Added Sun icon
  Moon, // Added Moon icon
  Globe, // Added Globe icon
} from 'lucide-react';

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
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme toggle

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also apply the theme change (e.g., by adding/removing a class on the body)
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="p-3 sm:p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Edit3 size={20} className="text-gray-600" />
          <span className="text-sm font-medium">{t('header.chatModelName', 'ChatGPT 4o')}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Globe Icon Button */}
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            aria-label="Select language"
          >
            <Globe size={18} />
          </button>

          {/* User Icon */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-grow items-center justify-center p-4">
        {/* Input Bar Container */}
        <div className="w-full max-w-xl lg:max-w-2xl bg-gray-50/50 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
          {/* Top part: input field and main action buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
              <Plus size={22} />
            </button>
            <input
              type="text"
              placeholder={t('home.askAnythingPlaceholder', 'Ask anything')}
              className="flex-grow bg-transparent focus:outline-none p-2 text-base placeholder-gray-500"
            />
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
              <Mic size={20} />
            </button>
            <button className="p-2.5 bg-black text-white rounded-full hover:bg-gray-800">
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
                className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
              >
                {action.icon}
                <span>{t(action.textKey, action.defaultText)}</span>
              </button>
            ))}
            <button className="flex-shrink-0 p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer (optional, for balance) */}
      <footer className="p-4 text-center text-xs text-gray-400">
        OpenNotionAI
      </footer>
    </div>
  );
}
