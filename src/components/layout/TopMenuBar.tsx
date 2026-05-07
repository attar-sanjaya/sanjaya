import React, { useState, useEffect } from 'react';
import { Clock, Image as ImageIcon } from 'lucide-react';

interface TopMenuBarProps {
  onToggleBackground?: () => void;
  onToggleCalendar?: () => void;
  isCalendarOpen?: boolean;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ onToggleBackground }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div
      style={{
        background: 'rgba(10, 14, 26, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100,
      }}
      className="w-full h-8 px-5 flex items-center justify-between shrink-0"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-brand)', boxShadow: '0 0 8px var(--c-brand-glow)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase' }}>
          CORVUS
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4" style={{ color: 'rgba(220,230,255,0.5)' }}>
        {onToggleBackground && (
          <button
            onClick={onToggleBackground}
            title="Change Wallpaper"
            style={{ transition: 'color 200ms ease', padding: '2px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-brand)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(220,230,255,0.5)')}
          >
            <ImageIcon size={13} strokeWidth={2} />
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <Clock size={12} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(220,230,255,0.8)' }}>
            {formattedTime}
          </span>
          <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 4 }}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;
