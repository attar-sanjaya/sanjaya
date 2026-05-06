import React, { useState, useEffect } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  { url: '/chan-hoi-uj-w-v7OFT4-unsplash.jpg', photographer: 'Chan Hoi', color: '251 113 133' }, // Rose
  { url: '/harry-kessell-eE2trMn-6a0-unsplash.jpg', photographer: 'Harry Kessell', color: '16 185 129' }, // Emerald
  { url: '/pukpik-aB46yUmsMp0-unsplash.jpg', photographer: 'Pukpik', color: '168 85 247' } // Purple
];

const App: React.FC = () => {
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

  const currentBg = BACKGROUNDS[bgIndex];

  useEffect(() => {
    // Update the brand color CSS variable on the document root
    document.documentElement.style.setProperty('--brand-rgb', currentBg.color);
  }, [currentBg.color]);

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
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[0.5px] -z-10" />

      {/* Photographer Credit - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-0 flex flex-col pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-1">Photography by</span>
        <span className="text-xs font-medium text-white/80 tracking-wide">{currentBg.photographer}</span>
      </div>

      {/* Top Section */}
      <TopMenuBar 
        onToggleBackground={toggleBackground} 
        onToggleCalendar={() => toggleApp('Calendar')}
        isCalendarOpen={activeApps.includes('Calendar')}
      />

      {/* Center Section — shows active apps */}
      <main className="flex-1 w-full relative z-10">
        {activeApps.map((app, index) => (
          <AppWindow key={app} app={app} index={index} onClose={() => toggleApp(app)} />
        ))}
      </main>

      {/* Bottom Section - Dock */}
      <footer className="w-full flex justify-center pb-2 z-50">
        <Dock activeApps={activeApps} toggleApp={toggleApp} />
      </footer>
    </div>
  );
};

export default App;
