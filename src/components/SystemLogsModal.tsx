import { motion, AnimatePresence } from 'motion/react';
import { X, Terminal, AlertTriangle, Info, Shield, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'security';
  source: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClear: () => void;
}

export default function SystemLogsModal({ isOpen, onClose, logs, onClear }: Props) {
  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'warning': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'error': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'security': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      default: return 'text-neutral-400 border-neutral-500/20 bg-neutral-500/5';
    }
  };

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return <Info size={12} />;
      case 'warning': return <AlertTriangle size={12} />;
      case 'error': return <X size={12} />;
      case 'security': return <Shield size={12} />;
      default: return <Terminal size={12} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-[2001] overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500">
                  <Terminal size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white uppercase tracking-widest">System Event Logs</h2>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">Diagnostic Output & User Action Audit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClear}
                  className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                  title="Clear Logs"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/40 font-mono scrollbar-thin scrollbar-thumb-neutral-800">
              {logs.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-neutral-600">
                  <Terminal size={24} className="mb-2 opacity-20" />
                  <span className="text-[10px] uppercase tracking-widest">No Active Events Recorded</span>
                </div>
              ) : (
                logs.slice().reverse().map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "group p-3 rounded-xl border flex items-start gap-4 transition-all hover:bg-white/5",
                      getTypeColor(log.type)
                    )}
                  >
                    <div className="mt-0.5 opacity-60">
                      {getTypeIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">{log.source}</span>
                        <span className="text-[8px] opacity-40">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed break-words">{log.message}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-neutral-900/50 flex justify-between items-center text-[10px] font-mono text-neutral-600">
              <div className="flex items-center gap-4">
                <span>ACTIVE_STREAMS: 3</span>
                <span>DB_CONNECTED: TRUE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="uppercase tracking-widest">System Readiness Confirmed</span>
              </div>
            </div>
            
            {/* Scanline Effect */}
            <div className="scanline opacity-10" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
