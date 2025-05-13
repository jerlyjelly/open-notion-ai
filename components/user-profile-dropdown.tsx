'use client';

import React, { useState } from 'react';
import {
  Zap,
  Settings,
  Keyboard,
  HelpCircle,
  FileText,
  ShieldCheck,
  Mail
} from 'lucide-react';
import SettingsModal from './settings-modal';
import { useAuth } from '@/components/auth/auth-provider';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  if (!isOpen && !isSettingsModalOpen) {
    return null;
  }

  const handleOpenSettingsModal = () => {
    onClose();
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const menuItems = [
    {
      icon: <Zap size={18} />,
      labelKey: 'userDropdown.upgradePlan',
      defaultLabel: 'Upgrade Plan',
      action: () => console.log('Upgrade Plan clicked'),
    },
    {
      icon: <Settings size={18} />,
      labelKey: 'userDropdown.settings',
      defaultLabel: 'Settings',
      action: handleOpenSettingsModal,
    },
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
  ];

  return (
    <>
      {isOpen && (
        <div
          className="absolute top-12 right-0 mt-2 w-64 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl z-50 border border-[var(--gray-200)]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {user?.email && (
            <div className="px-4 py-3 border-b border-[var(--gray-200)]">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-[var(--muted-foreground)]" />
                <p className="text-sm font-medium text-[var(--popover-foreground)] truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => { 
                  item.action(); 
                  if (item.labelKey !== 'userDropdown.settings') { 
                    onClose(); 
                  }
                }}
                className={`flex items-center w-full px-4 py-2 text-sm text-left 
                            text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)] cursor-pointer
                          `}
                role="menuitem"
              >
                <span className={`mr-3 text-[var(--muted-foreground)]`}>{item.icon}</span>
                {item.defaultLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      <SettingsModal isOpen={isSettingsModalOpen} onClose={handleCloseSettingsModal} />
    </>
  );
};

export default UserProfileDropdown;