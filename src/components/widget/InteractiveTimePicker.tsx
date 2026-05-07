import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

interface InteractiveTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const InteractiveTimePicker: React.FC<InteractiveTimePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateTime = (newHour: string, newMinute: string) => {
    onChange(`${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`);
  };

  const adjustHour = (delta: number) => {
    let h = parseInt(hour) + delta;
    if (h > 23) h = 0;
    if (h < 0) h = 23;
    const hStr = h.toString().padStart(2, '0');
    setHour(hStr);
    updateTime(hStr, minute);
  };

  const adjustMinute = (delta: number) => {
    let m = parseInt(minute) + delta;
    if (m > 59) m = 0;
    if (m < 0) m = 59;
    const mStr = m.toString().padStart(2, '0');
    setMinute(mStr);
    updateTime(hour, mStr);
  };

  return (
    <div className="space-y-0.5 relative" ref={containerRef}>
      <div className="flex items-center gap-1 px-0.5">
        <Clock size={8} className="text-brand/40" />
        <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label">{label}</span>
      </div>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full bg-text-main/5 border rounded-md px-2 py-1.5 cursor-pointer transition-all
          ${isOpen ? 'border-brand/50 bg-brand/5' : 'border-text-main/5 hover:border-text-main/20'}
        `}
      >
        <div className="flex items-baseline gap-0.5">
          <span className="text-[11px] font-black font-mono text-text-main tracking-wider">{hour}</span>
          <span className="text-[10px] font-black font-mono text-text-main/30">:</span>
          <span className="text-[11px] font-black font-mono text-text-main tracking-wider">{minute}</span>
        </div>
        <div className="flex flex-col gap-0.5 opacity-20">
          <ChevronUp size={8} strokeWidth={4} />
          <ChevronDown size={8} strokeWidth={4} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-surface/90 backdrop-blur-2xl border border-brand/20 rounded-lg p-2 z-50 shadow-2xl animate-ui-pop">
          <div className="grid grid-cols-2 gap-2">
            {/* Hour Picker */}
            <div className="flex flex-col items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); adjustHour(1); }}
                className="w-full py-1 flex justify-center hover:bg-brand/10 rounded transition-colors text-brand/60"
              >
                <ChevronUp size={12} />
              </button>
              <div className="text-[14px] font-black font-mono text-brand py-1">{hour}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); adjustHour(-1); }}
                className="w-full py-1 flex justify-center hover:bg-brand/10 rounded transition-colors text-brand/60"
              >
                <ChevronDown size={12} />
              </button>
              <span className="text-[6px] uppercase font-black tracking-widest text-text-main/20 mt-1">HRS</span>
            </div>

            {/* Minute Picker */}
            <div className="flex flex-col items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); adjustMinute(5); }}
                className="w-full py-1 flex justify-center hover:bg-brand/10 rounded transition-colors text-brand/60"
              >
                <ChevronUp size={12} />
              </button>
              <div className="text-[14px] font-black font-mono text-brand py-1">{minute}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); adjustMinute(-5); }}
                className="w-full py-1 flex justify-center hover:bg-brand/10 rounded transition-colors text-brand/60"
              >
                <ChevronDown size={12} />
              </button>
              <span className="text-[6px] uppercase font-black tracking-widest text-text-main/20 mt-1">MIN</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-text-main/5">
            {['09:00', '12:00', '15:00', '18:00'].map(t => (
              <button
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(t);
                  setIsOpen(false);
                }}
                className="text-[7px] font-black font-mono text-text-main/40 hover:text-brand hover:bg-brand/10 rounded py-1 transition-all border border-transparent hover:border-brand/20"
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="w-full mt-2 bg-brand/10 hover:bg-brand/20 text-brand text-[8px] font-black py-1 rounded transition-all uppercase tracking-widest"
          >
            Set Time
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveTimePicker;
