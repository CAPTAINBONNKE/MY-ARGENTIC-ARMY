import React from 'react';
import {
  Shield,
  Layers,
  Terminal,
  Workflow,
  Sparkles,
  FileCode2,
  Activity,
  Cpu,
  Radio,
  Share2,
  FileText,
  Boxes,
} from 'lucide-react';

export type ActiveTab =
  | 'command'
  | 'delegation'
  | 'inspector'
  | 'reports'
  | 'roster'
  | 'terminal'
  | 'swarm'
  | 'prompt_lab'
  | 'manifest';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  agentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  agentCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Title */}
          <div
            onClick={() => setActiveTab('command')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 shadow-md shadow-cyan-950/50 border border-cyan-400/30">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                  My Agentic Army
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 rounded-full">
                  PROTOCOL V2.1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Unified Central Command & Protocol Bus (50 AI Modules)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto max-w-[620px] scrollbar-none">
            <button
              id="tab-command-btn"
              onClick={() => setActiveTab('command')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'command'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Central Command</span>
            </button>

            <button
              id="tab-delegation-btn"
              onClick={() => setActiveTab('delegation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'delegation'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Task Delegation</span>
            </button>

            <button
              id="tab-inspector-btn"
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'inspector'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Protocol Inspector</span>
            </button>

            <button
              id="tab-reports-btn"
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'reports'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Consolidated Reports</span>
            </button>

            <button
              id="tab-roster-btn"
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'roster'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>50 Agents</span>
            </button>

            <button
              id="tab-terminal-btn"
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'terminal'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>

            <button
              id="tab-swarm-btn"
              onClick={() => setActiveTab('swarm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'swarm'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Pipelines</span>
            </button>

            <button
              id="tab-promptlab-btn"
              onClick={() => setActiveTab('prompt_lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all hidden xl:flex ${
                activeTab === 'prompt_lab'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Lab</span>
            </button>

            <button
              id="tab-manifest-btn"
              onClick={() => setActiveTab('manifest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all hidden xl:flex ${
                activeTab === 'manifest'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Manifest</span>
            </button>
          </nav>

          {/* Telemetry Status badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">Bus:</span>
              <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Synchronized
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
