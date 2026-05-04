import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, Calendar, Clock, Image as ImageIcon } from 'lucide-react';

interface TopMenuBarProps {
  onToggleBackground?: () => void;
  onToggleCalendar?: () => void;
  isCalendarOpen?: boolean;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ onToggleBackground, onToggleCalendar, isCalendarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [wifiOn, setWifiOn] = useState(true);
  const [phoneConnected, setPhoneConnected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full h-10 px-6 flex items-center justify-between glass-morphism border-t-0 border-x-0 bg-slate-900/20 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-wider text-white/90">Life OS</span>
      </div>
      
      <div className="flex items-center gap-5 text-white/60">
        {onToggleBackground && (
          <button 
            onClick={onToggleBackground}
            className="hover:text-cyan-400 cursor-pointer transition-colors focus:outline-none"
            title="Change Wallpaper"
          >
            <ImageIcon size={14} />
          </button>
        )}
        <button 
          onClick={() => setWifiOn(!wifiOn)} 
          className={`focus:outline-none transition-colors ${wifiOn ? 'text-white/80 hover:text-cyan-400' : 'text-white/30 hover:text-red-400'}`}
          title={wifiOn ? "Turn off Wi-Fi" : "Turn on Wi-Fi"}
        >
          {wifiOn ? <Wifi size={14} /> : <WifiOff size={14} />}
        </button>
        <button 
          onClick={() => setPhoneConnected(!phoneConnected)} 
          className={`focus:outline-none transition-colors ${phoneConnected ? 'text-cyan-400' : 'text-white/60 hover:text-cyan-400'}`}
          title={phoneConnected ? "Disconnect Phone" : "Connect Phone"}
        >
          <Smartphone size={14} />
        </button>
        {onToggleCalendar && (
          <button 
            onClick={onToggleCalendar} 
            className={`focus:outline-none transition-colors ${isCalendarOpen ? 'text-cyan-400' : 'text-white/60 hover:text-cyan-400'}`}
            title="Toggle Calendar"
          >
            <Calendar size={14} />
          </button>
        )}
        <div className="flex items-center gap-2 ml-1">
          <Clock size={14} />
          <span className="text-[12px] font-medium tracking-tight text-white/80">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;
