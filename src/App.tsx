import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { DeceptionTrapsPage } from './pages/DeceptionTrapsPage';
import { AlertsPage } from './pages/AlertsPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>('landing');
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handlePrimaryAction = () => {
    switch (currentPage) {
      case 'dashboard':
        alert('Exporting cluster telemetry (RFC-5424 + eBPF streams)...');
        break;
      case 'live-monitor':
        break;
      case 'session-detail':
        alert('Host prod-k8s-worker-09 successfully isolated via eBPF firewall rule.');
        break;
      case 'threat-intel':
        alert('Synchronized with MITRE ATT&CK and external threat intelligence feeds.');
        break;
      case 'deception-traps':
        break;
      case 'alerts':
        alert('Autonomous containment confirmed for all critical alerts.');
        break;
      case 'incident-reports':
        window.print();
        break;
      case 'settings':
        alert('Autonomous policies saved and synchronized across fleet.');
        break;
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateToSession={() => setCurrentPage('session-detail')}
            onNavigateToMonitor={() => setCurrentPage('live-monitor')}
          />
        );
      case 'live-monitor':
        return <LiveMonitorPage />;
      case 'session-detail':
        return <SessionDetailPage />;
      case 'threat-intel':
        return <ThreatIntelPage />;
      case 'deception-traps':
        return <DeceptionTrapsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'incident-reports':
        return <IncidentReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // If in Landing Page view
  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchConsole={() => setCurrentView('console')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  // If in Console Dashboard view
  return (
    <div className="min-h-screen bg-base-light dark:bg-base-dark text-primary-light dark:text-primary-dark font-sans flex flex-col">
      {/* Fixed Sidebar (260px or 72px) */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header Zone (64px) */}
        <Header
          currentPage={currentPage}
          collapsed={sidebarCollapsed}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onPrimaryAction={handlePrimaryAction}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBackToLanding={() => setCurrentView('landing')}
        />

        {/* Page Content: max-w-[1440px], centered, 32px side padding on desktop, 16px on mobile */}
        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
          }`}
        >
          <div className="max-w-page mx-auto px-2 sm:px-4 py-4 transition-opacity duration-150 ease-out">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
