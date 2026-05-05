import React, { useState } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  '/jeremy-bishop-QUwLZNchflk-unsplash.jpg',
  '/pukpik-aB46yUmsMp0-unsplash.jpg'
];

const App: React.FC = () => {
  const [activeApps, setActiveApps] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

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
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden transition-all duration-700"
      style={{ backgroundImage: `url('${BACKGROUNDS[bgIndex]}')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] -z-10" />

      {/* Top Section */}
      <TopMenuBar 
        onToggleBackground={toggleBackground} 
        onToggleCalendar={() => toggleApp('Calendar')}
        isCalendarOpen={activeApps.includes('Calendar')}
      />

      {/* Center Section — shows active apps */}
      <main className="flex-1 flex items-center justify-center w-full p-4 relative pointer-events-none">
        {activeApps.map(app => (
          <AppWindow key={app} app={app} onClose={() => toggleApp(app)} />
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

