'use client';

import React from 'react';
import {
  PanelLeftClose,
  Search as SearchIcon,
  PlusCircle,
} from 'lucide-react';

// A placeholder t function for i18n, replace with your actual i18n solution
const t = (key: string, defaultText: string) => defaultText;

interface CollapsibleSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ isOpen, toggleSidebar }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-full w-64 flex-col bg-[var(--gray-100)] text-[var(--foreground)]">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between p-4">
        <div className="flex items-center justify-start flex-grow">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)] cursor-pointer"
            aria-label={t('sidebar.collapse', 'Collapse sidebar')}
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
        <div className="flex items-center justify-end flex-grow">
          <button
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)] cursor-pointer"
            aria-label={t('sidebar.searchHistory', 'Search history')}
          >
            <SearchIcon size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-grow overflow-y-auto p-4">
        {/* Unified Chat List */}
        <ul className="space-y-1 text-sm text-[var(--gray-700)]">
          <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
            {t('sidebar.chatItemPlaceholder1', 'Chat about Next.js features')}
          </li>
          <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
            {t('sidebar.chatItemPlaceholder2', 'Tailwind CSS tips')}
          </li>
          <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
            {t('sidebar.chatItemPlaceholder3', 'Supabase RLS discussion')}
          </li>
        </ul>
      </div>

      {/* Sidebar Footer (optional) */}
      {/* <div className="border-t border-[var(--gray-200)] p-4">
        User Profile / Settings
      </div> */}
    </aside>
  );
};

export default CollapsibleSidebar;