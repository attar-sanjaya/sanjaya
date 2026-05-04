import React from 'react';
import { Brain, Network, FileText, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, isActive }) => (
  <div className="dock-item group relative px-4 py-2">
    <div className={cn(
      "p-2.5 rounded-xl transition-all duration-300",
      isActive ? "bg-cyan-500/10 text-cyan-400" : "text-white/40 group-hover:text-white/80 group-hover:bg-white/5"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[10px] font-medium tracking-wide mt-1.5 transition-all duration-300",
      isActive ? "text-cyan-400 opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
    )}>
      {label}
    </span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
    )}
  </div>
);

const Dock: React.FC = () => {
  return (
    <div className="mb-6 flex items-center gap-1 p-2 glass-morphism rounded-[24px] bg-slate-900/60 backdrop-blur-2xl border-slate-700/30">
      <DockItem 
        icon={<Brain size={24} />} 
        label="Mind" 
        isActive 
      />
      <DockItem 
        icon={<Network size={24} />} 
        label="Network" 
      />
      <DockItem 
        icon={<FileText size={24} />} 
        label="Notes" 
      />
      <DockItem 
        icon={<Calendar size={24} />} 
        label="Calendar" 
      />
    </div>
  );
};

export default Dock;
