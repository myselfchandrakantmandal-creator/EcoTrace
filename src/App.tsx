import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Wind, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  AlertOctagon, 
  Map as MapIcon, 
  LayoutDashboard,
  Box,
  Flame,
  CloudRain,
  Settings,
  Bell,
  Menu,
  X,
  PieChart,
  History
} from 'lucide-react';
import { useRealTimeData } from './hooks/useRealTimeData';
import MetricCard from './components/MetricCard';
import RealTimeChart from './components/RealTimeChart';
import SensorMap from './components/SensorMap';
import SystemLogsModal, { LogEntry } from './components/SystemLogsModal';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-center relative overflow-hidden group">
          <Box size={20} className="text-emerald-400 z-10 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-neutral-900 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </div>
      <div>
        <h1 className="font-black font-sans text-lg tracking-tighter uppercase leading-none logo-plasma">
          EcoTrace
        </h1>
        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mt-0.5">Plasma Emission v3.0</span>
      </div>
    </div>
  );
}

function PlasmaModulus() {
  return <div className="plasma-modulus" />;
}

function Sidebar({ open, setOpen, onOpenLogs }: { open: boolean, setOpen: (v: boolean) => void, onOpenLogs: () => void }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { path: '/map', label: 'Grid Map', icon: <MapIcon size={14} /> },
    { path: '/analytics', label: 'Spectral Analytics', icon: <PieChart size={14} /> },
  ];

  return (
    <AnimatePresence>
      {(open || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 w-64 bg-black/60 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col lg:relative"
        >
          <div className="p-8 border-bottom border-white/5">
            <Logo />
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden ${
                  location.pathname === item.path 
                    ? 'text-emerald-400 bg-emerald-500/5 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] border border-emerald-500/20' 
                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-1/2 bg-emerald-500 rounded-r-full"
                  />
                )}
              </Link>
            ))}
            
            <div className="pt-6 px-4">
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest px-1">Active Nodes</span>
              <div className="mt-2 space-y-1">
                {['MQ-135', 'MQ-2', 'DHT-22'].map(node => (
                  <div key={node} className="flex items-center justify-between text-[10px] py-1 text-neutral-400">
                    <span>{node} Sentinel</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="p-6 border-t border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <span className="text-[10px] font-bold">OP</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase">Operator 07</p>
                <p className="text-[8px] text-neutral-500">Level A Clearance</p>
              </div>
            </div>
            <button 
              onClick={onOpenLogs}
              className="w-full flex items-center gap-2 px-2 py-1 text-[10px] text-neutral-500 hover:text-white transition-colors"
            >
              <Settings size={12} />
              SYSTEM CONFIG
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PageHeader({ sensorData, sidebarOpen, setSidebarOpen }: any) {
  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-neutral-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>Plant Manager</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-100 italic">Sector VII</span>
          </div>
          <p className="text-[11px] font-mono text-emerald-500 italic uppercase">Sync: Locked [PRIME]</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Operational Time</span>
          <span className="text-xs font-mono">{new Date(sensorData.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-neutral-400 hover:text-white relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </button>
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 transition-all ${
            sensorData.status === 'Safe' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-500'
          }`}>
            {sensorData.status === 'Safe' ? <ShieldCheck size={14} /> : <AlertOctagon size={14} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">{sensorData.status}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

const Dashboard = ({ sensorData, history }: any) => (
  <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Carbon Footprint" value={Math.round(sensorData.mq135.co2)} unit="ppm" icon={<Wind size={20} />} status={sensorData.mq135.co2 > 1500 ? 'Alert' : 'Safe'} subtitle="MQ-135 Core">
        <RealTimeChart data={history.slice(-20)} dataKey="mq135.co2" height={40} type="area" />
      </MetricCard>
      <MetricCard title="Thermal Index" value={sensorData.dht22.temp.toFixed(1)} unit="°C" icon={<Thermometer size={20} />} subtitle="DHT-22 Node">
        <RealTimeChart data={history.slice(-20)} dataKey="dht22.temp" color="#3b82f6" height={40} />
      </MetricCard>
      <MetricCard title="Moisture Level" value={sensorData.dht22.humidity.toFixed(0)} unit="%" icon={<Droplets size={20} />} subtitle="DHT-22 Node">
        <RealTimeChart data={history.slice(-20)} dataKey="dht22.humidity" color="#10b981" height={40} />
      </MetricCard>
      <MetricCard title="LPG / Propane" value={Math.round(sensorData.mq2.lpg)} unit="ppm" icon={<Flame size={20} />} status={sensorData.mq2.lpg > 400 ? 'Alert' : 'Safe'} subtitle="MQ-2 Node">
        <RealTimeChart data={history.slice(-20)} dataKey="mq2.lpg" color="#ef4444" height={40} type="area" />
      </MetricCard>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">Spectral Gas Analysis</h2>
          <History size={14} className="text-neutral-600" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <RealTimeChart data={history} dataKey="mq135.nh3" label="Ammonia (NH3)" height={80} type="area" color="#8b5cf6" />
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <RealTimeChart data={history} dataKey="mq135.benzene" label="Benzene" height={80} type="area" color="#ec4899" />
          </div>
        </div>
      </div>
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center">
        <ShieldCheck size={48} className="text-emerald-500 mb-4 opacity-20" />
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">Environment Integrity</h3>
        <p className="text-2xl font-mono mt-2 text-white">94% OPTIMAL</p>
        <p className="text-[10px] text-neutral-600 mt-4 uppercase">All security protocols active</p>
      </div>
    </div>
  </div>
);

const Analytics = ({ history }: any) => {
  const gases = [
    { key: 'mq135.co2', label: 'CO2', color: '#10b981' },
    { key: 'mq135.nh3', label: 'NH3', color: '#8b5cf6' },
    { key: 'mq135.benzene', label: 'Benzene', color: '#ec4899' },
    { key: 'mq135.alcohol', label: 'Alcohol', color: '#f59e0b' },
    { key: 'mq135.smoke', label: 'Smoke', color: '#6b7280' },
    { key: 'mq135.toluene', label: 'Toluene', color: '#3b82f6' },
    { key: 'mq135.acetone', label: 'Acetone', color: '#06b6d4' },
    { key: 'mq135.ch4', label: 'CH4', color: '#f97316' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-500">Spectral Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {gases.map(gas => (
          <div key={gas.key} className="glass-panel p-4 rounded-2xl">
            <RealTimeChart data={history} dataKey={gas.key} label={gas.label} height={100} type="area" color={gas.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const { sensorData, history, factories } = useRealTimeData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', source = 'KERNEL') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      source
    };
    setLogs(prev => [...prev, newLog].slice(-50)); // Keep last 50
  }, []);

  // Initial Boot Log
  useEffect(() => {
    addLog('System BIOS v3.08 initialized', 'security', 'BOOT');
    addLog('Establishing network link with JK-Industrial grid', 'info', 'NET');
    addLog('Sensor sync protocol [QUANTUM-LOCK] active', 'info', 'SYNC');
  }, [addLog]);

  // Monitor Sensor Status Alerts
  useEffect(() => {
    if (sensorData?.status === 'Alert') {
      addLog('Environmental threshold exceeded in Sector VII', 'error', 'SENSOR');
    }
  }, [sensorData?.status, addLog]);

  if (!sensorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative">
        <PlasmaModulus />
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-b-2 border-emerald-500 rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
          <span className="font-mono text-emerald-400 uppercase tracking-widest text-[10px]">Syncing EcoTrace...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-white">
      <PlasmaModulus />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onOpenLogs={() => setIsLogsModalOpen(true)} />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <PageHeader sensorData={sensorData} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-neutral-800 scroll-smooth">
          <Routes>
            <Route path="/" element={<Dashboard sensorData={sensorData} history={history} />} />
            <Route path="/map" element={<SensorMap sensorData={sensorData} factories={factories} />} />
            <Route path="/analytics" element={<Analytics history={history} />} />
          </Routes>
        </div>
      </main>

      <SystemLogsModal 
        isOpen={isLogsModalOpen} 
        onClose={() => setIsLogsModalOpen(false)} 
        logs={logs}
        onClear={() => setLogs([])}
      />
    </div>
  );
}

