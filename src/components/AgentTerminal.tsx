import React, { useState } from 'react';
import { AgentDefinition, AgentExecutionResponse } from '../types';
import { AgentIcon } from './AgentIcon';
import { getCategoryBadgeStyle } from '../utils/formatters';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Clock,
  Wrench,
  Cpu,
  Sparkles,
  AlertCircle,
  Code2,
  FileText,
} from 'lucide-react';

interface AgentTerminalProps {
  agents: AgentDefinition[];
  selectedAgent: AgentDefinition;
  onSelectAgent: (agent: AgentDefinition) => void;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
}) => {
  const [inputPrompt, setInputPrompt] = useState<string>(selectedAgent.example_input);
  const [temperature, setTemperature] = useState<number>(selectedAgent.model_config.temperature);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'parsed' | 'raw'>('parsed');
  const [executionResult, setExecutionResult] = useState<AgentExecutionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);

  const badgeStyle = getCategoryBadgeStyle(selectedAgent.category);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    const ag = agents.find((a) => a.id === id);
    if (ag) {
      onSelectAgent(ag);
      setInputPrompt(ag.example_input);
      setTemperature(ag.model_config.temperature);
      setExecutionResult(null);
      setErrorMsg(null);
    }
  };

  const handleExecute = async () => {
    if (!inputPrompt.trim()) return;

    setIsRunning(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          input: inputPrompt,
          temperature: temperature,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `HTTP error ${response.status}`);
      }

      const data: AgentExecutionResponse = await response.json();
      setExecutionResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to execute agent');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyOutput = () => {
    if (!executionResult) return;
    const textToCopy =
      executionResult.structuredJson
        ? JSON.stringify(executionResult.structuredJson, null, 2)
        : executionResult.output;

    navigator.clipboard.writeText(textToCopy);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleDownloadOutput = () => {
    if (!executionResult) return;
    const content = executionResult.structuredJson
      ? JSON.stringify(executionResult.structuredJson, null, 2)
      : executionResult.output;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent_${selectedAgent.id}_output_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <AgentIcon name={selectedAgent.iconName} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  AGENT #{selectedAgent.id.toString().padStart(2, '0')}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}></span>
                  <span className="capitalize">{selectedAgent.category}</span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{selectedAgent.role_name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAgent.description}</p>
            </div>
          </div>

          {/* Quick Dropdown selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="agent-select" className="text-xs font-medium text-slate-400 whitespace-nowrap">
              Switch Agent:
            </label>
            <select
              id="agent-select"
              value={selectedAgent.id}
              onChange={handleAgentChange}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 max-w-[240px]"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  #{ag.id.toString().padStart(2, '0')} - {ag.role_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Input Workbench & Execution Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> Agent Input Payload
              </span>
              <button
                id="reset-input-btn"
                onClick={() => setInputPrompt(selectedAgent.example_input)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Load Default Example</span>
              </button>
            </div>

            {/* Prompt input textarea */}
            <textarea
              id="agent-input-textarea"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter instructions, raw content, or context for this agent..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-y leading-relaxed"
            />

            {/* Parameter slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-slate-500" /> Temperature Tuning
                </span>
                <span className="font-mono text-cyan-300 font-semibold">{temperature}</span>
              </div>
              <input
                id="temp-slider"
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0 (Deterministic / Strict)</span>
                <span>1.0 (Creative / Exploratory)</span>
              </div>
            </div>

            {/* Required Tools indicators */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                <Wrench className="w-3 h-3 text-amber-400" /> Active Tool Capabilities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.tools_required.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-slate-950 text-amber-300 border border-amber-900/40 rounded text-[10px] font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <button
              id="execute-agent-btn"
              disabled={isRunning || !inputPrompt.trim()}
              onClick={handleExecute}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Agent #{selectedAgent.id} Workflow...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Agent #{selectedAgent.id} ({selectedAgent.role_name})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output Console */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col min-h-[500px]">
            {/* Output Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Execution Console
                </span>
                {executionResult && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {executionResult.executionTimeMs}ms
                  </span>
                )}
              </div>

              {/* Tabs / Actions */}
              <div className="flex items-center gap-2">
                {executionResult && (
                  <>
                    <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setActiveOutputTab('parsed')}
                        className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                          activeOutputTab === 'parsed'
                            ? 'bg-slate-800 text-cyan-300 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Code2 className="w-3 h-3" /> Structured
                      </button>
                      <button
                        onClick={() => setActiveOutputTab('raw')}
                        className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                          activeOutputTab === 'raw'
                            ? 'bg-slate-800 text-cyan-300 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileText className="w-3 h-3" /> Raw Text
                      </button>
                    </div>

                    <button
                      onClick={handleCopyOutput}
                      title="Copy Output"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    >
                      {copiedResult ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={handleDownloadOutput}
                      title="Download JSON"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Error banner if any */}
            {errorMsg && (
              <div className="my-3 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Output Display Body */}
            <div className="flex-1 mt-3 relative">
              {isRunning ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                    <Terminal className="w-5 h-5 text-cyan-400 absolute" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      Orchestrating {selectedAgent.role_name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      Enforcing strict schema constraints & tool grounding...
                    </p>
                  </div>
                </div>
              ) : executionResult ? (
                <div className="h-full flex flex-col">
                  {activeOutputTab === 'parsed' && executionResult.structuredJson ? (
                    <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-auto max-h-[480px] leading-relaxed">
                      {JSON.stringify(executionResult.structuredJson, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap overflow-auto max-h-[480px] leading-relaxed">
                      {executionResult.output}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
                    <span>Agent Persona: #{executionResult.agentId}</span>
                    <span>Status: {executionResult.status.toUpperCase()}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl p-8">
                  <Terminal className="w-8 h-8 text-slate-600 mb-2" />
                  <h4 className="text-xs font-semibold text-slate-400">Terminal Idle</h4>
                  <p className="text-xs text-slate-600 max-w-sm mt-1">
                    Click "Execute Agent #{selectedAgent.id}" to run autonomous inference against your prompt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
