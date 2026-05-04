import React from 'react';
import { X, Send } from 'lucide-react';

interface AppWindowProps {
  app: string;
  onClose: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ app, onClose }) => {
  return (
    <div className="w-[600px] h-[400px] max-w-[90vw] glass-morphism rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
      {/* Window Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
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
        ) : app === 'Calendar' ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white/90">May 2026</h3>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors">&lt;</button>
                  <button className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors">&gt;</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-white/40 font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                  <div 
                    key={date} 
                    className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors ${
                      date === 4 ? 'bg-cyan-500 text-black font-semibold' : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
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
