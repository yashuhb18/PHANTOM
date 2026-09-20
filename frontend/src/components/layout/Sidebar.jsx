import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  GitCommit, 
  Dna, 
  ShieldAlert, 
  Flame, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar({ currentTab, setTab }) {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitor', icon: Activity, badge: 'LIVE' },
    { id: 'sessions', label: 'Session Detail', icon: GitCommit },
    { id: 'threat-intel', label: 'Threat Intel & DNA', icon: Dna },
    { id: 'deception', label: 'Deception Traps', icon: Flame },
    { id: 'alerts', label: 'Alerts & Actions', icon: ShieldAlert },
    { id: 'reports', label: 'Incident Reports', icon: FileText },
    { id: 'settings', label: 'Hardware Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E7E5E4] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[#E7E5E4] gap-3">
          <img 
            src="/logo.png" 
            alt="PHANTOM" 
            className="w-8 h-8 rounded-lg object-contain bg-black p-0.5 shadow-sm" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#1C1917]">PHANTOM</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#78716C]">Autonomous Threat Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-900 font-semibold'
                    : 'text-[#78716C] hover:bg-[#F5F5F4] hover:text-[#1C1917]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-[#A8A29E]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-[#E7E5E4]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-[#1C1917] truncate">{user?.username || 'Analyst'}</p>
              <p className="text-[10px] text-[#78716C] truncate">{user?.role || 'Security Team'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Sign out"
            className="p-1 text-[#A8A29E] hover:text-[#1C1917] transition-colors rounded hover:bg-white"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
