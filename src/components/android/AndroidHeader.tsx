import React from 'react';
import {
  Smartphone,
  Code,
  Brain,
  Layers,
  Cpu,
  Sparkles,
  Shield,
  Zap,
  Activity,
  Workflow,
  Radio,
  FileText,
  Boxes,
  Terminal,
  Database,
} from 'lucide-react';
import { LLMProviderType } from '../../types/androidAgent';
import { ArcReactorCore } from './ArcReactorCore';

export type OperatingMode = 'android_os' | 'swarm_army';

export type AppTab =
  | 'mobile_agent'
  | 'kotlin_architecture'
  | 'memory_system'
  | 'capabilities'
  | 'llm_matrix'
  | 'swarm_command'
  | 'swarm_pipelines'
  | 'task_delegation'
  | 'protocol_inspector'
  | 'consolidated_reports'
  | 'prompt_lab'
  | 'manifest_hub'
  | 'agent_terminal';

// Legacy alias for compatibility
export type AndroidAppTab = AppTab;

interface AndroidHeaderProps {
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  llmProvider: LLMProviderType;
  agentRunning: boolean;
  isArmySyncActive?: boolean;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  operatingMode,
  setOperatingMode,
  activeTab,
  setActiveTab,
  llmProvider,
  agentRunning,
  isArmySyncActive = false,
}) => {
  return (
    <header className="jarvis-panel border-b border-cyan-500/30 sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-2xl backdrop-blur-xl">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand, Mode Switcher & Hologram Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ArcReactorCore isRunning={agentRunning} isArmySyncActive={isArmySyncActive} size="sm" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold font-hud text-cyan-200 tracking-wider flex items-center gap-1.5 jarvis-glow-text">
                <span>J.A.R.V.I.S.</span>
                <span className="text-[11px] text-cyan-400 font-mono font-normal hidden sm:inline">
                  {operatingMode === 'android_os' ? '// ANDROID_AGENT_OS' : '// 50_AGENT_ARMY_SWARM'}
                </span>
              </h1>

              {/* Mode Toggle Switcher */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-[10px] font-hud">
                <button
                  type="button"
                  onClick={() => {
                    setOperatingMode('android_os');
                    if (!['mobile_agent', 'kotlin_architecture', 'memory_system', 'capabilities', 'llm_matrix'].includes(activeTab)) {
                      setActiveTab('mobile_agent');
                    }
                  }}
                  className={`px-2 py-1 rounded flex items-center gap-1 transition cursor-pointer ${
                    operatingMode === 'android_os'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'text-cyan-300/70 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>ANDROID OS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOperatingMode('swarm_army');
                    if (!['swarm_command', 'swarm_pipelines', 'task_delegation', 'protocol_inspector', 'consolidated_reports', 'prompt_lab', 'manifest_hub', 'agent_terminal'].includes(activeTab)) {
                      setActiveTab('swarm_command');
                    }
                  }}
                  className={`px-2 py-1 rounded flex items-center gap-1 transition cursor-pointer ${
                    operatingMode === 'swarm_army'
                      ? 'bg-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>50-AGENT SWARM</span>
                </button>
              </div>

              {isArmySyncActive && (
                <span className="text-[10px] bg-purple-950/90 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/60 flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse">
                  <Sparkles className="w-3 h-3 text-purple-300 animate-spin" />
                  <span>SWARM_SYNC_ACTIVE</span>
                </span>
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] font-mono text-cyan-400/70 hidden sm:block">
              {operatingMode === 'android_os'
                ? 'TACTICAL AGENT DAEMON • 7 HARDWARE SUBSYSTEMS • SQLITE WAL PERSISTENCE'
                : 'AUTONOMOUS PROTOCOL MESH • 50 SPECIALIST UNITS • REPUTATION & CONSENSUS BUS'}
            </p>
          </div>
        </div>

        {/* Center: Contextual HUD Navigation Controls based on Operating Mode */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-cyan-500/30 text-xs overflow-x-auto no-scrollbar">
          {operatingMode === 'android_os' ? (
            <>
              <button
                type="button"
                id="tab-mobile-agent"
                onClick={() => setActiveTab('mobile_agent')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'mobile_agent'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Emulator</span>
              </button>

              <button
                type="button"
                id="tab-kotlin-architecture"
                onClick={() => setActiveTab('kotlin_architecture')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'kotlin_architecture'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Kotlin Core</span>
              </button>

              <button
                type="button"
                id="tab-memory-system"
                onClick={() => setActiveTab('memory_system')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'memory_system'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(255,184,0,0.6)]'
                    : 'text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>RAM / SQLite</span>
              </button>

              <button
                type="button"
                id="tab-capabilities"
                onClick={() => setActiveTab('capabilities')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'capabilities'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,255,157,0.6)]'
                    : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-950/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Subsystems (7)</span>
              </button>

              <button
                type="button"
                id="tab-llm-matrix"
                onClick={() => setActiveTab('llm_matrix')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'llm_matrix'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-950/40'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>LLM Engine</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                id="tab-swarm-command"
                onClick={() => setActiveTab('swarm_command')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'swarm_command'
                    ? 'bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                    : 'text-purple-300/80 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Command HQ</span>
              </button>

              <button
                type="button"
                id="tab-swarm-pipelines"
                onClick={() => setActiveTab('swarm_pipelines')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'swarm_pipelines'
                    ? 'bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                    : 'text-purple-300/80 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Pipelines</span>
              </button>

              <button
                type="button"
                id="tab-task-delegation"
                onClick={() => setActiveTab('task_delegation')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'task_delegation'
                    ? 'bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                    : 'text-purple-300/80 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>DAG Missions</span>
              </button>

              <button
                type="button"
                id="tab-protocol-inspector"
                onClick={() => setActiveTab('protocol_inspector')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'protocol_inspector'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-300/80 hover:text-white hover:bg-cyan-950/40'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Protocol Bus</span>
              </button>

              <button
                type="button"
                id="tab-consolidated-reports"
                onClick={() => setActiveTab('consolidated_reports')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'consolidated_reports'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,255,157,0.6)]'
                    : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>

              <button
                type="button"
                id="tab-agent-terminal"
                onClick={() => setActiveTab('agent_terminal')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'agent_terminal'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(255,184,0,0.6)]'
                    : 'text-amber-300/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CLI Terminal</span>
              </button>

              <button
                type="button"
                id="tab-prompt-lab"
                onClick={() => setActiveTab('prompt_lab')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'prompt_lab'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-300/80 hover:text-white hover:bg-cyan-950/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prompt Lab</span>
              </button>

              <button
                type="button"
                id="tab-manifest-hub"
                onClick={() => setActiveTab('manifest_hub')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-hud text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'manifest_hub'
                    ? 'bg-indigo-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(129,140,248,0.6)]'
                    : 'text-indigo-300/80 hover:text-white hover:bg-indigo-950/40'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Export Hub</span>
              </button>
            </>
          )}
        </nav>

        {/* Right: Live Telemetry Indicator & Persistence Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SQLITE WAL</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-[11px] font-mono">
            <span className="text-cyan-400/70 font-hud text-[10px]">CORE:</span>
            <span className={llmProvider === 'cloud' ? 'text-cyan-300 font-bold' : llmProvider === 'local' ? 'text-emerald-300 font-bold' : 'text-blue-300 font-bold'}>
              {llmProvider.toUpperCase()}
            </span>
          </div>

          {agentRunning && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-200 bg-cyan-950/90 border border-cyan-400 px-2.5 py-1 rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.5)] font-mono animate-pulse">
              <Activity className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span className="hidden sm:inline">PROCESSING</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
