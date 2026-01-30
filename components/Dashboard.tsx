
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MetricData, AIInsight } from '../types';
import { getHealthInsights } from '../services/geminiService';

const MOCK_DATA: MetricData[] = [
  { day: 'Mon', strain: 12.4, recovery: 85, sleepScore: 92, hrv: 74 },
  { day: 'Tue', strain: 16.8, recovery: 42, sleepScore: 78, hrv: 62 },
  { day: 'Wed', strain: 14.2, recovery: 55, sleepScore: 88, hrv: 68 },
  { day: 'Thu', strain: 18.5, recovery: 38, sleepScore: 65, hrv: 55 },
  { day: 'Fri', strain: 8.4, recovery: 92, sleepScore: 98, hrv: 82 },
  { day: 'Sat', strain: 20.2, recovery: 25, sleepScore: 60, hrv: 48 },
  { day: 'Sun', strain: 4.5, recovery: 98, sleepScore: 95, hrv: 88 },
];

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const result = await getHealthInsights(MOCK_DATA);
        setInsights(result);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const latest = MOCK_DATA[MOCK_DATA.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Daily Strain" value={latest.strain.toFixed(1)} unit="/ 21" trend="Up 2.4%" color="text-indigo-400" />
        <StatCard label="Recovery" value={`${latest.recovery}%`} unit="Optimal" trend="Peak Performance" color="text-green-400" />
        <StatCard label="Sleep Score" value={`${latest.sleepScore}%`} unit="Efficiency" trend="Consistent" color="text-blue-400" />
        <StatCard label="Average HRV" value={latest.hrv.toString()} unit="ms" trend="Strong" color="text-yellow-400" />
      </div>

      {/* Primary Chart */}
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Strain vs. Recovery Correlation</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full" />
              <span className="text-xs text-zinc-400">Strain</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-zinc-400">Recovery</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={MOCK_DATA}>
            <defs>
              <linearGradient id="colorStrain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="strain" stroke="#6366f1" fillOpacity={1} fill="url(#colorStrain)" strokeWidth={2} />
            <Area type="monotone" dataKey="recovery" stroke="#22c55e" fillOpacity={1} fill="url(#colorRec)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Performance Intelligence */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-[400px]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Performance Intelligence
        </h3>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium animate-pulse">Analyzing Bio-telemetry...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {insights?.summary}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Actionable Insights</h4>
              {insights?.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 text-sm items-start">
                  <span className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-zinc-400">{rec}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase">48h Forecast</span>
                <span className="text-xs font-bold text-green-400">High Confidence</span>
              </div>
              <p className="text-sm text-indigo-400 mt-1 font-medium italic">
                "{insights?.performanceForecast}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sleep Architecture */}
      <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Sleep Consistency Index</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View Deep Sleep Analysis →</button>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
              />
              <Bar dataKey="sleepScore" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; unit: string; trend: string; color: string }> = ({ label, value, unit, trend, color }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/50 transition-colors cursor-default group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide group-hover:text-zinc-400">{label}</span>
      <span className="text-xs text-zinc-500">{trend}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-4xl font-bold tracking-tight ${color}`}>{value}</span>
      <span className="text-zinc-500 text-sm font-medium">{unit}</span>
    </div>
  </div>
);

export default Dashboard;
