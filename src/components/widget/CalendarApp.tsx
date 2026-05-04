import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white/90">
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
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="w-8 h-8" />
          ))}
          {days.map(date => {
            const isToday = isCurrentMonth && date === today.getDate();
            return (
              <div 
                key={date} 
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors ${
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
      </div>
    </div>
  );
};

export default CalendarApp;
