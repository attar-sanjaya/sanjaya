import React, { useState, useEffect, useCallback } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  { 
    url: '/chan-hoi-uj-w-v7OFT4-unsplash.jpg', 
    photographer: 'Chan Hoi',
  },
  { 
    url: '/harry-kessell-eE2trMn-6a0-unsplash.jpg', 
    photographer: 'Harry Kessell',
  },
  { 
    url: '/pukpik-aB46yUmsMp0-unsplash.jpg', 
    photographer: 'Pukpik',
  }
];

const App: React.FC = () => {
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  const currentBg = BACKGROUNDS[bgIndex];

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

  const executeAiAction = useCallback((action: { command: string; payload: any }) => {
    switch (action.command) {
      case 'OPEN_WINDOW':
        if (action.payload.windowName === 'CALENDAR') toggleApp('Calendar', true);
        else if (action.payload.windowName === 'MIND') toggleApp('Mind', true);
        break;
      case 'ADD_EVENT':
        const newEvent = {
          id: Date.now(),
          title: action.payload.title,
          date: action.payload.date,
          time: action.payload.time,
          reminderTime: action.payload.reminderTime,
          isAiGenerated: true,
        };
        setCalendarEvents(prev => [...prev, newEvent]);
        setActiveEvent(newEvent);
        toggleApp('Calendar', true);
        break;
      default:
        console.warn('[CORVUS]: Unknown command', action.command);
    }
  }, [toggleApp]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `
          linear-gradient(135deg, #0a0e1a 0%, #0d1528 50%, #0a1020 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Wallpaper overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${currentBg.url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,14,26,0.7) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Photo credit */}
      <div
        style={{
          position: 'absolute',
          bottom: 72,
          left: 20,
          zIndex: 2,
          opacity: 0.3,
          pointerEvents: 'none',
          transition: 'opacity 200ms ease',
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(220,230,255,0.6)' }}>
          Photo · {currentBg.photographer}
        </span>
      </div>

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        <TopMenuBar onToggleBackground={toggleBackground} />
      </div>

      {/* Desktop canvas */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10, overflow: 'hidden' }}>
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

      {/* Dock */}
      <footer style={{ position: 'relative', zIndex: 50, display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <Dock activeApps={activeApps} toggleApp={toggleApp} />
      </footer>
    </div>
  );
};

export default App;
