import React from 'react';
import { Globe2, Share2, StickyNote, CalendarDays } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="dock-item group relative px-3 py-1.5 focus:outline-none">
    <div className={cn(
      "p-2 rounded-[14px] transition-all duration-300 group-hover:scale-110",
      isActive
        ? "bg-cyan-500/15 text-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
        : "text-white/50 group-hover:text-white/90 group-hover:bg-white/10"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[10px] font-medium tracking-wide mt-1 block text-center transition-colors duration-300",
      isActive ? "text-cyan-400" : "text-white/50 group-hover:text-white/80"
    )}>
      {label}
    </span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
    )}
  </button>
);

interface DockProps {
  activeApp: string | null;
  onAppChange: (app: string | null) => void;
}

const Dock: React.FC<DockProps> = ({ activeApp, onAppChange }) => {
  return (
    <div className="mb-4 flex items-end gap-1 px-3 pt-2 pb-1.5 bg-slate-900/40 backdrop-blur-3xl border border-slate-700/40 rounded-3xl shadow-2xl">
      <DockItem
        icon={<Globe2 size={24} strokeWidth={1.5} />}
        label="Mind"
        isActive={activeApp === 'Mind'}
        onClick={() => onAppChange(activeApp === 'Mind' ? null : 'Mind')}
      />
      <DockItem
        icon={<Share2 size={24} strokeWidth={1.5} />}
        label="Network"
        isActive={activeApp === 'Network'}
        onClick={() => onAppChange(activeApp === 'Network' ? null : 'Network')}
      />
      <DockItem
        icon={<StickyNote size={24} strokeWidth={1.5} />}
        label="Notes"
        isActive={activeApp === 'Notes'}
        onClick={() => onAppChange(activeApp === 'Notes' ? null : 'Notes')}
      />
      <DockItem
        icon={<CalendarDays size={24} strokeWidth={1.5} />}
        label="Calendar"
        isActive={activeApp === 'Calendar'}
        onClick={() => onAppChange(activeApp === 'Calendar' ? null : 'Calendar')}
      />
    </div>
  );
};

export default Dock;
