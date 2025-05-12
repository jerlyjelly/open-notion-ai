'use client';

import React from 'react';
import {
  Zap,
  ListChecks,
  Bot,
  Settings2,
  Settings,
  Keyboard,
  HelpCircle,
  FileText,
  ShieldCheck,
  DownloadCloud,
  LogOut,
  X,
} from 'lucide-react';



interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  // Add other props like user information if needed later
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const menuItems = [
    {
      icon: <Zap size={18} />,
      labelKey: 'userDropdown.upgradePlan',
      defaultLabel: 'Upgrade Plan',
      action: () => console.log('Upgrade Plan clicked'),
    },
    {
      icon: <ListChecks size={18} />,
      labelKey: 'userDropdown.tasks',
      defaultLabel: 'Tasks',
      action: () => console.log('Tasks clicked'),
    },
    {
      icon: <Bot size={18} />,
      labelKey: 'userDropdown.myGpts',
      defaultLabel: 'My GPTs',
      action: () => console.log('My GPTs clicked'),
    },
    {
      icon: <Settings2 size={18} />,
      labelKey: 'userDropdown.customizeChatGPT',
      defaultLabel: 'Customize ChatGPT',
      action: () => console.log('Customize ChatGPT clicked'),
    },
    {
      icon: <Settings size={18} />,
      labelKey: 'userDropdown.settings',
      defaultLabel: 'Settings',
      action: () => console.log('Settings clicked'),
    },
    {
      icon: <Keyboard size={18} />,
      labelKey: 'userDropdown.keyboardShortcuts',
      defaultLabel: 'Keyboard shortcuts',
      action: () => console.log('Keyboard shortcuts clicked'),
    },
  ];

  const secondaryMenuItems = [
    {
      icon: <HelpCircle size={18} />,
      labelKey: 'userDropdown.helpAndFaq',
      defaultLabel: 'Help & FAQ',
      action: () => console.log('Help & FAQ clicked'),
    },
    {
      icon: <FileText size={18} />,
      labelKey: 'userDropdown.releaseNotes',
      defaultLabel: 'Release notes',
      action: () => console.log('Release notes clicked'),
    },
    {
      icon: <ShieldCheck size={18} />,
      labelKey: 'userDropdown.termsAndPolicies',
      defaultLabel: 'Terms & policies',
      action: () => console.log('Terms & policies clicked'),
    },
    {
      icon: <DownloadCloud size={18} />,
      labelKey: 'userDropdown.getSearchExtension',
      defaultLabel: 'Get ChatGPT search extension',
      action: () => console.log('Get ChatGPT search extension clicked'),
    },
  ];

  const logoutItem = {
    icon: <LogOut size={18} />,
    labelKey: 'userDropdown.logout',
    defaultLabel: 'Log out',
    action: () => console.log('Log out clicked'),
  };

  return (
    <div
      className="absolute top-12 right-0 mt-2 w-64 bg-[var(--popover-background)] text-[var(--popover-foreground)] rounded-md shadow-xl z-50 border border-[var(--gray-200)]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className="flex items-center w-full px-4 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]"
            role="menuitem"
          >
            <span className="mr-3 text-[var(--muted-foreground)]">{item.icon}</span>
            {item.defaultLabel}
          </button>
        ))}
      </div>
      <div className="py-1">
        {secondaryMenuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className="flex items-center w-full px-4 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]"
            role="menuitem"
          >
            <span className="mr-3 text-[var(--muted-foreground)]">{item.icon}</span>
            {item.defaultLabel}
          </button>
        ))}
      </div>
      <div className="py-1">
        <button
          onClick={() => { logoutItem.action(); onClose(); }}
          className="flex items-center w-full px-4 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]"
          role="menuitem"
        >
          <span className="mr-3 text-gray-500 dark:text-gray-400">{logoutItem.icon}</span>
          {logoutItem.defaultLabel}
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;