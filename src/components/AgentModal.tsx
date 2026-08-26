import React, { useState } from 'react';
import { AgentDefinition } from '../types';
import { AgentIcon } from './AgentIcon';
import { getCategoryBadgeStyle } from '../utils/formatters';
import {
  X,
  Copy,
  Check,
  Play,
  Wrench,
  Terminal,
  Layers,
  Code2,
  Cpu,
  FileText,
  Workflow,
  Sparkles,
} from 'lucide-react';

interface AgentModalProps {
  agent: AgentDefinition | null;
  onClose: () => void;
  onLaunchTerminal: (agent: AgentDefinition) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  agent,
  onClose,
  onLaunchTerminal,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'schema' | 'config'>('prompt');

  if (!agent) return null;

  const badgeStyle = getCategoryBadgeStyle(agent.category);

  const copyToClipboard = (text: string, type: 'prompt' | 'schema') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="agent-detail-modal"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <AgentIcon name={agent.iconName} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  AGENT #{agent.id.toString().padStart(2, '0')}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}></span>
                  <span className="capitalize">{agent.category}</span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{agent.role_name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{agent.description}</p>
            </div>
          </div>

          <button
            id="close-agent-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-800 bg-slate-900/90 text-xs font-medium">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'prompt'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Full System Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'schema'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Structured Output Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'config'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Model & Tool Bindings</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === 'prompt' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Machine-Executable Persona & Rules
                </span>
                <button
                  onClick={() => copyToClipboard(agent.system_prompt, 'prompt')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-100 whitespace-pre-wrap leading-relaxed">
                {agent.system_prompt}
              </div>

              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Standard Example Input:
                </span>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 text-xs text-slate-300 font-sans">
                  "{agent.example_input}"
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Target JSON Schema & Output Specification
                </span>
                <button
                  onClick={() => copyToClipboard(agent.output_schema_preview, 'schema')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                {agent.output_schema_preview}
              </pre>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Default Model Configuration
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-500">Provider:</span>
                      <span className="font-mono text-slate-200 uppercase font-semibold">
                        {agent.model_config.provider} (Fallback: OpenAI / Gemini)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-500">Target Model:</span>
                      <span className="font-mono text-cyan-300">{agent.model_config.model}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Temperature:</span>
                      <span className="font-mono text-slate-200">{agent.model_config.temperature}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" /> Required Tools & Integrations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools_required.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-amber-900/40"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {agent.linked_workflows && agent.linked_workflows.length > 0 && (
                <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                    <Workflow className="w-3.5 h-3.5" /> Linked n8n Automated Workflows
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {agent.linked_workflows.map((wf) => (
                      <span
                        key={wf}
                        className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 text-xs font-medium border border-indigo-700/50"
                      >
                        {wf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Specialized Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {agent.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>

          <button
            id="launch-agent-from-modal-btn"
            onClick={() => {
              onLaunchTerminal(agent);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-950/50 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch in Live Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
