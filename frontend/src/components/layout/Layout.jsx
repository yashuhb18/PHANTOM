import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, currentTab, setTab }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-white">
      <Sidebar currentTab={currentTab} setTab={setTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0A0A0A]">
        <Header currentTab={currentTab} setTab={setTab} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
