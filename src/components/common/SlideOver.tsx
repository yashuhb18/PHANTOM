import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-150">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-primary-light/20 dark:bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 480px Slide-in Panel */}
      <div className="relative w-full max-w-[480px] bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border-light dark:border-border-dark">
          <div>
            <h3 className="text-section-header text-primary-light dark:text-primary-dark">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};
