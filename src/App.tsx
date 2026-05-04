import React, { useState } from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import AppWindow from './components/widget/AppWindow';

const BACKGROUNDS = [
  '/jeremy-bishop-QUwLZNchflk-unsplash.jpg',
  '/pukpik-aB46yUmsMp0-unsplash.jpg'
];

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);

  const toggleBackground = () => {
    setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden transition-all duration-700"
      style={{ backgroundImage: `url('${BACKGROUNDS[bgIndex]}')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] -z-10" />

      {/* Top Section */}
      <TopMenuBar onToggleBackground={toggleBackground} />

      {/* Center Section — empty for now or shows active app */}
      <main className="flex-1 flex items-center justify-center w-full p-4 relative">
        {activeApp && (
          <AppWindow app={activeApp} onClose={() => setActiveApp(null)} />
        )}
      </main>

      {/* Bottom Section - Dock */}
      <footer className="w-full flex justify-center pb-4">
        <Dock activeApp={activeApp} onAppChange={setActiveApp} />
      </footer>
    </div>
  );
};

export default App;

