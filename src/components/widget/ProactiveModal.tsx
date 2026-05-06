import React from 'react';
import { BrainCircuit } from 'lucide-react';

const ProactiveModal: React.FC = () => {
  return (
    <div className="relative group">
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-brand/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-surface/50 backdrop-blur-2xl p-8 w-[420px] max-w-full rounded-2xl border border-text-main/10 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-brand/10 rounded-lg border border-brand/20">
            <BrainCircuit size={28} className="text-brand animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-main tracking-tight mb-1">Welcome back.</h2>
            <p className="text-text-main/80 leading-relaxed text-[15px]">
              I noticed you've been delaying the side project. Let's lock in 20 minutes today.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <button className="px-5 py-2 text-sm font-medium text-text-main/70 hover:text-text-main border border-text-main/10 hover:border-text-main/20 rounded-lg transition-all">
            Dismiss
          </button>
          <button className="px-6 py-2 text-sm font-semibold bg-brand text-slate-950 rounded-lg hover:brightness-110 hover:shadow-[0_0_15px_rgb(var(--brand-rgb)/0.4)] transition-all">
            Commit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProactiveModal;
