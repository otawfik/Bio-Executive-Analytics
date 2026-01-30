
import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
          {activeTab.replace('_', ' ')}
        </h1>
        <p className="text-lg font-semibold">User: Alex Johnson (Pro Athlete)</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-zinc-400">Wearable Syncing</span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <span className="text-sm font-bold">AJ</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
