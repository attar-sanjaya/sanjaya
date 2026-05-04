import React from 'react';
import TopMenuBar from './components/layout/TopMenuBar';
import Dock from './components/layout/Dock';
import ProactiveModal from './components/widget/ProactiveModal';

const App: React.FC = () => {
  return (
    <div 
      className="h-screen w-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/jeremy-bishop-QUwLZNchflk-unsplash.jpg')" }}
    >
      {/* Overlay to ensure readability and add depth */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] -z-10" />

      {/* Top Section */}
      <TopMenuBar />

      {/* Center Section - Proactive Widget */}
      <main className="flex-1 flex items-center justify-center w-full">
        <ProactiveModal />
      </main>

      {/* Bottom Section - Dock */}
      <footer className="w-full flex justify-center pb-4">
        <Dock />
      </footer>
    </div>
  );
};

export default App;
