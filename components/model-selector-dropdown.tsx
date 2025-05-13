'use client';

import React, { useState } from 'react';
import { Check, Info, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Provider {
  id: string;
  name: string;
  logo: React.ReactNode;
  selected: boolean;
}

interface Model {
  id: string;
  name: string;
  descriptionKey: string;
  defaultDescription: string;
  selected: boolean;
  disabled: boolean;
}

interface ModelSelectorDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  // TODO: Add actual model data source prop later
}

const ModelSelectorDropdown: React.FC<ModelSelectorDropdownProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModel,
}) => {
  if (!isOpen) {
    return null;
  }

  // State for selected provider
  const [selectedProvider, setSelectedProvider] = useState('hosted');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);

  // Provider data with SVG logos
  const providers: Provider[] = [
    { 
      id: 'hosted', 
      name: 'Hosted', 
      logo: (
        <Image
          src="/provider-logos/hosted-light.svg"
          alt="Hosted Logo"
          width={16}
          height={16}
          className="text-[var(--muted-foreground)]"
        />
      ),
      selected: selectedProvider === 'hosted'
    },
    { 
      id: 'chatgpt', 
      name: 'ChatGPT', 
      logo: (
        <Image
          src="/provider-logos/chatgpt-logo.svg"
          alt="ChatGPT Logo"
          width={16}
          height={16}
          className="text-[var(--muted-foreground)]"
        />
      ),
      selected: selectedProvider === 'chatgpt'
    },
    { 
      id: 'gemini', 
      name: 'Gemini', 
      logo: (
        <Image
          src="/provider-logos/gemini-logo.svg"
          alt="Gemini Logo"
          width={16}
          height={16}
          className="text-[var(--muted-foreground)]"
        />
      ),
      selected: selectedProvider === 'gemini'
    },
    { 
      id: 'claude', 
      name: 'Claude', 
      logo: (
        <Image
          src="/provider-logos/claude-logo.svg"
          alt="Claude Logo"
          width={16}
          height={16}
          className="text-[var(--muted-foreground)]"
        />
      ),
      selected: selectedProvider === 'claude'
    },
    { 
      id: 'openrouter', 
      name: 'OpenRouter', 
      logo: (
        <Image
          src="/provider-logos/openrouter-logo.svg"
          alt="OpenRouter Logo"
          width={16}
          height={16}
          className="text-[var(--muted-foreground)]"
        />
      ),
      selected: selectedProvider === 'openrouter'
    },
  ];

  // Placeholder data based on screenshot
  const models: Model[] = [
    { id: 'gpt-4o', name: 'GPT-4o', descriptionKey: 'modelSelector.gpt4oDesc', defaultDescription: 'Great for most tasks', selected: selectedModelId === 'gpt-4o', disabled: false },
    { id: 'o3', name: 'o3', descriptionKey: 'modelSelector.o3Desc', defaultDescription: 'Uses advanced reasoning', selected: selectedModelId === 'o3', disabled: true },
    { id: 'o4-mini', name: 'o4-mini', descriptionKey: 'modelSelector.o4MiniDesc', defaultDescription: 'Fastest at advanced reasoning', selected: selectedModelId === 'o4-mini', disabled: false },
    { id: 'o4-mini-high', name: 'o4-mini-high', descriptionKey: 'modelSelector.o4MiniHighDesc', defaultDescription: 'Great at coding and visual reasoning', selected: selectedModelId === 'o4-mini-high', disabled: false },
  ];

  const handleSelect = (modelId: string) => {
    onSelectModel(modelId);
    onClose();
  };

  const toggleProviderDropdown = () => {
    setIsProviderDropdownOpen(!isProviderDropdownOpen);
  };

  const selectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
    setIsProviderDropdownOpen(false);
  };

  // Find the currently selected provider
  const currentProvider = providers.find(p => p.id === selectedProvider) || providers[0];

  return (
    <div
      className="absolute top-12 left-0 mt-1 w-72 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl z-50 border border-[var(--gray-200)]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="model-selector-button" // Ensure the button triggering this has this id
    >
      {/* Header */}
      <div className="px-4 py-2 flex justify-between items-center border-[var(--gray-200)]">
        <span className="text-xs font-medium text-[var(--muted-foreground)] tracking-wider">
          Model
        </span>
        <button className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)]">
           {/* Tooltip needed for the Info icon */}
          <Info size={16} />
        </button>
      </div>

      {/* Provider Selector */}
      <div className="px-4 py-2 border-b border-[var(--gray-200)]">
        <div className="relative">
          <button 
            onClick={toggleProviderDropdown}
            className="flex items-center justify-between w-full px-3 py-2 text-sm bg-[var(--gray-100)] hover:bg-[var(--gray-200)] rounded-md"
          >
            <div className="flex items-center space-x-2">
              <span className="text-[var(--muted-foreground)]">{currentProvider.logo}</span>
              <span>{currentProvider.name}</span>
            </div>
            <ChevronDown size={16} className={`text-[var(--muted-foreground)] transition-transform duration-200 ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Provider Dropdown */}
          {isProviderDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[var(--background)] rounded-md shadow-lg border border-[var(--gray-200)] z-10">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => selectProvider(provider.id)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 text-sm text-left hover:bg-[var(--accent-background)] ${provider.selected ? 'bg-[var(--accent-background)] text-[var(--accent-foreground)]' : ''}`}
                >
                  <span className={`text-[var(--muted-foreground)] ${provider.selected ? 'text-[var(--accent-foreground)]' : ''}`}>{provider.logo}</span>
                  <span>{provider.name}</span>
                  {provider.selected && <Check size={16} className="ml-auto text-[var(--accent-foreground)]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Model List */}
      <div className="py-1">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => !model.disabled && handleSelect(model.id)}
            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
              model.disabled
                ? 'text-[var(--muted-foreground)] opacity-50 cursor-not-allowed'
                : 'hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]'
            } ${model.selected ? 'bg-[var(--accent-background)] text-[var(--accent-foreground)]' : 'text-[var(--popover-foreground)]'}`}
            role="menuitemradio"
            aria-checked={model.selected}
            disabled={model.disabled}
          >
            <div>
              <div className={`font-medium ${model.disabled ? 'text-[var(--muted-foreground)] opacity-50' : 'text-[var(--popover-foreground)]'} ${model.selected ? 'text-[var(--accent-foreground)]' : ''}`}>
                {model.name}
              </div>
              <div className={`text-xs ${model.disabled ? 'text-[var(--muted-foreground)] opacity-50' : 'text-[var(--muted-foreground)]'} ${model.selected ? 'text-[var(--accent-foreground)] opacity-80' : ''}`}>
                {model.defaultDescription}
              </div>
            </div>
            {model.selected && !model.disabled && (
              <Check size={16} className="text-[var(--accent-foreground)]" />
            )}
          </button>
        ))}
      </div>

      {/* API Key Input Section */}
      <div className="px-4 py-2 border-t border-[var(--gray-200)]">
        <label 
          htmlFor="apiKeyInput" 
          className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5"
        >
          API Key
        </label>
        <input
          type="password"
          id="apiKeyInput"
          name="apiKeyInput"
          placeholder="Enter API key"
          className="w-full px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--gray-200)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-foreground)] focus:border-[var(--accent-foreground)] placeholder:text-[var(--muted-foreground)]"
          autoComplete="off"
        />
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          <Info size={12} className="inline mr-1 relative -top-px" />
          Your API key is not stored and is only used for the current session.
        </p>
      </div>
    </div>
  );
};

export default ModelSelectorDropdown;