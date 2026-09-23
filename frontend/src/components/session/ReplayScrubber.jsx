import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

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
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-black flex items-center justify-center transition-all pill-button shadow-lg shadow-[#FDE047]/10 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              onChangeFrame(0);
            }}
            title="Reset to frame 0"
            className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white flex items-center justify-center transition-all pill-button cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white uppercase tracking-wider ml-1">Time-Travel Attack Replay</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span>FRAME: <strong className="text-[#FDE047]">{currentFrame + 1}</strong> / {totalFrames}</span>
        </div>
      </div>

      {/* Audio-style scrubber track */}
      <div className="relative mt-4">
        <input
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => {
            setIsPlaying(false);
            onChangeFrame(parseInt(e.target.value));
          }}
          className="w-full h-2 bg-neutral-900 rounded-full appearance-none cursor-pointer accent-[#FDE047]"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-2">
          <span>T+00:00 (Insertion)</span>
          <span>T+00:02 (Payload Burst)</span>
          <span>T+00:04 (Decoy Trip)</span>
          <span>T+00:05 (Autonomous Containment)</span>
        </div>
      </div>
    </div>
  );
}
