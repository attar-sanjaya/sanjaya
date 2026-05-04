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
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, isActive }) => (
  <div className="dock-item group relative px-5 py-2">
    <div className={cn(
      "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110",
      isActive
        ? "bg-cyan-500/15 text-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.3)]"
        : "text-white/50 group-hover:text-white/90 group-hover:bg-white/10"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[10px] font-medium tracking-wide mt-1 block text-center",
      isActive ? "text-cyan-400" : "text-white/50 group-hover:text-white/80"
    )}>
      {label}
    </span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
    )}
  </div>
);

const Dock: React.FC = () => {
  return (
    <div className="mb-6 flex items-end gap-0 px-3 pt-3 pb-2 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/30 rounded-[28px] shadow-2xl">
      <DockItem
        icon={<Globe2 size={26} />}
        label="Mind"
        isActive
      />
      <DockItem
        icon={<Share2 size={26} />}
        label="Network"
      />
      <DockItem
        icon={<StickyNote size={26} />}
        label="Notes"
      />
      <DockItem
        icon={<CalendarDays size={26} />}
        label="Calendar"
      />
    </div>
  );
};

export default Dock;
