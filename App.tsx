
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import Dashboard from './components/Dashboard';
import ContentStudio from './components/ContentStudio';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header activeTab={activeTab} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === Tab.DASHBOARD && <Dashboard />}
            {activeTab === Tab.CONTENT_STUDIO && <ContentStudio />}
            {activeTab === Tab.RAW_DATA && (
              <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 text-center">
                <h2 className="text-2xl font-bold mb-4">Raw Telemetry Hub</h2>
                <p className="text-zinc-400">Deep-dive raw JSON telemetry data from wearable sensors.</p>
                <div className="mt-8 overflow-x-auto text-left">
                  <pre className="text-xs text-blue-400 bg-black p-4 rounded-lg">
                    {JSON.stringify({
                      device_id: "WHOOP_4_0_X99",
                      sample_rate: "100Hz",
                      telemetry: "HR, HRV, GSR, TEMP, 3-AXIS ACCEL"
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
