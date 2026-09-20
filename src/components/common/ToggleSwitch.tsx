import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <label className={`flex items-start justify-between gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-body font-medium text-primary-light dark:text-primary-dark">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[12px] text-secondary-light dark:text-secondary-dark leading-normal mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
      
      {/* Minimalist thin track & small circle */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none ${
          checked ? 'bg-accent' : 'bg-border-light dark:bg-border-dark'
        }`}
      >
        <span
          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform duration-150 ${
            checked ? 'translate-x-4.5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};
