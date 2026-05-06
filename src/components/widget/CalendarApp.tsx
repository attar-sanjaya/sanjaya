import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';

interface CalendarAppProps {
  onToggleExpand?: (expanded: boolean) => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onToggleExpand }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggleExpand?.(newState);
  };

  const scheduleReminder = (eventTitle: string, time: string) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      // Mock scheduler: Show notification after 3 seconds for demo
      setTimeout(() => {
        new Notification("C.O.R.V.U.S. Life OS", {
          body: `Reminder: ${eventTitle} starts at ${time}`,
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
        scheduleReminder(title || "Untitled Event", startTime || "specified time");
      }
    }
    
    // In a real app, save to database here
    console.log("Agenda Saved:", { title, startTime, endTime, notes, pushEnabled });
    
    // Reset and collapse
    toggleExpand();
    setTitle('');
    setStartTime('');
    setEndTime('');
    setNotes('');
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel: Calendar Grid */}
      <div className={`flex flex-col p-4 relative transition-all duration-300 ${isExpanded ? 'w-1/2 border-r border-white/5' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-white/90">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] mb-3 uppercase tracking-tighter">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-white/30 font-bold">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="w-7 h-7" />
          ))}
          {days.map(date => {
            const isToday = isCurrentMonth && date === today.getDate();
            return (
              <div 
                key={date} 
                className={`w-7 h-7 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-all ${
                  isToday 
                    ? 'bg-cyan-500 text-slate-900 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                    : 'text-white/70 hover:bg-white/15 hover:scale-110'
                }`}
              >
                {date}
              </div>
            );
          })}
        </div>

        {/* Floating Add Button - Hidden when expanded */}
        {!isExpanded && (
          <button 
            onClick={toggleExpand}
            className="absolute bottom-4 right-4 w-9 h-9 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 shadow-[0_5px_15px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Right Panel: Add Agenda Form */}
      <div 
        className={`flex flex-col bg-slate-900/40 backdrop-blur-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'w-1/2 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10'
        }`}
      >
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/80">Add Agenda</h4>
            <button 
              onClick={toggleExpand}
              className="p-1 hover:bg-white/10 rounded-md text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {/* Event Title */}
            <div className="group">
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <CalendarIcon size={12} className="text-white/30" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Event Title</span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meeting with C.O.R.V.U.S..."
                className="w-full bg-transparent border-b border-white/10 px-1 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Clock size={12} className="text-white/30" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Start</span>
                </div>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/30 [color-scheme:dark]"
                />
              </div>
              <div className="group">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Clock size={12} className="text-white/30" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">End</span>
                </div>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/30 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="group">
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <AlignLeft size={12} className="text-white/30" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Notes</span>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Brief description..."
                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-white/10 resize-none"
              />
            </div>

            {/* Push Reminder Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={14} className={pushEnabled ? "text-cyan-400" : "text-white/20"} />
                <span className="text-xs text-white/70">Push Reminder</span>
              </div>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${pushEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${pushEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
          >
            <span>Save Agenda</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
