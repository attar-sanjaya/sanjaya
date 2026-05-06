import React, { useState, useEffect } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  { 
    url: '/chan-hoi-uj-w-v7OFT4-unsplash.jpg', 
    photographer: 'Chan Hoi',
    palette: {
      brand: '0 229 255',   // Bright Cyan
      surface: '10 28 61', // Deep Space Blue
      text: '240 240 240'   // Off-White
    }
  },
  { 
    url: '/harry-kessell-eE2trMn-6a0-unsplash.jpg', 
    photographer: 'Harry Kessell',
    palette: {
      brand: '255 159 28',  // Sunset Orange
      surface: '78 74 70',  // Warm Brown-Grey
      text: '255 255 255'    // White
    }
  },
  { 
    url: '/pukpik-aB46yUmsMp0-unsplash.jpg', 
    photographer: 'Pukpik',
    palette: {
      brand: '244 168 172', // Warm Pastel Pink
      surface: '242 232 228', // Soft Pink-Grey
      text: '58 58 58'       // Charcoal Grey
    }
  }
];

const App: React.FC = () => {
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

  const currentBg = BACKGROUNDS[bgIndex];

  useEffect(() => {
    // Dynamically update the entire UI/UX palette
    const root = document.documentElement;
    root.style.setProperty('--brand-rgb', currentBg.palette.brand);
    root.style.setProperty('--surface-rgb', currentBg.palette.surface);
    root.style.setProperty('--text-rgb', currentBg.palette.text);
  }, [currentBg.palette]);

  const toggleBackground = () => {
    setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  };

  const toggleApp = (app: string) => {
    setActiveApps((prev) => 
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden transition-all duration-1000 ease-in-out relative"
      style={{ backgroundImage: `url('${currentBg.url}')` }}
    >
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[0.5px] -z-10" />

      {/* Photographer Credit */}
      <div className="absolute bottom-6 left-6 z-0 flex flex-col pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-main/40 mb-1">Photography by</span>
        <span className="text-xs font-medium text-text-main/80 tracking-wide">{currentBg.photographer}</span>
      </div>

      {/* Top Section */}
      <TopMenuBar 
        onToggleBackground={toggleBackground} 
        onToggleCalendar={() => toggleApp('Calendar')}
        isCalendarOpen={activeApps.includes('Calendar')}
      />

      {/* Center Section */}
      <main className="flex-1 w-full relative z-10">
        {activeApps.map((app, index) => (
          <AppWindow key={app} app={app} index={index} onClose={() => toggleApp(app)} />
        ))}
      </main>

      {/* Bottom Section */}
      <footer className="w-full flex justify-center pb-2 z-50">
        <Dock activeApps={activeApps} toggleApp={toggleApp} />
      </footer>
    </div>
  );
};

export default App;
