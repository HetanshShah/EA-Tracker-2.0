
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, setActiveTab, children }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'linkedin', label: 'LinkedIn Post Tracker' },
    { id: 'tasks', label: 'Weekly Tasks' },
    { id: 'reports', label: 'QIR/QBR/MIR Tracker' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Enterprise Analytics Hub</h1>
            <p className="text-xs text-slate-400">Internal Operations Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user.role} | {user.subDomain}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 sticky top-[72px] z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 sm:gap-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 bg-slate-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} Enterprise Organization Tracking System. Domain-Restricted Access.
      </footer>
    </div>
  );
};

export default Layout;
