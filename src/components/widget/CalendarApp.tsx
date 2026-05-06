import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';

interface CalendarAppProps {
  onToggleExpand?: (expanded: boolean) => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onToggleExpand }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsLoading(false);
    toggleExpand();
    setTitle('');
    setStartTime('');
    setEndTime('');
    setNotes('');
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel */}
      <div className={`flex flex-col p-3 relative transition-all duration-300 ${isExpanded ? 'w-1/2 border-r border-text-main/5' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-main/80">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 text-center text-[8px] mb-2 uppercase tracking-widest text-text-main/20 font-black">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
          {blanks.map(blank => <div key={`blank-${blank}`} className="w-7 h-7" />)}
          {days.map(date => {
            const isToday = todayYear === year && todayMonth === month && date === todayDate;
            const isPast = year < todayYear || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && date < todayDate);
            const isSelected = selectedDate === date && isExpanded;

            return (
              <div 
                key={date} 
                onClick={() => !isPast && toggleExpand(date)}
                className={`w-7 h-7 flex items-center justify-center rounded-full mx-auto text-[11px] transition-all relative ${
                  isPast 
                    ? 'text-text-main/10 opacity-30 cursor-not-allowed' 
                    : isSelected
                    ? 'bg-brand text-slate-950 font-bold shadow-[0_0_15px_rgb(var(--brand-rgb)/0.8)] cursor-pointer scale-110'
                    : isToday
                    ? 'border border-brand/40 text-brand font-bold cursor-pointer hover:bg-brand/10'
                    : 'text-text-main/50 cursor-pointer hover:bg-text-main/5'
                }`}
              >
                {date}
                {isToday && !isSelected && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-brand rounded-full" />}
              </div>
            );
          })}
        </div>

        {!isExpanded && (
          <button 
            onClick={() => toggleExpand(todayDate)}
            className="absolute bottom-4 right-4 w-9 h-9 bg-brand rounded-full flex items-center justify-center text-slate-950 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.3)] hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.8)] hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Right Panel */}
      <div className={`flex flex-col bg-surface/20 backdrop-blur-3xl transition-all duration-300 overflow-hidden border-l border-text-main/5 ${isExpanded ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="flex-1 flex flex-col p-3">
          <div className="flex items-center justify-between mb-4 px-1">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand/90">Initialize_Event</h4>
            <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
              <X size={12} />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-0.5">
                <CalendarIcon size={10} className="text-brand/40" />
                <span className="text-[8px] font-black text-text-main/20 uppercase tracking-widest">Header</span>
              </div>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ENTRY_TITLE..."
                className="w-full bg-text-main/5 border border-text-main/5 rounded-lg px-2 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand/40 transition-all font-mono placeholder:text-text-main/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-0.5">
                  <Clock size={10} className="text-brand/40" />
                  <span className="text-[8px] font-black text-text-main/20 uppercase tracking-widest">Start</span>
                </div>
                <input 
                  type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-text-main/5 border border-text-main/5 rounded-lg px-2 py-1.5 text-[10px] text-text-main focus:outline-none focus:border-brand/40 [color-scheme:dark] font-mono"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-0.5">
                  <Clock size={10} className="text-brand/40" />
                  <span className="text-[8px] font-black text-text-main/20 uppercase tracking-widest">End</span>
                </div>
                <input 
                  type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-text-main/5 border border-text-main/5 rounded-lg px-2 py-1.5 text-[10px] text-text-main focus:outline-none focus:border-brand/40 [color-scheme:dark] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-0.5">
                <AlignLeft size={10} className="text-brand/40" />
                <span className="text-[8px] font-black text-text-main/20 uppercase tracking-widest">Description</span>
              </div>
              <textarea 
                value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="METADATA..."
                className="w-full bg-text-main/5 border border-text-main/5 rounded-lg px-2 py-1.5 text-[10px] text-text-main focus:outline-none focus:border-brand/40 transition-all font-mono placeholder:text-text-main/10 resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-text-main/5 rounded-lg border border-text-main/5">
              <div className="flex items-center gap-2">
                <Bell size={12} className={pushEnabled ? "text-brand animate-pulse" : "text-text-main/10"} />
                <span className="text-[9px] font-bold text-text-main/40 uppercase tracking-tight">Push_Reminder</span>
              </div>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-7 h-3.5 rounded-full p-0.5 transition-colors focus:outline-none ${pushEnabled ? 'bg-brand' : 'bg-text-main/10'}`}
              >
                <div className={`w-2.5 h-2.5 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave} disabled={isLoading}
            className="mt-4 w-full bg-brand text-slate-950 font-black py-2 rounded-lg text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.3)] hover:shadow-[0_0_20px_rgb(var(--brand-rgb)/0.6)]"
          >
            {isLoading ? <span className="animate-pulse font-mono">[SAVING_DATA...]</span> : <span>Save_Agenda</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
