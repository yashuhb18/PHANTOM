import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('phantom2026');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Invalid credentials. (Hint: admin / phantom2026)');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <img
            src="/phantom-logo.png"
            alt="PHANTOM"
            className="h-12 w-auto object-contain mx-auto mb-3 select-none"
          />
          <h1 className="text-xl font-bold text-[#1C1917] tracking-tight">PHANTOM Platform</h1>
          <p className="text-xs text-[#78716C] mt-1">Autonomous USB Threat Hunting & Deception</p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-[#E7E5E4] rounded-2xl p-8 shadow-xs">
          <h2 className="text-sm font-semibold text-[#1C1917] mb-1">Sign in to console</h2>
          <p className="text-xs text-[#78716C] mb-6">Enter your security credentials to access live telemetry.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E7E5E4] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E7E5E4] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E7E5E4] text-center">
            <span className="text-[11px] font-mono text-[#A8A29E]">Demo credentials pre-filled: admin / phantom2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
