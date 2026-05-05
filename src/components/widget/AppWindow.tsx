import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import CalendarApp from './CalendarApp';
import { Rnd } from 'react-rnd';

interface AppWindowProps {
  app: string;
  onClose: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ app, onClose }) => {
  const isCalendar = app === 'Calendar';
  const defaultWidth = isCalendar ? 384 : 600;
  const defaultHeight = isCalendar ? 440 : 400;

  // Initial centering calculations
  const defaultX = typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - defaultWidth) / 2) : 100;
  const defaultY = typeof window !== 'undefined' ? Math.max(0, (window.innerHeight - defaultHeight) / 2) : 100;

  return (
    <Rnd
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      style={{ zIndex: 40 }}
      className="absolute pointer-events-auto"
    >
      <div className="w-full h-full glass-morphism rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
        {/* Window Header */}
        <div className="window-drag-handle h-10 border-b border-white/10 flex items-center justify-between px-4 bg-white/5 cursor-move shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white/80 select-none">{app}</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-6 h-6 rounded-md hover:bg-red-500/90 text-white/50 hover:text-white flex items-center justify-center transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <X size={14} />
          </button>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950/20">
          {app === 'Calendar' ? (
             <CalendarApp />
          ) : app === 'Mind' ? (
            <div className="h-full flex flex-col justify-end p-4">
              <div className="space-y-4 mb-4 flex-1 overflow-y-auto pr-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <span className="text-cyan-400 text-xs font-bold">OS</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/90">
                    Hello. I am your life operating system. How can I help you focus today?
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  placeholder="Message Mind..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/30 p-4">
              <p>{app} module is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </Rnd>
  );
};

export default AppWindow;
