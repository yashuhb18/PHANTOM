import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

export function ReplayScrubber({ totalFrames = 6, currentFrame, onChangeFrame }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeFrame((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames, onChangeFrame]);

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              onChangeFrame(0);
            }}
            title="Reset to frame 0"
            className="p-2 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#78716C]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#1C1917]">Time-Travel Attack Replay</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
          <span>FRAME: <strong className="text-indigo-600">{currentFrame + 1}</strong> / {totalFrames}</span>
        </div>
      </div>

      {/* Audio-style scrubber track */}
      <div className="relative mt-3">
        <input
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => {
            setIsPlaying(false);
            onChangeFrame(parseInt(e.target.value));
          }}
          className="w-full h-2 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#A8A29E] mt-1">
          <span>T+00:00 (Insertion)</span>
          <span>T+00:02 (Payload)</span>
          <span>T+00:04 (Decoy Trip)</span>
          <span>T+00:05 (Containment)</span>
        </div>
      </div>
    </div>
  );
}
