import React, { useState } from 'react';
import { Play, Sparkles, Loader2, CheckCircle } from 'lucide-react';

export function SimulateButton({ stage = 1, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    setDone(false);
    try {
      const endpoint = stage === 1 ? '/api/simulate/attack-1' : '/api/simulate/attack-2';
      const res = await fetch(`http://${window.location.hostname}:8001${endpoint}`, {
        method: 'POST',
      });
      const data = await res.json();
      setDone(true);
      if (onComplete) onComplete(data);
      setTimeout(() => setDone(false), 4000);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (stage === 1) {
    return (
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-black text-xs font-bold shadow-lg shadow-[#FDE047]/10 transition-all pill-button disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : done ? (
          <CheckCircle className="w-3.5 h-3.5 text-black" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current" />
        )}
        <span>{loading ? 'Simulating Attack #1...' : done ? 'Stage 1 Executed' : 'Simulate Attack #1 (RubberDucky)'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSimulate}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-lg transition-all pill-button disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
      ) : done ? (
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-black" />
      )}
      <span>{loading ? 'Simulating Attack #2...' : done ? 'Stage 2 Executed' : 'Simulate Attack #2 (82% DNA Match)'}</span>
    </button>
  );
}
