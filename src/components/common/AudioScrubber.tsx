import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface AudioScrubberProps {
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  stepLabels?: string[];
}

export const AudioScrubber: React.FC<AudioScrubberProps> = ({
  totalSteps,
  currentStep,
  onStepChange,
  stepLabels = []
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const next = currentStepRef.current + 1;
        if (next > totalSteps) {
          setIsPlaying(false);
        } else {
          onStepChange(next);
        }
      }, 1500 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSteps, onStepChange, playbackSpeed]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStepChange(Number(e.target.value));
  };

  const progressPercentage = ((currentStep - 1) / Math.max(1, totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-base-light dark:bg-base-dark border-t border-border-light dark:border-border-dark p-2 flex flex-col gap-2 rounded-b-card">
      {/* Top row: Track & handle */}
      <div className="flex items-center gap-3">
        <span className="text-meta text-secondary-light dark:text-secondary-dark font-mono text-[11px] shrink-0">
          STEP 0{currentStep} / 0{totalSteps}
        </span>

        {/* Minimal thin track & circular handle */}
        <div className="relative flex-1 flex items-center h-4 group cursor-pointer">
          {/* Base track */}
          <div className="w-full h-1 bg-border-light dark:border-border-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Scrubber input */}
          <input
            type="range"
            min={1}
            max={totalSteps}
            value={currentStep}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {/* Minimal circular handle indicator */}
          <div
            className="absolute w-3 h-3 bg-accent rounded-full pointer-events-none -translate-x-1/2 border border-white dark:border-surface-dark transition-all duration-150"
            style={{ left: `${progressPercentage}%` }}
          />
        </div>

        <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark truncate max-w-[200px]">
          {stepLabels[currentStep - 1] || `State ${currentStep}`}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onStepChange(1)}
            title="Reset replay"
            className="p-1 rounded text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            title="Step backward"
            className="p-1 rounded text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-30 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStep >= totalSteps) {
                onStepChange(1);
              }
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? 'Pause replay' : 'Play replay'}
            className="p-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep >= totalSteps}
            title="Step forward"
            className="p-1 rounded text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed multiplier pills */}
        <div className="flex items-center gap-1">
          <span className="text-meta text-secondary-light dark:text-secondary-dark text-[10px] mr-1">
            SPEED
          </span>
          {[1, 2, 4].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition-colors ${
                playbackSpeed === speed
                  ? 'bg-accent text-white font-medium'
                  : 'text-secondary-light dark:text-secondary-dark hover:bg-surface-light dark:hover:bg-surface-dark'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
