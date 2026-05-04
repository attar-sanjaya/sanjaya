import React from 'react';
import { X, Send } from 'lucide-react';
import CalendarApp from './CalendarApp';

interface AppWindowProps {
  app: string;
  onClose: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ app, onClose }) => {
  if (app === 'Calendar') {
    return (
      <div className="relative animate-in fade-in zoom-in duration-300">
        <CalendarApp />
      </div>
    );
  }

  return (
    <div className="w-[600px] h-[400px] max-w-[90vw] glass-morphism rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
      {/* Window Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-2 group/window-controls">
            <button 
              onClick={onClose} 
              className="w-3.5 h-3.5 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center transition-colors"
            >
              <X size={10} className="text-black opacity-0 group-hover/window-controls:opacity-100 transition-opacity" />
            </button>
            <button className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 hover:bg-yellow-500 transition-colors" />
            <button className="w-3.5 h-3.5 rounded-full bg-green-500/90 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-sm font-medium text-white/80">{app}</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {app === 'Mind' ? (
          <div className="h-full flex flex-col justify-end">
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
          <div className="h-full flex items-center justify-center text-white/30">
            <p>{app} module is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppWindow;
