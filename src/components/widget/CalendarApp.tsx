import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';

interface CalendarAppProps {
  onToggleExpand?: (expanded: boolean) => void;
  activeEvent?: any;
  calendarEvents?: any[];
  onAddEvent?: (eventData: any) => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onToggleExpand, activeEvent, calendarEvents = [], onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'agenda'>('form');
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (activeEvent) {
      if (activeEvent.date) {
        // Date comes in as YYYY-MM-DD
        const [y, m, d] = activeEvent.date.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        setCurrentDate(dateObj);
        setSelectedDate(dateObj.getDate());
      }

      // Jika event dibuat oleh AI (isAiGenerated = true),
      // langsung buka agenda view — event sudah tersimpan, jangan isi form lagi
      if (activeEvent.isAiGenerated) {
        setIsExpanded(true);
        setViewMode('agenda');
        onToggleExpand?.(true);
        return;
      }

      // Mode manual (user klik + form): isi form seperti biasa
      if (activeEvent.title) setTitle(activeEvent.title);
      if (activeEvent.time) setStartTime(activeEvent.time);
      if (activeEvent.reminderTime) {
        setPushEnabled(true);
        setReminderTime(activeEvent.reminderTime);
      }
      
      setIsExpanded(true);
      setViewMode('form');
      onToggleExpand?.(true);
    }
  }, [activeEvent]);

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

  const getEventsForDate = (dateNum: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
    return calendarEvents.filter(ev => ev.date === formattedDate);
  };

  const toggleExpand = (date?: number, forceForm?: boolean) => {
    if (date !== undefined) {
      setSelectedDate(date);
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0 && !forceForm) {
        setViewMode('agenda');
      } else {
        setViewMode('form');
      }
    }
    const newState = date !== undefined ? true : !isExpanded;
    setIsExpanded(newState);
    onToggleExpand?.(newState);
  };

  const handleSave = async () => {
    if (!title || selectedDate === null) return;
    
    setIsLoading(true);
    
    // Format date as YYYY-MM-DD
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    
    onAddEvent?.({
      title,
      date: formattedDate,
      time: startTime,
      notes,
      reminderTime: pushEnabled ? reminderTime : undefined
    });

    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate saving
    
    setIsLoading(false);
    setTitle(''); setStartTime(''); setEndTime(''); setNotes(''); setPushEnabled(false); setReminderTime('');
    
    // Switch to agenda view to show the newly added event
    setViewMode('agenda');
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel: Calendar Grid */}
      <div className={`flex flex-col p-2.5 relative transition-all duration-300 ${isExpanded ? 'w-1/2 border-r border-text-main/5' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-2.5 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/80 font-display">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
              <ChevronLeft size={12} />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-[7px] mb-1.5 uppercase tracking-widest text-text-main/20 font-black">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5 text-center">
          {blanks.map(blank => <div key={`blank-${blank}`} className="w-7 h-7" />)}
          {days.map(date => {
            const isToday = todayYear === year && todayMonth === month && date === todayDate;
            const isPast = year < todayYear || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && date < todayDate);
            const isSelected = selectedDate === date && isExpanded;
            const hasEvents = getEventsForDate(date).length > 0;

            return (
              <div 
                key={date} 
                onClick={() => !isPast && toggleExpand(date)}
                className={`w-7 h-7 flex items-center justify-center rounded-full mx-auto text-[10px] transition-all relative ${
                  isPast 
                    ? 'text-text-main/10 opacity-30 cursor-not-allowed' 
                    : isSelected
                    ? 'bg-brand text-slate-950 font-black shadow-[0_0_15px_rgb(var(--brand-rgb)/0.8)] cursor-pointer scale-105'
                    : isToday
                    ? 'border border-brand/40 text-brand font-black cursor-pointer hover:bg-brand/10 hover:font-black'
                    : 'text-text-main/50 cursor-pointer hover:bg-text-main/5 hover:text-text-main hover:font-black'
                }`}
              >
                {date}
                {hasEvents && !isSelected && <div className="absolute top-1 right-1 w-1 h-1 bg-brand rounded-full shadow-[0_0_5px_rgb(var(--brand-rgb))]" />}
                {isToday && !isSelected && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-brand rounded-full" />}
              </div>
            );
          })}
        </div>

        {!isExpanded && (
          <button 
            onClick={() => toggleExpand(todayDate, true)}
            className="absolute bottom-3 right-3 w-8 h-8 bg-brand rounded-full flex items-center justify-center text-slate-950 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.3)] hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.8)] hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Plus size={16} strokeWidth={4} />
          </button>
        )}
      </div>

      {/* Right Panel: Form / Agenda - ULTRA COMPACT */}
      <div className={`flex flex-col bg-surface/10 backdrop-blur-3xl transition-all duration-300 overflow-hidden border-l border-text-main/5 ${isExpanded ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="flex-1 flex flex-col p-2.5">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-brand/90 font-display">
              {viewMode === 'form' ? 'Initialize_Event' : `Agenda: ${selectedDate} ${monthNames[month]}`}
            </h4>
            <div className="flex gap-1">
              {viewMode === 'agenda' && (
                <button onClick={() => setViewMode('form')} className="p-0.5 hover:bg-text-main/5 rounded text-brand hover:text-brand transition-colors" title="Add Event">
                  <Plus size={12} strokeWidth={3} />
                </button>
              )}
              <button onClick={() => setIsExpanded(false)} className="p-0.5 hover:bg-text-main/5 rounded text-text-main/20 hover:text-text-main transition-colors">
                <X size={12} />
              </button>
            </div>
          </div>

          {viewMode === 'agenda' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 space-y-2">
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((ev, idx) => (
                  <div key={ev.id || idx} className="bg-text-main/5 border border-text-main/10 rounded-md p-2 flex flex-col gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-text-main font-display leading-tight">{ev.title}</span>
                      {ev.time && <span className="text-[8px] text-brand font-mono bg-brand/10 px-1 py-0.5 rounded border border-brand/20">{ev.time}</span>}
                    </div>
                    {ev.notes && <p className="text-[8px] text-text-main/60 font-label leading-relaxed">{ev.notes}</p>}
                    {ev.reminderTime && (
                      <div className="flex items-center gap-1 mt-1 text-brand/80">
                        <Bell size={8} className="animate-pulse" />
                        <span className="text-[7px] uppercase tracking-widest font-black">Reminder: {ev.reminderTime}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-main/20 gap-2">
                  <CalendarIcon size={16} className="opacity-50" />
                  <span className="text-[8px] uppercase tracking-widest font-black font-label text-center">No Events Scheduled</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-0.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 px-0.5">
                    <CalendarIcon size={8} className="text-brand/40" />
                    <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label">Header</span>
                  </div>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ENTRY_TITLE..."
                    className="w-full bg-text-main/5 border border-text-main/5 rounded-md px-2 py-1 text-[10px] text-text-main font-black font-mono placeholder:text-text-main/5 focus:outline-none focus:border-brand/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 px-0.5">
                      <Clock size={8} className="text-brand/40" />
                      <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label">Start</span>
                    </div>
                    <input 
                      type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-text-main/5 border border-text-main/5 rounded-md px-1.5 py-0.5 text-[9px] text-text-main focus:outline-none focus:border-brand/40 [color-scheme:dark] font-black font-mono"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 px-0.5">
                      <Clock size={8} className="text-brand/40" />
                      <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label">End</span>
                    </div>
                    <input 
                      type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-text-main/5 border border-text-main/5 rounded-md px-1.5 py-0.5 text-[9px] text-text-main focus:outline-none focus:border-brand/40 [color-scheme:dark] font-black font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 px-0.5">
                    <AlignLeft size={8} className="text-brand/40" />
                    <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label">Description</span>
                  </div>
                  <textarea 
                    value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="METADATA..."
                    className="w-full bg-text-main/5 border border-text-main/5 rounded-md px-2 py-1 text-[9px] text-text-main font-black font-mono placeholder:text-text-main/5 focus:outline-none focus:border-brand/40 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 p-2 bg-text-main/5 rounded-md border border-text-main/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={10} className={pushEnabled ? "text-brand animate-pulse" : "text-text-main/10"} />
                      <span className="text-[8px] font-black text-text-main/30 uppercase tracking-tighter font-label">Push_Reminder</span>
                    </div>
                    <button 
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`w-6 h-3 rounded-full p-0.5 transition-colors focus:outline-none ${pushEnabled ? 'bg-brand' : 'bg-text-main/10'}`}
                    >
                      <div className={`w-2 h-2 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-2.5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {pushEnabled && (
                    <div className="flex items-center gap-2 mt-0.5 border-t border-text-main/5 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Clock size={8} className="text-brand/40" />
                      <span className="text-[7px] font-black text-text-main/20 uppercase tracking-widest font-label w-8">Time</span>
                      <input 
                        type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
                        className="flex-1 bg-text-main/5 border border-text-main/5 rounded px-1.5 py-0.5 text-[9px] text-brand focus:outline-none focus:border-brand/40 [color-scheme:dark] font-black font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSave} disabled={isLoading}
                className="mt-2 w-full bg-brand text-slate-950 font-black py-1.5 rounded-md text-[9px] uppercase tracking-widest transition-all active:scale-95 shadow-[0_5px_15px_rgb(var(--brand-rgb)/0.3)] hover:shadow-[0_0_20px_rgb(var(--brand-rgb)/0.6)]"
              >
                {isLoading ? <span className="animate-pulse font-mono">[SAVING...]</span> : <span>Save_Agenda</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
