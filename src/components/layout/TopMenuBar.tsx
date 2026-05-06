import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';

interface TopMenuBarProps {
  onToggleBackground?: () => void;
  onToggleCalendar?: () => void;
  isCalendarOpen?: boolean;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ onToggleBackground, onToggleCalendar, isCalendarOpen }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full h-8 px-6 flex items-center justify-between bg-surface/40 backdrop-blur-2xl border-b border-text-main/5 z-50">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-wider text-text-main/90">CORVUS</span>
      </div>
      
      <div className="flex items-center gap-5 text-text-main/60">
        {onToggleBackground && (
          <button 
            onClick={onToggleBackground}
            className="hover:text-brand cursor-pointer transition-colors focus:outline-none flex items-center gap-1.5 group"
            title="Change Wallpaper"
          >
            <ImageIcon size={14} />
          </button>
        )}
        
        {onToggleCalendar && (
          <button 
            onClick={onToggleCalendar} 
            className={`focus:outline-none transition-colors ${isCalendarOpen ? 'text-brand' : 'text-text-main/60 hover:text-brand'}`}
            title="Toggle Calendar"
          >
            <Calendar size={14} />
          </button>
        )}
        <div className="flex items-center gap-2 ml-1">
          <Clock size={14} />
          <span className="text-[12px] font-medium tracking-tight text-text-main/80">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;
