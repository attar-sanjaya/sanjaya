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
  position: 'bottom' | 'left';
  uiStyle: 'crystal' | 'neural' | 'clay' | 'carbon';
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, isActive, onClick, position, uiStyle }) => (

  <button onClick={onClick} className={cn(
    "dock-item group relative px-3 py-1.5 focus:outline-none flex",
    position === 'left' ? "flex-row items-center gap-3" : "flex-col items-center"
  )}>
    {isActive && (
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        <div className="w-8 h-8 bg-brand/30 blur-xl rounded-full animate-pulse transition-all duration-1000" />
      </div>
    )}

    <div className={cn(
      "p-1.5 rounded-[12px] transition-all duration-500 group-hover:scale-110 relative z-10",
      isActive
        ? "bg-brand/15 text-brand shadow-[0_0_15px_rgb(var(--brand-rgb)/0.2)] border border-brand/20"
        : "text-text-main/40 group-hover:text-text-main/90 group-hover:bg-text-main/5 border border-transparent"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-[9px] font-black uppercase tracking-[0.1em] block transition-all duration-300 font-label",
      position === 'bottom' ? "mt-1.5 text-center" : "text-left",
      isActive ? "text-brand opacity-100" : "text-text-main/30 group-hover:text-text-main/70"
    )}>
      {label}
    </span>
    {isActive && (
      <div className={cn(
        "absolute bg-brand rounded-full shadow-[0_0_8px_rgb(var(--brand-rgb)/0.8)]",
        position === 'bottom' ? "-bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5" : "left-1 top-1/2 -translate-y-1/2 w-0.5 h-3"
      )} />
    )}
  </button>
);

  activeApps: string[];
  toggleApp: (app: string) => void;
  position: 'bottom' | 'left';
  uiStyle: 'crystal' | 'neural' | 'clay' | 'carbon';
}

const Dock: React.FC<DockProps> = ({ activeApps, toggleApp, position, uiStyle }) => {

  return (
    <div className={cn(
      "flex items-end gap-1 px-3 py-1.5 transition-all duration-500",
      position === 'left' ? "flex-col items-stretch" : "mb-4",
      uiStyle === 'crystal' ? "style-crystal rounded-2xl" :
      uiStyle === 'neural' ? "style-neural rounded-2xl" :
      uiStyle === 'clay' ? "style-clay" :
      "style-carbon rounded-2xl"
    )}>
      <DockItem icon={<Globe2 size={18} strokeWidth={2} />} label="Mind" isActive={activeApps.includes('Mind')} onClick={() => toggleApp('Mind')} position={position} uiStyle={uiStyle} />
      <DockItem icon={<Share2 size={18} strokeWidth={2} />} label="Network" isActive={activeApps.includes('Network')} onClick={() => toggleApp('Network')} position={position} uiStyle={uiStyle} />
      <DockItem icon={<StickyNote size={18} strokeWidth={2} />} label="Notes" isActive={activeApps.includes('Notes')} onClick={() => toggleApp('Notes')} position={position} uiStyle={uiStyle} />
      <DockItem icon={<CalendarDays size={18} strokeWidth={2} />} label="Calendar" isActive={activeApps.includes('Calendar')} onClick={() => toggleApp('Calendar')} position={position} uiStyle={uiStyle} />
    </div>
  );
};

export default Dock;
