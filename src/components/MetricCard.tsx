import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: 'Safe' | 'Alert' | 'Warning';
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export default function MetricCard({ title, value, unit, icon, status = 'Safe', subtitle, children, className }: Props) {
  const statusColors = {
    Safe: 'text-emerald-400',
    Warning: 'text-amber-400',
    Alert: 'text-red-500',
  };

  const statusBorders = {
    Safe: 'border-emerald-500/10',
    Warning: 'border-amber-500/10',
    Alert: 'border-red-500/10',
  };

  const statusGlow = {
    Safe: 'shadow-[0_0_20px_rgba(16,185,129,0.05)]',
    Warning: 'shadow-[0_0_20px_rgba(245,158,11,0.05)]',
    Alert: 'shadow-[0_0_20px_rgba(239,68,68,0.05)]',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={cn(
        "relative p-6 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/5 transition-all duration-500 overflow-hidden group",
        statusBorders[status],
        statusGlow[status],
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.25em]">{title}</span>
          <h3 className={cn("text-3xl font-black font-sans tracking-tighter mt-2 flex items-baseline gap-1", statusColors[status])}>
            {value}
            {unit && <span className="text-[10px] uppercase font-mono opacity-40 tracking-normal">{unit}</span>}
          </h3>
        </div>
        <div className={cn("p-2.5 rounded-2xl bg-white/5 border border-white/5 transition-colors group-hover:border-white/10", statusColors[status])}>
          {icon}
        </div>
      </div>

      {subtitle && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">{subtitle}</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
             <div className={cn("w-1 h-1 rounded-full animate-pulse", 
              status === 'Safe' ? 'bg-emerald-500' : status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
            )} />
            <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-tighter">Live Monitor</span>
          </div>
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
      
      {/* Accent gradients */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
