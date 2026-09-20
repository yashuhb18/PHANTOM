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
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : done ? (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
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
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : done ? (
        <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>{loading ? 'Simulating Attack #2...' : done ? 'Stage 2 Executed' : 'Simulate Attack #2 (82% DNA Match)'}</span>
    </button>
  );
}
