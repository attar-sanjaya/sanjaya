import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Palette, Check, Layout, Sparkles } from 'lucide-react';

interface SettingsAppProps {
  currentBg: any;
  onSelectBg: (bg: any) => void;
  backgrounds: any[];
}

const SettingsApp: React.FC<SettingsAppProps> = ({ currentBg, onSelectBg, backgrounds }) => {
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

      // Sample pixels
      for (let i = 0; i < imageData.length; i += 16) { // step by 4 pixels (16 values)
        const r = Math.floor(imageData[i] / 10) * 10;
        const g = Math.floor(imageData[i + 1] / 10) * 10;
        const b = Math.floor(imageData[i + 2] / 10) * 10;
        const rgb = `${r},${g},${b}`;
        
        // Skip too dark or too light colors
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 40 || brightness > 220) continue;

        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
        if (colorCounts[rgb] > maxCount) {
          maxCount = colorCounts[rgb];
          dominantColor = { r: imageData[i], g: imageData[i+1], b: imageData[i+2] };
        }
      }

      // Generate complementary/harmonious palette
      const brand = `${dominantColor.r} ${dominantColor.g} ${dominantColor.b}`;
      
      // Surface is a very dark, desaturated version of brand
      const surface = `${Math.floor(dominantColor.r * 0.1)} ${Math.floor(dominantColor.g * 0.1)} ${Math.floor(dominantColor.b * 0.15)}`;
      
      // Text is very light
      const text = '240 240 240';

      onSelectBg({
        url: imgUrl,
        photographer: 'User Upload',
        palette: { brand, surface, text }
      });
      setIsExtracting(false);
    };
  };

  return (
    <div className="flex h-full w-full bg-black/20 backdrop-blur-md overflow-hidden font-label">
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
          <span className="text-[7px] font-black uppercase tracking-widest">Colors</span>
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
            <div className="p-4 bg-text-main/5 rounded-xl border border-text-main/10">
              <span className="text-[8px] font-black uppercase tracking-widest text-text-main/20 mb-4 block">Current_Palette</span>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-text-main/10 shadow-xl" style={{ backgroundColor: `rgb(${currentBg.palette.brand})` }} />
                  <span className="text-[7px] font-black uppercase text-text-main/40">Brand</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-text-main/10 shadow-xl" style={{ backgroundColor: `rgb(${currentBg.palette.surface})` }} />
                  <span className="text-[7px] font-black uppercase text-text-main/40">Surface</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-text-main/10 shadow-xl" style={{ backgroundColor: `rgb(${currentBg.palette.text})` }} />
                  <span className="text-[7px] font-black uppercase text-text-main/40">Text</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-brand/5 border border-brand/20 rounded-xl">
              <Sparkles size={16} className="text-brand" />
              <p className="text-[9px] text-brand font-bold leading-relaxed">
                Adaptive Theme Engine is active. System colors are automatically calibrated based on the visual entropy of your wallpaper.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;
