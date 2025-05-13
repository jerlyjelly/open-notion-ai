'use client';

import React from 'react';
import {
  PanelLeftClose,
  Search as SearchIcon,
  PlusCircle,
} from 'lucide-react';



interface CollapsibleSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col bg-[var(--gray-50)] text-[var(--foreground)] shadow-lg md:shadow-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between p-4">
        <div className="flex items-center justify-start flex-grow">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)] cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
        <div className="flex items-center justify-end flex-grow">
          <button
            className="rounded-md p-2 text-[var(--gray-600)] hover:bg-[var(--gray-200)] cursor-pointer"
            aria-label="Search history"
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
            "Chat about Next.js features"
          </li>
          <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
            "Tailwind CSS tips"
          </li>
          <li className="cursor-pointer rounded-md p-2 hover:bg-[var(--gray-200)]">
            "Supabase RLS discussion"
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