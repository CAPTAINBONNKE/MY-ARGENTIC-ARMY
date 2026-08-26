import React from 'react';

interface ArcReactorCoreProps {
  isRunning?: boolean;
  isArmySyncActive?: boolean;
  intensity?: 'idle' | 'active' | 'overdrive';
  size?: 'sm' | 'md' | 'lg';
}

export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
  isRunning = false,
  isArmySyncActive = false,
  intensity = 'idle',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const activeMode = isRunning || isArmySyncActive;

  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center select-none group`}>
      {/* Holographic Progress Ring for Agent Army Sync */}
      {isArmySyncActive && (
        <div className="absolute -inset-2.5 rounded-full pointer-events-none z-10 flex items-center justify-center animate-holo-glow">
          {/* Conical gradient background glow */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-tr from-purple-500/20 via-cyan-400/30 to-amber-400/20 blur-[3px] animate-holo-spin" />

          {/* SVG Multi-Layer Holographic Progress Arc */}
          <svg className="absolute inset-0 w-full h-full animate-holo-spin" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="holoArmyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#00F0FF" stopOpacity="1" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="holoTrailGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Faint Guide Ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(0, 240, 255, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
            />

            {/* Primary Smooth Holographic Progress Stroke */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#holoArmyGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="339"
              strokeDashoffset="120"
              className="animate-holo-dash"
            />

            {/* Counter Orbiting Micro Dots */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="url(#holoTrailGradient)"
              strokeWidth="1.2"
              strokeDasharray="18 40"
            />
          </svg>

          {/* Reverse Orbiting Holographic Bracket Markers */}
          <svg className="absolute inset-0 w-full h-full animate-holo-spin-reverse" viewBox="0 0 120 120">
            {/* Holographic Target Brackets */}
            <path
              d="M 60 4 A 56 56 0 0 1 76 6"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 116 60 A 56 56 0 0 1 114 76"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 60 116 A 56 56 0 0 1 44 114"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 4 60 A 56 56 0 0 1 6 44"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Outer Rotating HUD Ring */}
      <div className={`absolute inset-0 rounded-full border border-dashed border-cyan-500/40 ${activeMode ? 'animate-spin-slow' : 'opacity-50'}`} />

      {/* Counter-rotating Segment Ring */}
      <div 
        className={`absolute inset-1 rounded-full border border-cyan-400/30 border-t-cyan-300 border-b-cyan-300 ${activeMode ? 'animate-spin-reverse' : 'opacity-40'}`} 
      />

      {/* Outer Tri-Bracket Accents */}
      <svg className={`absolute inset-0 w-full h-full ${activeMode ? 'animate-spin-slow' : ''}`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="6 14" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="30 20" />
      </svg>

      {/* Glowing Inner Core Ring */}
      <div className={`absolute inset-3 rounded-full border-2 ${isArmySyncActive ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] bg-purple-950/40' : 'border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-cyan-950/40'} flex items-center justify-center transition-all duration-300`}>
        {/* Radar Sweep when active */}
        {activeMode && (
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
            <div className={`w-full h-full bg-gradient-to-tr ${isArmySyncActive ? 'from-purple-400' : 'from-cyan-400'} to-transparent animate-radar-sweep origin-center`} />
          </div>
        )}

        {/* Central Core Pulse */}
        <div className={`w-6 h-6 rounded-full ${isArmySyncActive ? 'bg-gradient-to-r from-purple-400 to-cyan-300 shadow-[0_0_25px_#A855F7]' : 'bg-cyan-400 shadow-[0_0_20px_#00F0FF]'} ${activeMode ? 'animate-jarvis-pulse' : 'opacity-60'} flex items-center justify-center text-slate-950`}>
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
