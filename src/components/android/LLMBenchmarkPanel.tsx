import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Zap,
  Shield,
  Gauge,
  WifiOff,
  Sliders,
  CheckCircle2,
  Layers,
  Clock,
  BatteryCharging,
  Activity,
  Terminal
} from 'lucide-react';
import { LLMProviderType } from '../../types/androidAgent';

interface LLMBenchmarkPanelProps {
  activeProvider: LLMProviderType;
  onChangeProvider: (provider: LLMProviderType) => void;
}

export const LLMBenchmarkPanel: React.FC<LLMBenchmarkPanelProps> = ({
  activeProvider,
  onChangeProvider
}) => {
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <div id="llm-benchmark-panel" className="jarvis-panel rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.15)] border-cyan-500/40">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-hud font-bold text-cyan-200 flex items-center gap-2 tracking-wider">
              <span>J.A.R.V.I.S. DUAL-TIER LLM INFERENCE ENGINE</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/80 font-mono">
                GEMINI // NPU_ACCELERATOR
              </span>
            </h2>
            <p className="text-xs font-mono text-cyan-400/80">
              Low-latency Tactical Reasoning, Offline Failover & Hardware Vector Routing
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Model 1: Cloud Gemini API */}
        <div 
          onClick={() => onChangeProvider('cloud')}
          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 relative ${
            activeProvider === 'cloud'
              ? 'jarvis-panel border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              : 'bg-slate-950/80 border-slate-800 opacity-70 hover:opacity-100 hover:border-cyan-500/50'
          }`}
        >
          <div className="jarvis-corner-tl" />
          <div className="jarvis-corner-tr" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-hud font-bold text-sm text-cyan-200">GEMINI 2.5 PRO / FLASH</h3>
                <p className="text-[10px] font-mono text-cyan-400">CLOUD PRIMARY CORE</p>
              </div>
            </div>
            {activeProvider === 'cloud' && (
              <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-hud font-bold text-[10px] shadow-[0_0_10px_#00F0FF]">
                ENGAGED
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-2">
            <div className="p-2 rounded bg-slate-950/90 border border-cyan-500/30">
              <span className="text-cyan-500 block text-[9px]">LATENCY</span>
              <span className="text-cyan-200 font-bold">~280ms</span>
            </div>
            <div className="p-2 rounded bg-slate-950/90 border border-cyan-500/30">
              <span className="text-cyan-500 block text-[9px]">REASONING</span>
              <span className="text-emerald-400 font-bold">99.8%</span>
            </div>
            <div className="p-2 rounded bg-slate-950/90 border border-cyan-500/30">
              <span className="text-cyan-500 block text-[9px]">CONTEXT</span>
              <span className="text-cyan-200 font-bold">1M TOKENS</span>
            </div>
          </div>
        </div>

        {/* Model 2: On-Device Local Model */}
        <div 
          onClick={() => onChangeProvider('local')}
          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 relative ${
            activeProvider === 'local'
              ? 'jarvis-panel-emerald border-emerald-400 shadow-[0_0_20px_rgba(0,255,157,0.4)]'
              : 'bg-slate-950/80 border-slate-800 opacity-70 hover:opacity-100 hover:border-emerald-500/50'
          }`}
        >
          <div className="jarvis-corner-tl" />
          <div className="jarvis-corner-tr" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-hud font-bold text-sm text-emerald-200">GEMMA 2B ON-DEVICE</h3>
                <p className="text-[10px] font-mono text-emerald-400">NNAPI / NPU LOCAL</p>
              </div>
            </div>
            {activeProvider === 'local' && (
              <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-hud font-bold text-[10px] shadow-[0_0_10px_#00FF9D]">
                ENGAGED
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-2">
            <div className="p-2 rounded bg-slate-950/90 border border-emerald-500/30">
              <span className="text-emerald-500 block text-[9px]">LATENCY</span>
              <span className="text-emerald-200 font-bold">~45ms</span>
            </div>
            <div className="p-2 rounded bg-slate-950/90 border border-emerald-500/30">
              <span className="text-emerald-500 block text-[9px]">PRIVACY</span>
              <span className="text-emerald-400 font-bold">100% AIRGAP</span>
            </div>
            <div className="p-2 rounded bg-slate-950/90 border border-emerald-500/30">
              <span className="text-emerald-500 block text-[9px]">OFFLINE</span>
              <span className="text-emerald-200 font-bold">FULL ACCESS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
