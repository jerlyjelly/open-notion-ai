'use client';

import React from 'react';
import { Check, Info, ChevronRight } from 'lucide-react';




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

  return (
    <div
      className="absolute top-12 left-0 mt-1 w-72 bg-[var(--popover-background)] text-[var(--popover-foreground)] rounded-md shadow-xl z-50 border border-[var(--gray-200)]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="model-selector-button" // Ensure the button triggering this has this id
    >
      {/* Header */}
      <div className="px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-medium text-[var(--muted-foreground)] tracking-wider">
          Model
        </span>
        <button className="text-[var(--muted-foreground)] hover:text-[var(--popover-foreground)]">
           {/* Tooltip needed for the Info icon */}
          <Info size={16} />
        </button>
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

      {/* Footer Link */}
      <div className="py-1">
        <button
          onClick={() => { /* TODO: Handle More Models click */ console.log('More models clicked'); onClose(); }}
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent-background)] hover:text-[var(--accent-foreground)]"
          role="menuitem"
        >
          <span>More models</span>
          <ChevronRight size={16} className="text-[var(--muted-foreground)]" />
        </button>
      </div>
    </div>
  );
};

export default ModelSelectorDropdown;