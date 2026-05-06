import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import CalendarApp from './CalendarApp';

interface AppWindowProps {
  app: string;
  index: number;
  onClose: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ app, index, onClose }) => {
  const isCalendar = app === 'Calendar';
  const initialWidth = isCalendar ? 320 : 600;
  const initialHeight = isCalendar ? 360 : 400;

  // Staggered initial position
  const offset = index * 30;
  const initialX = typeof window !== 'undefined' ? Math.max(20, (window.innerWidth - initialWidth) / 2) + offset : 100 + offset;
  const initialY = typeof window !== 'undefined' ? Math.max(20, (window.innerHeight - initialHeight) / 2 - 40) + offset : 100 + offset;

  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDir(dir);
    resizeStartSize.current = {
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    } else if (isResizing && resizeDir) {
      const deltaX = e.clientX - resizeStartSize.current.x;
      const deltaY = e.clientY - resizeStartSize.current.y;

      const newSize = { ...size };
      const newPos = { ...position };

      if (resizeDir.includes('right')) newSize.width = Math.max(300, resizeStartSize.current.width + deltaX);
      if (resizeDir.includes('bottom')) newSize.height = Math.max(200, resizeStartSize.current.height + deltaY);
      
      setSize(newSize);
      setPosition(newPos);
    }
  }, [isDragging, isResizing, resizeDir, size, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDir(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 40 + index,
        transition: isDragging || isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={`flex flex-col group select-none pointer-events-auto ${isDragging ? 'scale-[1.02] shadow-[0_30px_70px_rgba(0,0,0,0.6)]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
    >
      {/* Native Resize Handles */}
      <div className="absolute inset-x-0 -top-1 h-2 cursor-ns-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'top')} />
      <div className="absolute inset-x-0 -bottom-1 h-2 cursor-ns-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'bottom')} />
      <div className="absolute inset-y-0 -left-1 w-2 cursor-ew-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'left')} />
      <div className="absolute inset-y-0 -right-1 w-2 cursor-ew-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'right')} />
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'bottomright')} />

      <div className="w-full h-full glass-morphism rounded-xl flex flex-col overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
        {/* Window Header */}
        <div 
          onMouseDown={handleMouseDown}
          className="h-9 border-b border-white/5 flex items-center justify-between px-3 bg-white/5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors shrink-0 group/header"
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isDragging ? 'bg-brand' : 'bg-white/20 group-hover/header:bg-brand/50'}`} />
            <span className="text-[11px] font-semibold tracking-wider text-white/60 uppercase select-none">{app}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-6 h-6 rounded-md hover:bg-red-500/80 text-white/40 hover:text-white flex items-center justify-center transition-all active:scale-90"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-y-auto bg-black/20 pointer-events-auto">
          {app === 'Calendar' ? (
             <CalendarApp 
               onToggleExpand={(expanded) => {
                 setSize(prev => ({ 
                   ...prev, 
                   width: expanded ? 640 : 320 
                 }));
               }} 
             />
          ) : app === 'Mind' ? (
            <div className="h-full flex flex-col justify-end p-4">
              <div className="space-y-4 mb-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 border border-brand/20">
                    <span className="text-brand text-xs font-bold">OS</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80 border border-white/5">
                    Hello. I am CORVUS. How can I help you focus today?
                  </div>
                </div>
              </div>
              
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  placeholder="Message CORVUS..." 
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-brand/30 transition-all placeholder:text-white/20"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-brand transition-colors rounded-lg">
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/20 p-4">
              <p className="text-xs tracking-widest uppercase">{app} module empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppWindow;
