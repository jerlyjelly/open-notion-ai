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
    <aside className="fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col bg-[var(--gray-100)] text-[var(--foreground)] shadow-lg">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--gray-200)] p-4">
        <div className="flex items-center">
          {/* In a real app, this might be a logo or app name */}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar} // This button will now close the sidebar
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)]"
            aria-label={t('sidebar.collapse', 'Collapse sidebar')}
          >
            <PanelLeftClose size={20} />
          </button>
          <button
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)]"
            aria-label={t('sidebar.searchHistory', 'Search history')}
          >
            <SearchIcon size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-grow overflow-y-auto p-4">
        <button className="mb-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-[var(--gray-200)] py-2.5 text-sm font-medium text-[var(--gray-700)] hover:bg-[var(--gray-300)]">
          <PlusCircle size={18} />
          <span>{t('sidebar.newChat', 'New chat')}</span>
        </button>

        {/* Chat History Sections */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--gray-500)]">
              {t('sidebar.today', 'Today')}
            </h3>
            {/* Placeholder for chat items */}
            <ul className="space-y-1 text-sm text-[var(--gray-700)]">
              <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
                {t('sidebar.chatItemPlaceholder1', 'Chat about Next.js features')}
              </li>
              <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
                {t('sidebar.chatItemPlaceholder2', 'Tailwind CSS tips')}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--gray-500)]">
              {t('sidebar.yesterday', 'Yesterday')}
            </h3>
            <ul className="space-y-1 text-sm text-[var(--gray-700)]">
              <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
                {t('sidebar.chatItemPlaceholder3', 'Supabase RLS discussion')}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--gray-500)]">
              {t('sidebar.previous7Days', 'Previous 7 Days')}
            </h3>
            {/* Add more placeholder items or map over actual data */}
          </div>
        </div>
      </div>

      {/* Sidebar Footer (optional) */}
      {/* <div className="border-t border-[var(--gray-200)] p-4">
        User Profile / Settings
      </div> */}
    </aside>
  );
};

export default CollapsibleSidebar;