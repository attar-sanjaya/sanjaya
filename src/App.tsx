import React, { useState, useEffect, useCallback } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  { 
    url: '/chan-hoi-uj-w-v7OFT4-unsplash.jpg', 
    photographer: 'Chan Hoi',
    palette: { brand: '0 229 255', surface: '10 28 61', text: '240 240 240' }
  },
  { 
    url: '/harry-kessell-eE2trMn-6a0-unsplash.jpg', 
    photographer: 'Harry Kessell',
    palette: { brand: '255 159 28', surface: '78 74 70', text: '255 255 255' }
  },
  { 
    url: '/pukpik-aB46yUmsMp0-unsplash.jpg', 
    photographer: 'Pukpik',
    palette: { brand: '244 168 172', surface: '242 232 228', text: '58 58 58' }
  }
];

const App: React.FC = () => {
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  const currentBg = BACKGROUNDS[bgIndex];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-rgb', currentBg.palette.brand);
    root.style.setProperty('--surface-rgb', currentBg.palette.surface);
    root.style.setProperty('--text-rgb', currentBg.palette.text);
  }, [currentBg.palette]);

  const toggleBackground = () => setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);

  const toggleApp = useCallback((app: string, forceOpen?: boolean) => {
    setActiveApps((prev) => {
      if (forceOpen) {
        return prev.includes(app) ? prev : [...prev, app];
      }
      return prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app];
    });
  }, []);

  const addManualEvent = useCallback((eventData: any) => {
    setCalendarEvents(prev => [...prev, { id: Date.now(), ...eventData }]);
  }, []);

  // Execution Hub for AI Actions
  const executeAiAction = useCallback((action: { command: string; payload: any }) => {
    console.log('[CORVUS_EXECUTION_HUB]: Received Command', action);
    
    switch (action.command) {
      case 'OPEN_WINDOW':
        if (action.payload.windowName === 'CALENDAR') {
          toggleApp('Calendar', true);
        } else if (action.payload.windowName === 'MIND') {
          toggleApp('Mind', true);
        }
        break;
      
      case 'ADD_EVENT':
        const newEvent = {
          id: Date.now(),
          title: action.payload.title,
          date: action.payload.date, // format YYYY-MM-DD
          time: action.payload.time,
          reminderTime: action.payload.reminderTime
        };
        setCalendarEvents(prev => [...prev, newEvent]);
        setActiveEvent(newEvent);
        // Proactively open calendar to show the result
        toggleApp('Calendar', true);
        break;
      
      default:
        console.warn('[CORVUS_EXECUTION_HUB]: Unknown Command', action.command);
    }
  }, [toggleApp]);

  return (
    <div 
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden transition-all duration-1000 ease-in-out relative"
      style={{ backgroundImage: `url('${currentBg.url}')` }}
    >
      <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[0.5px] -z-10" />

      <div className="absolute bottom-6 left-6 z-0 flex flex-col pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-main/40 mb-1">Photography by</span>
        <span className="text-xs font-medium text-text-main/80 tracking-wide">{currentBg.photographer}</span>
      </div>

      <TopMenuBar 
        onToggleBackground={toggleBackground} 
        onToggleCalendar={() => toggleApp('Calendar')}
        isCalendarOpen={activeApps.includes('Calendar')}
      />

      <main className="flex-1 w-full relative z-10">
        {activeApps.map((app, index) => (
          <AppWindow 
            key={app} 
            app={app} 
            index={index} 
            onClose={() => toggleApp(app)} 
            onExecuteAction={executeAiAction}
            activeEvent={app === 'Calendar' ? activeEvent : null}
            calendarEvents={calendarEvents}
            onAddEvent={addManualEvent}
          />
        ))}
      </main>

      <footer className="w-full flex justify-center pb-2 z-50">
        <Dock activeApps={activeApps} toggleApp={toggleApp} />
      </footer>
    </div>
  );
};

export default App;
