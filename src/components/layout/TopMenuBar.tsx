import React from 'react';
import { Wifi, Smartphone, Calendar, Clock } from 'lucide-react';

const TopMenuBar: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
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
        <Wifi size={14} className="hover:text-cyan-400 cursor-pointer transition-colors" />
        <Smartphone size={14} className="hover:text-cyan-400 cursor-pointer transition-colors" />
        <Calendar size={14} className="hover:text-cyan-400 cursor-pointer transition-colors" />
        <div className="flex items-center gap-2 ml-1">
          <Clock size={14} />
          <span className="text-[12px] font-medium tracking-tight text-white/80">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;
