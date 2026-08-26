import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Terminal,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Maximize2,
  ChevronRight,
  Code,
  Radio,
  Activity,
  Flame
} from 'lucide-react';
import { AgentExecutionSession, LLMProviderType, ReActStep } from '../../types/androidAgent';
import { ArcReactorCore } from './ArcReactorCore';

interface AgentAssistantDrawerProps {
  currentSession: AgentExecutionSession | null;
  onExecutePrompt: (prompt: string, provider: LLMProviderType) => void;
  isRunning: boolean;
  activeProvider: LLMProviderType;
  onChangeProvider: (provider: LLMProviderType) => void;
}

export const AgentAssistantDrawer: React.FC<AgentAssistantDrawerProps> = ({
  currentSession,
  onExecutePrompt,
  isRunning,
  activeProvider,
  onChangeProvider
}) => {
  const [promptInput, setPromptInput] = useState('');

  const quickPrompts = [
    { label: '📝 Agent Army: Read Keep Notes', text: 'Access Google Keep on my phone and list all notes and sprint checklists' },
    { label: '✍️ Agent Army: Create Keep Note', text: 'Agent Army: Generate sprint tasks & deliverables checklist and save to Google Keep note' },
    { label: '🔍 Search Keep: "AgentArmy"', text: 'Search my Google Keep notes database for "AgentArmy" briefs and open Keep' },
    { label: '💬 Tactical Message to Alex', text: 'Open Messages and text Alex Chen "Protocol verified. System nominal at 100%."' },
    { label: '📍 GPS Grid & Nearest 4.8★ Cafe', text: 'Where am I? Get my GPS coordinates and navigate to the nearest top-rated cafe' },
    { label: '📸 CameraX Scene Diagnostic', text: 'Open camera, capture photo of my workspace, and analyze what is visible' },
    { label: '📁 Analyze Strategy PDF', text: 'Find the Quarterly Strategy document in Downloads and summarize the key milestones' },
    { label: '🔔 Tactical Notification Audit', text: 'Read active notifications and summarize any urgent alerts' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isRunning) return;
    onExecutePrompt(promptInput, activeProvider);
    setPromptInput('');
  };

  return (
    <div id="agent-orchestrator-drawer" className="jarvis-panel rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.15)] border-cyan-500/40">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      {/* Header & LLM Provider Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-hud font-bold text-cyan-200 flex items-center gap-2 tracking-wider">
              <span>J.A.R.V.I.S. RE-ACT ORCHESTRATOR</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-mono">
                DAEMON_ACTIVE
              </span>
            </h2>
            <p className="text-xs font-mono text-cyan-400/80">
              Autonomous reasoning loop with 7 Kotlin Android Tool Capabilities & Keep Swarm
            </p>
          </div>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-cyan-500/40 text-xs">
          <button
            onClick={() => onChangeProvider('cloud')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[10px] tracking-wider transition-all cursor-pointer ${
              activeProvider === 'cloud'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_#00F0FF]'
                : 'text-cyan-300/80 hover:text-white hover:bg-cyan-950'
            }`}
          >
            <Sparkles className="w-3 h-3" /> CLOUD GEMINI 2.5
          </button>
          <button
            onClick={() => onChangeProvider('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-hud text-[10px] tracking-wider transition-all cursor-pointer ${
              activeProvider === 'local'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_12px_#00FF9D]'
                : 'text-emerald-400/80 hover:text-white hover:bg-emerald-950'
            }`}
          >
            <Zap className="w-3 h-3" /> ON-DEVICE NPU
          </button>
        </div>
      </div>

      {/* Quick Scenario Directives Bar */}
      <div className="py-2.5 space-y-1.5 border-b border-cyan-500/20">
        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/90">
          <span className="flex items-center gap-1.5 font-hud text-[10px]">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> TACTICAL MISSION PRESETS:
          </span>
          <span className="text-[10px] text-cyan-500">7 Subsystems Ready</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setPromptInput(p.text);
                onExecutePrompt(p.text, activeProvider);
              }}
              disabled={isRunning}
              className="text-[10px] font-mono whitespace-nowrap bg-slate-950/80 hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 px-2.5 py-1 rounded-lg transition-all shadow-sm hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] disabled:opacity-40 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ReAct Execution Trace Viewport */}
      <div className="flex-1 min-h-[300px] max-h-[460px] overflow-y-auto my-3 space-y-3 pr-1">
        {isRunning ? (
          <div className="p-4 rounded-xl jarvis-panel border-cyan-400 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="font-hud font-bold text-xs text-cyan-300 tracking-wider">
                  J.A.R.V.I.S. REASONING IN PROGRESS...
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">INFERENCE ENGINE: GEMINI</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs text-cyan-200/90">
              <p>▶ Analyzing phone accessibility tree & sensor telemetry...</p>
              <p>▶ Resolving tool dispatch: GoogleKeepTool / LocationManager / IntentRouter...</p>
              <p>▶ Executing ReAct loop step verification...</p>
            </div>
          </div>
        ) : currentSession ? (
          <>
            {/* Session Prompt Banner */}
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-cyan-500/30 font-mono">
              <span className="text-cyan-400 font-hud text-[10px]">MISSION DIRECTIVE:</span>
              <span className="text-cyan-100 font-semibold truncate max-w-[70%]">
                "{currentSession.userPrompt}"
              </span>
            </div>

            {/* Step-by-Step ReAct Chain */}
            {currentSession.steps.map((step, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl jarvis-panel space-y-2 text-xs border-cyan-500/40"
              >
                <div className="jarvis-corner-tl" />
                <div className="jarvis-corner-tr" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-hud text-cyan-300 font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 text-[10px]">
                      {step.stepNumber}
                    </span>
                    PROTOCOL STEP {step.stepNumber}
                  </span>
                  <span className="text-[10px] text-cyan-500 font-mono">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Thought */}
                <div className="flex items-start gap-2 text-cyan-100 bg-slate-950/80 p-2.5 rounded-lg border border-cyan-500/30 font-sans">
                  <span className="text-amber-400 shrink-0 font-mono font-bold">💭 THOUGHT:</span>
                  <p className="text-xs leading-relaxed">{step.thought}</p>
                </div>

                {/* Tool Call (if present) */}
                {step.toolCall && (
                  <div className="flex items-start gap-2 text-cyan-300 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-500/40 font-mono text-[11px]">
                    <span className="text-cyan-400 shrink-0 font-bold">🛠️ KOTLIN TOOL:</span>
                    <div>
                      <span className="font-bold text-cyan-200">{step.toolCall.toolName}</span>
                      <span className="text-cyan-400/70 ml-1">
                        ({JSON.stringify(step.toolCall.args)})
                      </span>
                    </div>
                  </div>
                )}

                {/* Observation */}
                {step.observation && (
                  <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/40 font-mono text-[11px]">
                    <span className="text-emerald-400 shrink-0 font-bold">👁️ OBSERVATION:</span>
                    <p className="leading-relaxed">{step.observation}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Final Answer Banner */}
            {currentSession.finalAnswer && (
              <div className="p-3.5 rounded-xl jarvis-panel-emerald border-emerald-400/60 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-300 font-hud font-bold text-xs tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> MISSION COMPLETED // FINAL RESOLUTION
                </div>
                <p className="text-slate-100 leading-relaxed font-sans font-medium text-xs">
                  {currentSession.finalAnswer}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] text-emerald-400/80 font-mono border-t border-emerald-500/30">
                  <span>LATENCY: {currentSession.totalDurationMs || 320}ms</span>
                  <span>•</span>
                  <span>ENGINE: {currentSession.modelName}</span>
                  <span>•</span>
                  <span>TOKENS: {currentSession.tokensUsed?.total || 185}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-cyan-400/60 py-10 space-y-2">
            <Cpu className="w-10 h-10 mb-1 text-cyan-400/40 animate-pulse" />
            <p className="text-xs font-hud tracking-wider text-cyan-300">J.A.R.V.I.S. READY FOR TACTICAL DIRECTIVE</p>
            <p className="text-[11px] font-mono text-cyan-500/80 max-w-md">
              Select a mission scenario above or enter custom natural language for the Android agent.
            </p>
          </div>
        )}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <input
          id="input-agent-prompt"
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Command J.A.R.V.I.S. (e.g. 'Read Keep sprint notes', 'Text Alex Chen', 'Analyze scene with camera')..."
          disabled={isRunning}
          className="flex-1 bg-slate-950/90 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)] disabled:opacity-50 font-sans"
        />
        <button
          id="btn-execute-agent"
          type="submit"
          disabled={!promptInput.trim() || isRunning}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-hud font-bold text-xs shadow-[0_0_18px_#00F0FF] disabled:opacity-40 transition-all cursor-pointer"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>ENGAGE</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
