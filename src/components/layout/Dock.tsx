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
    {/* Aurora UI Underglow for Active Icon */}
    {isActive && (
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <div className="w-8 h-8 bg-brand/30 blur-xl rounded-full animate-pulse transition-all duration-1000" />
      </div>
    )}

    <div className={cn(
      "p-1.5 rounded-[12px] transition-all duration-500 group-hover:scale-110 relative z-10",
      isActive
        ? "bg-brand/15 text-brand shadow-[0_0_15px_rgb(var(--brand-rgb)/0.2)] border border-brand/20"
        : "text-white/40 group-hover:text-white/90 group-hover:bg-white/5 border border-transparent"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[9px] font-black uppercase tracking-[0.1em] mt-1.5 block text-center transition-all duration-300",
      isActive ? "text-brand opacity-100" : "text-white/20 group-hover:text-white/60"
    )}>
      {label}
    </span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-brand rounded-full shadow-[0_0_8px_rgb(var(--brand-rgb)/0.8)]" />
    )}
  </button>
);

interface DockProps {
  activeApps: string[];
  toggleApp: (app: string) => void;
}

const Dock: React.FC<DockProps> = ({ activeApps, toggleApp }) => {
  return (
    <div className="mb-4 flex items-end gap-1 px-3 pt-1.5 pb-1 bg-slate-950/40 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl">
      <DockItem
        icon={<Globe2 size={18} strokeWidth={1.5} />}
        label="Mind"
        isActive={activeApps.includes('Mind')}
        onClick={() => toggleApp('Mind')}
      />
      <DockItem
        icon={<Share2 size={18} strokeWidth={1.5} />}
        label="Network"
        isActive={activeApps.includes('Network')}
        onClick={() => toggleApp('Network')}
      />
      <DockItem
        icon={<StickyNote size={18} strokeWidth={1.5} />}
        label="Notes"
        isActive={activeApps.includes('Notes')}
        onClick={() => toggleApp('Notes')}
      />
      <DockItem
        icon={<CalendarDays size={18} strokeWidth={1.5} />}
        label="Calendar"
        isActive={activeApps.includes('Calendar')}
        onClick={() => toggleApp('Calendar')}
      />
    </div>
  );
};

export default Dock;
