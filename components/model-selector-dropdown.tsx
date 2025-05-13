'use client';

import React, { useState, useEffect } from 'react';
import { Check, Info, ChevronDown } from 'lucide-react';
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
}

interface ModelSelectorDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  selectedModelName: string;
  onSelectModelName: (modelName: string) => void;
  selectedProviderId: string;
  onSelectProvider: (providerId: string) => void;
  // TODO: Add actual model data source prop later
}

const CHATGPT_MODELS: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o', descriptionKey: 'modelSelector.gpt4oDesc', defaultDescription: 'Great for most tasks' },
  { id: 'o3', name: 'o3', descriptionKey: 'modelSelector.o3Desc', defaultDescription: 'Uses advanced reasoning' },
  { id: 'o4-mini', name: 'o4-mini', descriptionKey: 'modelSelector.o4MiniDesc', defaultDescription: 'Fastest at advanced reasoning' },
];

const GEMINI_MODELS: Model[] = [
  { id: 'gemini-2.5-pro', name: '2.5 Pro', descriptionKey: 'modelSelector.gemini25ProDesc', defaultDescription: 'Most capable model' },
  { id: 'gemini-2.5-flash', name: '2.5 Flash', descriptionKey: 'modelSelector.gemini25FlashDesc', defaultDescription: 'Fast and efficient' },
  { id: 'gemini-2.0-flash', name: '2.0 Flash', descriptionKey: 'modelSelector.gemini20FlashDesc', defaultDescription: 'Legacy fast model' },
];

const CLAUDE_MODELS: Model[] = [
  { id: 'claude-3.7-sonnet', name: '3.7 Sonnet', descriptionKey: 'modelSelector.claude37SonnetDesc', defaultDescription: 'Latest Sonnet model' },
  { id: 'claude-3.5-sonnet', name: '3.5 Sonnet', descriptionKey: 'modelSelector.claude35SonnetDesc', defaultDescription: 'Balanced performance' },
  { id: 'claude-3.5-haiku', name: '3.5 Haiku', descriptionKey: 'modelSelector.claude35HaikuDesc', defaultDescription: 'Fast and compact' },
];

const ModelSelectorDropdown: React.FC<ModelSelectorDropdownProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModel,
  selectedModelName,
  onSelectModelName,
  selectedProviderId,
  onSelectProvider,
}) => {
  if (!isOpen) {
    return null;
  }

  const [selectedProvider, setSelectedProvider] = useState('hosted');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [openRouterModelName, setOpenRouterModelName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedProvider(selectedProviderId || 'hosted');
      if (selectedProviderId === 'openrouter') {
        setOpenRouterModelName(selectedModelId || '');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedProviderId, selectedModelId]);

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

  const handleSelectModelFromList = (model: Model) => {
    onSelectModel(model.id);
    onSelectModelName(model.name);
    onClose();
  };

  const handleOpenRouterModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newModelName = e.target.value;
    setOpenRouterModelName(newModelName);
    onSelectModel(newModelName);
    onSelectModelName(newModelName);
  };

  const toggleProviderDropdown = () => {
    setIsProviderDropdownOpen(!isProviderDropdownOpen);
  };

  const selectProviderAction = (providerId: string) => {
    setSelectedProvider(providerId);
    onSelectProvider(providerId);

    if (providerId === 'hosted') {
      onSelectModel('');
      onSelectModelName('Hosted');
    } else if (providerId === 'openrouter') {
      onSelectModel(openRouterModelName);
      onSelectModelName(openRouterModelName);
    } else {
      let defaultModel: Model | undefined;
      if (providerId === 'chatgpt' && CHATGPT_MODELS.length > 0) defaultModel = CHATGPT_MODELS[0];
      else if (providerId === 'gemini' && GEMINI_MODELS.length > 0) defaultModel = GEMINI_MODELS[0];
      else if (providerId === 'claude' && CLAUDE_MODELS.length > 0) defaultModel = CLAUDE_MODELS[0];

      if (defaultModel) {
        onSelectModel(defaultModel.id);
        onSelectModelName(defaultModel.name);
      } else {
        onSelectModel('');
        onSelectModelName(providers.find(p => p.id === providerId)?.name || providerId);
      }
    }
    setIsProviderDropdownOpen(false);
  };

  const currentProviderDetails = providers.find(p => p.id === selectedProvider) || providers[0];

  let currentModelsToDisplay: Model[] = [];
  if (selectedProvider === 'chatgpt') {
    currentModelsToDisplay = CHATGPT_MODELS;
  } else if (selectedProvider === 'gemini') {
    currentModelsToDisplay = GEMINI_MODELS;
  } else if (selectedProvider === 'claude') {
    currentModelsToDisplay = CLAUDE_MODELS;
  }

  return (
    <div
      className="absolute top-12 left-0 mt-1 w-72 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-xl z-50 border border-[var(--gray-200)]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="model-selector-button"
    >
      {/* Header */}
      <div className="px-4 py-2 flex justify-between items-center border-[var(--gray-200)]">
        <span className="text-xs font-medium text-[var(--muted-foreground)] tracking-wider">
          Model
        </span>
        
      </div>

      {/* Provider Selector */}
      <div className="px-4 py-2 border-b border-[var(--gray-200)]">
        <div className="relative">
          <button
            onClick={toggleProviderDropdown}
            className="flex items-center justify-between w-full px-3 py-2 text-sm bg-[var(--gray-100)] hover:bg-[var(--gray-200)] rounded-md"
          >
            <div className="flex items-center space-x-2">
              <span className="text-[var(--muted-foreground)]">{currentProviderDetails.logo}</span>
              <span>{currentProviderDetails.name}</span>
            </div>
            <ChevronDown size={16} className={`text-[var(--muted-foreground)] transition-transform duration-200 ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProviderDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[var(--background)] rounded-md shadow-lg border border-[var(--gray-200)] z-10">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => selectProviderAction(provider.id)}
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

      {/* Hosted Provider Information */}
      {selectedProvider === 'hosted' && (
        <div className="px-4 py-3">
          <p className="text-xs text-[var(--muted-foreground)]">
            <Info size={12} className="inline mr-1 relative -top-px" />
            Free but limited AI. Enjoy!
          </p>
        </div>
      )}

      {/* Conditional Sections: Model List / OpenRouter Input / API Key */}
      {selectedProvider !== 'hosted' && (
        <>
          {/* Model List or OpenRouter Input */}
          <div className="py-1 max-h-60 overflow-y-auto">
            {selectedProvider === 'openrouter' ? (
              <div className="px-4 py-2">
                <label
                  htmlFor="openRouterModelInput"
                  className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5"
                >
                  Model Name (e.g., openai/gpt-4o)
                </label>
                <input
                  type="text"
                  id="openRouterModelInput"
                  name="openRouterModelInput"
                  placeholder="Enter full model name"
                  className="w-full px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--gray-200)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-foreground)] focus:border-[var(--accent-foreground)] placeholder:text-[var(--muted-foreground)]"
                  value={openRouterModelName}
                  onChange={handleOpenRouterModelChange}
                  autoComplete="off"
                />
                <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                  Specify the exact model identifier from OpenRouter.
                </p>
              </div>
            ) : (
              currentModelsToDisplay.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModelFromList(model)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left 
                      hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]
                    ${isSelected ? 'bg-[var(--accent-background)] text-[var(--accent-foreground)]' : 'text-[var(--popover-foreground)]'}`}
                    role="menuitemradio"
                    aria-checked={isSelected}
                  >
                    <div>
                      <div className={`font-medium ${isSelected ? 'text-[var(--accent-foreground)]' : 'text-[var(--popover-foreground)]'}`}>
                        {model.name}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-[var(--accent-foreground)] opacity-80' : 'text-[var(--muted-foreground)]'}`}>
                        {model.defaultDescription}
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-[var(--accent-foreground)]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* API Key Input Section */}
          <div className="px-4 py-2 border-t border-[var(--gray-200)]">
            <label
              htmlFor="apiKeyInput"
              className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5"
            >
              API Key {selectedProvider !== 'hosted' && `(${currentProviderDetails.name})`}
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
        </>
      )}
    </div>
  );
};

export default ModelSelectorDropdown;