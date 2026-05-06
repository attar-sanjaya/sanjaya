import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';

interface CalendarAppProps {
  onToggleExpand?: (expanded: boolean) => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onToggleExpand }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const toggleExpand = (date?: number) => {
    if (date !== undefined) setSelectedDate(date);
    const newState = date !== undefined ? true : !isExpanded;
    setIsExpanded(newState);
    onToggleExpand?.(newState);
  };

  const scheduleReminder = (eventTitle: string, time: string) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      // Mock scheduler: Show notification after short delay
      setTimeout(() => {
        new Notification("CORVUS", {
          body: `Reminder: ${eventTitle} at ${time}`,
          icon: '/vite.svg'
        });
      }, 3000);
    }
  };

  const handleSave = async () => {
    if (pushEnabled) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        scheduleReminder(title || "Task", startTime || "now");
      }
    }
    
    toggleExpand();
    setTitle('');
    setStartTime('');
    setEndTime('');
    setNotes('');
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel: Calendar Grid */}
      <div className={`flex flex-col p-3 relative transition-all duration-300 ${isExpanded ? 'w-1/2 border-r border-white/5' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white/90">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1.5">
            <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] mb-2 uppercase tracking-widest text-white/20 font-bold">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="w-6 h-6" />
          ))}
          {days.map(date => {
            const isToday = todayYear === year && todayMonth === month && date === todayDate;
            const isPast = year < todayYear || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && date < todayDate);
            const isSelected = selectedDate === date && isExpanded;

            return (
              <div 
                key={date} 
                onClick={() => !isPast && toggleExpand(date)}
                className={`w-7 h-7 flex items-center justify-center rounded-full mx-auto text-xs transition-all ${
                  isPast 
                    ? 'text-white/10 opacity-40 cursor-not-allowed' 
                    : isSelected
                    ? 'bg-brand text-slate-900 font-bold shadow-[0_0_12px_rgb(var(--brand-rgb)/0.6)] cursor-pointer'
                    : isToday
                    ? 'border border-brand/50 text-brand cursor-pointer hover:bg-slate-700/50'
                    : 'text-white/60 cursor-pointer hover:bg-slate-700/50'
                }`}
              >
                {date}
              </div>
            );
          })}
        </div>

        {!isExpanded && (
          <button 
            onClick={() => toggleExpand(todayDate)}
            className="absolute bottom-4 right-4 w-9 h-9 bg-brand rounded-full flex items-center justify-center text-slate-900 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.4)] hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Right Panel: Add Agenda Form - Compact UI */}
      <div className={`flex flex-col bg-slate-900/40 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="flex-1 flex flex-col p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand/80">Add Agenda</h4>
            <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-white/10 rounded-md text-white/30 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-0.5">
                <CalendarIcon size={10} className="text-white/20" />
                <span className="text-[9px] font-bold text-white/30 uppercase">Event Title</span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                className="w-full bg-transparent border-b border-white/10 px-0.5 py-1 text-xs text-white focus:outline-none focus:border-brand/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-0.5">
                  <Clock size={10} className="text-white/20" />
                  <span className="text-[9px] font-bold text-white/30 uppercase">Start</span>
                </div>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-md px-1.5 py-1 text-[10px] text-white focus:outline-none [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-0.5">
                  <Clock size={10} className="text-white/20" />
                  <span className="text-[9px] font-bold text-white/30 uppercase">End</span>
                </div>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-md px-1.5 py-1 text-[10px] text-white focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-0.5">
                <AlignLeft size={10} className="text-white/20" />
                <span className="text-[9px] font-bold text-white/30 uppercase">Notes</span>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Brief notes..."
                className="w-full bg-white/5 border border-white/5 rounded-md px-2 py-1 text-[10px] text-white focus:outline-none focus:border-brand/30 transition-all placeholder:text-white/10 resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={12} className={pushEnabled ? "text-brand" : "text-white/20"} />
                <span className="text-[10px] text-white/60">Set Push Reminder</span>
              </div>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-7 h-3.5 rounded-full p-0.5 transition-colors focus:outline-none ${pushEnabled ? 'bg-brand' : 'bg-white/10'}`}
              >
                <div className={`w-2.5 h-2.5 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="mt-3 w-full bg-brand hover:brightness-110 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition-all active:scale-95 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.3)]"
          >
            Save Agenda
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
