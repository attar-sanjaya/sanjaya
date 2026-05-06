import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, ArrowLeft, Send } from 'lucide-react';

const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

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

  const requestNotification = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      new Notification("Life OS Reminder", {
        body: `Task: ${taskName || 'Self-Care Reminder'} set for ${taskTime || 'now'}.`,
        icon: '/vite.svg'
      });
    }
  };

  const handleAddTask = () => {
    if (taskName.trim()) {
      // For now, just show a notification as a "push paksa" demonstration
      requestNotification();
      setIsAddingTask(false);
      setTaskName('');
      setTaskTime('');
    }
  };

  if (isAddingTask) {
    return (
      <div className="h-full w-full flex flex-col p-4 animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setIsAddingTask(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h3 className="text-base font-semibold text-white/90">Add New Task</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Task Name</label>
            <input 
              type="text" 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Reminder Time</label>
            <input 
              type="time" 
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all [color-scheme:dark]"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button 
              onClick={handleAddTask}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
            >
              <Plus size={18} />
              <span>Create Task</span>
            </button>
            
            <button 
              onClick={requestNotification}
              className="w-full bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-xl flex items-center justify-center gap-2 text-xs border border-white/5 transition-all"
            >
              <Bell size={14} />
              <span>Test Push Notification</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-white/90">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-white/40 font-medium">{day}</div>
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
              className={`w-7 h-7 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors ${
                isToday 
                  ? 'bg-cyan-500 text-slate-900 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                  : 'text-white/70 hover:bg-white/15'
              }`}
            >
              {date}
            </div>
          );
        })}
      </div>

      {/* Add Task Floating Button */}
      <button 
        onClick={() => setIsAddingTask(true)}
        className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 shadow-[0_5px_15px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-all z-10"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </div>
  );
};

export default CalendarApp;
