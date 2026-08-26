import React from 'react';
import { Smartphone, Code, Brain, Layers, Cpu, Sparkles, Shield, Zap, Activity } from 'lucide-react';
import { LLMProviderType } from '../../types/androidAgent';
import { ArcReactorCore } from './ArcReactorCore';

export type AndroidAppTab = 'mobile_agent' | 'kotlin_architecture' | 'memory_system' | 'capabilities' | 'llm_matrix';

interface AndroidHeaderProps {
  activeTab: AndroidAppTab;
  setActiveTab: (tab: AndroidAppTab) => void;
  llmProvider: LLMProviderType;
  agentRunning: boolean;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  activeTab,
  setActiveTab,
  llmProvider,
  agentRunning
}) => {
  return (
    <header className="jarvis-panel border-b border-cyan-500/30 sticky top-0 z-40 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: J.A.R.V.I.S. Core Brand & Hologram Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ArcReactorCore isRunning={agentRunning} size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold font-hud text-cyan-200 tracking-wider flex items-center gap-2 jarvis-glow-text">
                <span>J.A.R.V.I.S.</span>
                <span className="text-xs text-cyan-400 font-mono font-normal">v4.0 // ANDROID_AGENT_OS</span>
              </h1>
              <span className="text-[10px] bg-cyan-950/80 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                STARK_MARK_85
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              TACTICAL AGENT DAEMON • 7 HARDWARE SUBSYSTEMS • 50-SWARM KEEP MATRIX
            </p>
          </div>
        </div>

        {/* Center: HUD Navigation Controls */}
        <nav className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-cyan-500/30 text-xs overflow-x-auto no-scrollbar">
          <button
            id="tab-mobile-agent"
            onClick={() => setActiveTab('mobile_agent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'mobile_agent'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Hologram Phone</span>
          </button>

          <button
            id="tab-kotlin-architecture"
            onClick={() => setActiveTab('kotlin_architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'kotlin_architecture'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Kotlin Core</span>
          </button>

          <button
            id="tab-memory-system"
            onClick={() => setActiveTab('memory_system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'memory_system'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(255,184,0,0.6)]'
                : 'text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>RAM / Room Matrix</span>
          </button>

          <button
            id="tab-capabilities"
            onClick={() => setActiveTab('capabilities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'capabilities'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,255,157,0.6)]'
                : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-950/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Subsystems (7)</span>
          </button>

          <button
            id="tab-llm-matrix"
            onClick={() => setActiveTab('llm_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'llm_matrix'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>LLM Engine</span>
          </button>
        </nav>

        {/* Right: Live Telemetry Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-xs font-mono">
            <span className="text-cyan-400/70 font-hud text-[10px]">CORE:</span>
            <span className={llmProvider === 'cloud' ? 'text-cyan-300 font-bold' : llmProvider === 'local' ? 'text-emerald-300 font-bold' : 'text-blue-300 font-bold'}>
              {llmProvider.toUpperCase()}_GEMINI
            </span>
          </div>

          {agentRunning && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-200 bg-cyan-950/90 border border-cyan-400 px-3 py-1 rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.5)] font-mono animate-pulse">
              <Activity className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>JARVIS_ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
