import React from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';

const App: React.FC = () => {
  return (
    <div 
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/jeremy-bishop-QUwLZNchflk-unsplash.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] -z-10" />

      {/* Top Section */}
      <TopMenuBar />

      {/* Center Section — empty for now */}
      <main className="flex-1 flex items-center justify-center w-full" />

      {/* Bottom Section - Dock */}
      <footer className="w-full flex justify-center pb-4">
        <Dock />
      </footer>
    </div>
  );
};

export default App;

