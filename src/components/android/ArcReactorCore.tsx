import React from 'react';

interface ArcReactorCoreProps {
  isRunning?: boolean;
  intensity?: 'idle' | 'active' | 'overdrive';
  size?: 'sm' | 'md' | 'lg';
}

export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
  isRunning = false,
  intensity = 'idle',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center select-none`}>
      {/* Outer Rotating HUD Ring */}
      <div className={`absolute inset-0 rounded-full border border-dashed border-cyan-500/40 ${isRunning ? 'animate-spin-slow' : 'opacity-50'}`} />

      {/* Counter-rotating Segment Ring */}
      <div 
        className={`absolute inset-1 rounded-full border border-cyan-400/30 border-t-cyan-300 border-b-cyan-300 ${isRunning ? 'animate-spin-reverse' : 'opacity-40'}`} 
      />

      {/* Outer Tri-Bracket Accents */}
      <svg className={`absolute inset-0 w-full h-full ${isRunning ? 'animate-spin-slow' : ''}`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="6 14" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="30 20" />
      </svg>

      {/* Glowing Inner Core Ring */}
      <div className="absolute inset-3 rounded-full border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-cyan-950/40 flex items-center justify-center">
        {/* Radar Sweep when active */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
            <div className="w-full h-full bg-gradient-to-tr from-cyan-400 to-transparent animate-radar-sweep origin-center" />
          </div>
        )}

        {/* Central Core Pulse */}
        <div className={`w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_#00F0FF] ${isRunning ? 'animate-jarvis-pulse' : 'opacity-60'} flex items-center justify-center text-slate-950`}>
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-inner" />
        </div>
      </div>

      {/* Corner crosshairs indicator */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-1.5 w-0.5 bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-0.5 bg-cyan-400 shadow-[0_0_4px_#00F0FF]" />
    </div>
  );
};
