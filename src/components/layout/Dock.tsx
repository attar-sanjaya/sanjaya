import React from 'react';
import { BrainCircuit, Share2, StickyNote, CalendarDays } from 'lucide-react';

interface DockProps {
  activeApps: string[];
  toggleApp: (app: string) => void;
}

interface DockItemDef {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const DOCK_ITEMS: DockItemDef[] = [
  { id: 'Mind',     icon: <BrainCircuit size={18} strokeWidth={1.8} />, label: 'Mind' },
  { id: 'Network',  icon: <Share2 size={18} strokeWidth={1.8} />,       label: 'Network' },
  { id: 'Notes',    icon: <StickyNote size={18} strokeWidth={1.8} />,   label: 'Notes' },
  { id: 'Calendar', icon: <CalendarDays size={18} strokeWidth={1.8} />, label: 'Calendar' },
];

const Dock: React.FC<DockProps> = ({ activeApps, toggleApp }) => {
  return (
    <div className="dock-pill mb-4 pointer-events-auto">
      {DOCK_ITEMS.map(({ id, icon, label }) => {
        const isActive = activeApps.includes(id);
        return (
          <button
            key={id}
            onClick={() => toggleApp(id)}
            className={`dock-btn${isActive ? ' active' : ''}`}
            title={label}
          >
            {icon}
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {label}
            </span>
            <span className="dock-underline" />
          </button>
        );
      })}
    </div>
  );
};

export default Dock;
