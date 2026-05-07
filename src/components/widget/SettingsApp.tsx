import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Palette, Check, Layout, Sparkles, Info, Cpu, Terminal } from 'lucide-react';

interface SettingsAppProps {
  currentBg: any;
  onSelectBg: (bg: any) => void;
  backgrounds: any[];
  dockPosition: 'bottom' | 'left';
  onSetDockPosition: (pos: 'bottom' | 'left') => void;
  uiStyle: 'crystal' | 'neural' | 'clay' | 'carbon';
  onSetUiStyle: (style: 'crystal' | 'neural' | 'clay' | 'carbon') => void;
}

const THEME_PRESETS = [
  { name: 'Aura Cyan', brand: '0 229 255', surface: '10 28 61' },
  { name: 'Solaris Orange', brand: '255 159 28', surface: '40 25 10' },
  { name: 'Midnight Purple', brand: '155 89 182', surface: '25 15 40' },
  { name: 'Forest Green', brand: '46 204 113', surface: '10 30 15' },
  { name: 'Crimson Red', brand: '231 76 60', surface: '35 10 10' },
  { name: 'Slate Monochrome', brand: '149 165 166', surface: '25 25 25' },
];

const SettingsApp: React.FC<SettingsAppProps> = ({ currentBg, onSelectBg, backgrounds, dockPosition, onSetDockPosition, uiStyle, onSetUiStyle }) => {


  const [activeTab, setActiveTab] = useState('wallpaper');
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        extractColorsAndApply(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsAndApply = (imgUrl: string) => {
    setIsExtracting(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts: { [key: string]: number } = {};
      let maxCount = 0;
      let dominantColor = { r: 0, g: 0, b: 0 };

      for (let i = 0; i < imageData.length; i += 16) {
        const r = Math.floor(imageData[i] / 10) * 10;
        const g = Math.floor(imageData[i + 1] / 10) * 10;
        const b = Math.floor(imageData[i + 2] / 10) * 10;
        const rgb = `${r},${g},${b}`;
        
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 40 || brightness > 220) continue;

        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
        if (colorCounts[rgb] > maxCount) {
          maxCount = colorCounts[rgb];
          dominantColor = { r: imageData[i], g: imageData[i+1], b: imageData[i+2] };
        }
      }

      const brand = `${dominantColor.r} ${dominantColor.g} ${dominantColor.b}`;
      const surface = `${Math.floor(dominantColor.r * 0.1)} ${Math.floor(dominantColor.g * 0.1)} ${Math.floor(dominantColor.b * 0.15)}`;
      const text = '240 240 240';

      onSelectBg({
        ...currentBg,
        url: imgUrl,
        photographer: 'User Upload',
        palette: { brand, surface, text }
      });
      setIsExtracting(false);
    };
  };

  const applyThemePreset = (theme: typeof THEME_PRESETS[0]) => {
    onSelectBg({
      ...currentBg,
      palette: {
        ...currentBg.palette,
        brand: theme.brand,
        surface: theme.surface
      }
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden font-label">
      {/* Sidebar */}
      <div className="w-24 border-r border-text-main/5 flex flex-col items-center py-6 gap-6 bg-text-main/5">
        <button 
          onClick={() => setActiveTab('wallpaper')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'wallpaper' ? 'text-brand' : 'text-text-main/30 hover:text-text-main/60'}`}
        >
          <ImageIcon size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Visual</span>
        </button>
        <button 
          onClick={() => setActiveTab('theme')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'theme' ? 'text-brand' : 'text-text-main/30 hover:text-text-main/60'}`}
        >
          <Palette size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Theme</span>
        </button>
        <button 
          onClick={() => setActiveTab('layout')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'layout' ? 'text-brand' : 'text-text-main/30 hover:text-text-main/60'}`}
        >
          <Layout size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Layout</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-text-main/80 mb-1">System_Personalization</h2>
          <p className="text-[9px] text-text-main/30 font-medium">Configure visual parameters and adaptive interface themes.</p>
        </div>

        {activeTab === 'wallpaper' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-28 border-2 border-dashed border-text-main/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand/40 hover:bg-brand/5 cursor-pointer transition-all overflow-hidden"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              {isExtracting ? (
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <Sparkles size={24} className="text-brand" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand">Analyzing Color DNA...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-text-main/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-text-main/40 group-hover:text-brand" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-main/40">Upload Custom Wallpaper</span>
                </>
              )}
            </div>

            {/* Presets Grid */}
            <div className="space-y-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-text-main/20 ml-1">Curated_Presets</span>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onSelectBg(bg)}
                    className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentBg.url === bg.url ? 'border-brand' : 'border-transparent hover:border-text-main/20'}`}
                  >
                    <img src={bg.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[7px] text-white/60 font-black uppercase tracking-tighter truncate">{bg.photographer}</span>
                    </div>
                    {currentBg.url === bg.url && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand rounded-full flex items-center justify-center text-slate-950 shadow-lg">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-4 bg-text-main/5 rounded-xl border border-text-main/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <Sparkles size={40} className="text-brand" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-text-main/20 mb-4 block">Active_Palette</span>
              <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-text-main/10 shadow-xl" style={{ backgroundColor: `rgb(${currentBg.palette.brand})` }} />
                  <span className="text-[7px] font-black uppercase text-text-main/40">Brand</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-text-main/10 shadow-xl" style={{ backgroundColor: `rgb(${currentBg.palette.surface})` }} />
                  <span className="text-[7px] font-black uppercase text-text-main/40">Surface</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-text-main/20 ml-1">Manual_Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {THEME_PRESETS.map((theme, idx) => {
                  const isActive = currentBg.palette.brand === theme.brand;
                  return (
                    <button
                      key={idx}
                      onClick={() => applyThemePreset(theme)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${isActive ? 'bg-brand/10 border-brand' : 'bg-text-main/5 border-text-main/5 hover:border-text-main/20'}`}
                    >
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-black/20" style={{ backgroundColor: `rgb(${theme.brand})` }} />
                        <div className="w-6 h-6 rounded-full border border-black/20" style={{ backgroundColor: `rgb(${theme.surface})` }} />
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'text-brand' : 'text-text-main/60'}`}>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-brand/5 border border-brand/20 rounded-lg">
              <Info size={10} className="text-brand" />
              <p className="text-[8px] text-brand/70 font-bold leading-relaxed uppercase tracking-tighter">
                By default, colors are extracted from your wallpaper DNA. Selecting a preset will override the adaptive engine.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              {/* UI Architecture Selection */}
              <div className="space-y-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-main/20 ml-1">Interface_Architecture</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'crystal', name: 'Crystal Core', icon: <Sparkles size={14} /> },
                    { id: 'neural', name: 'Neural Surface', icon: <Cpu size={14} /> },
                    { id: 'clay', name: 'Clay Volumetric', icon: <Layout size={14} /> },
                    { id: 'carbon', name: 'Stellar Carbon', icon: <Terminal size={14} /> },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onSetUiStyle(style.id as any)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${uiStyle === style.id ? 'bg-brand/10 border-brand' : 'bg-text-main/5 border-text-main/5 hover:border-text-main/20'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${uiStyle === style.id ? 'text-brand' : 'text-text-main/40'}`}>
                        {style.icon}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${uiStyle === style.id ? 'text-brand' : 'text-text-main/60'}`}>{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-text-main/5 rounded-xl border border-text-main/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-main/40">Glassmorphism_Intensity</span>
                    <span className="text-[8px] font-mono text-brand">Adaptive</span>
                  </div>
                  <input 
                    type="range" min="0" max="40" defaultValue="20"
                    onChange={(e) => document.documentElement.style.setProperty('--glass-blur', `${e.target.value}px`)}
                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-main/40">Window_Opacity</span>
                    <span className="text-[8px] font-mono text-brand">Dynamic</span>
                  </div>
                  <input 
                    type="range" min="10" max="90" defaultValue="40"
                    onChange={(e) => document.documentElement.style.setProperty('--glass-opacity', `${Number(e.target.value) / 100}`)}
                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onSetDockPosition('bottom')}
                  className={`flex flex-col items-center gap-2 p-4 bg-text-main/5 border rounded-xl transition-all group ${dockPosition === 'bottom' ? 'border-brand' : 'border-text-main/5 hover:border-brand/30'}`}
                >
                  <div className="w-10 h-6 border-2 border-text-main/20 rounded relative">
                    <div className="absolute bottom-1 inset-x-1 h-1 bg-brand opacity-40 group-hover:opacity-100" />
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-widest ${dockPosition === 'bottom' ? 'text-brand' : 'text-text-main/40'}`}>Dock_Bottom</span>
                </button>
                <button 
                  onClick={() => onSetDockPosition('left')}
                  className={`flex flex-col items-center gap-2 p-4 bg-text-main/5 border rounded-xl transition-all group ${dockPosition === 'left' ? 'border-brand' : 'border-text-main/5 hover:border-brand/30'}`}
                >
                  <div className="w-10 h-6 border-2 border-text-main/20 rounded relative">
                    <div className="absolute left-1 inset-y-1 w-1 bg-brand opacity-40 group-hover:opacity-100" />
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-widest ${dockPosition === 'left' ? 'text-brand' : 'text-text-main/40'}`}>Dock_Left</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-brand/5 border border-brand/20 rounded-lg">
              <Sparkles size={10} className="text-brand" />
              <p className="text-[8px] text-brand/70 font-bold leading-relaxed uppercase tracking-tighter">
                Layout configurations are applied globally. Dock positioning affects the primary navigation stack.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;
