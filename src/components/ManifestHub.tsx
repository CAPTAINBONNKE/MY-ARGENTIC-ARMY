import React, { useState } from 'react';
import { AgentDefinition } from '../types';
import { FileCode2, Download, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';

interface ManifestHubProps {
  agents: AgentDefinition[];
}

export const ManifestHub: React.FC<ManifestHubProps> = ({ agents }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<number>(1);
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [copiedAgentJson, setCopiedAgentJson] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'ollama' | 'n8n'>('json');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const fullManifest = {
    library_version: '1.0.0',
    total_agents: agents.length,
    load_order: 'sequential',
    default_model_config: {
      provider: 'ollama',
      model: 'qwen2.5:14b',
      fallback_provider: 'openai',
      fallback_model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 4096,
    },
    files: agents.map(
      (a) =>
        `${a.id.toString().padStart(2, '0')}_${a.role_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`
    ),
  };

  const getAgentJsonSpec = (a: AgentDefinition) => {
    return {
      id: a.id,
      role_name: a.role_name,
      category: a.category,
      system_prompt: a.system_prompt,
      tools_required: a.tools_required,
      model_config: a.model_config,
      linked_workflows: a.linked_workflows || [],
    };
  };

  const getOllamaModelfile = (a: AgentDefinition) => {
    return `# Ollama Modelfile for Agent #${a.id}: ${a.role_name}
FROM qwen2.5:14b

# Set model temperature
PARAMETER temperature ${a.model_config.temperature}
PARAMETER top_p 0.9

# System instructions
SYSTEM """
${a.system_prompt}
"""
`;
  };

  const getN8nNodeSpec = (a: AgentDefinition) => {
    return {
      name: a.role_name,
      type: '@n8n/n8n-nodes-langchain.agent',
      parameters: {
        promptType: 'define',
        text: `={{ $json.input }}`,
        systemMessage: a.system_prompt,
      },
      tools: a.tools_required,
    };
  };

  const handleCopy = (text: string, type: 'manifest' | 'agent') => {
    navigator.clipboard.writeText(text);
    if (type === 'manifest') {
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2000);
    } else {
      setCopiedAgentJson(true);
      setTimeout(() => setCopiedAgentJson(false), 2000);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllManifestBundle = () => {
    const bundle = {
      manifest: fullManifest,
      agents: agents.map((a) => getAgentJsonSpec(a)),
    };
    downloadFile('my_agentic_army_full_bundle.json', JSON.stringify(bundle, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <FileCode2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Machine Manifest & Deployment Hub
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">_manifest.json & Agent Specifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Export all 50 AI agent definitions into machine-readable JSON, Ollama Modelfiles, or n8n workflow nodes.
          </p>
        </div>

        <button
          id="download-all-bundle-btn"
          onClick={downloadAllManifestBundle}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete 50-Agent Bundle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: _manifest.json viewer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-emerald-400" /> _manifest.json
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(fullManifest, null, 2), 'manifest')}
                  className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-850 rounded border border-slate-700"
                >
                  {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => downloadFile('_manifest.json', JSON.stringify(fullManifest, null, 2))}
                  className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-850 rounded border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <pre className="mt-3 flex-1 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-auto max-h-[500px]">
              {JSON.stringify(fullManifest, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Column: Individual Agent Export */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <label htmlFor="manifest-agent-select" className="text-xs font-bold text-slate-300">Agent File:</label>
                <select
                  id="manifest-agent-select"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(parseInt(e.target.value, 10))}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id.toString().padStart(2, '0')}_{a.role_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setExportFormat('json')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    exportFormat === 'json' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  Standard JSON
                </button>
                <button
                  onClick={() => setExportFormat('ollama')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    exportFormat === 'ollama' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  Ollama Modelfile
                </button>
                <button
                  onClick={() => setExportFormat('n8n')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    exportFormat === 'n8n' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  n8n Node
                </button>
              </div>
            </div>

            <div className="flex-1 mt-3">
              {exportFormat === 'json' && (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-auto max-h-[460px]">
                  {JSON.stringify(getAgentJsonSpec(selectedAgent), null, 2)}
                </pre>
              )}

              {exportFormat === 'ollama' && (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-auto max-h-[460px] whitespace-pre-wrap">
                  {getOllamaModelfile(selectedAgent)}
                </pre>
              )}

              {exportFormat === 'n8n' && (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-auto max-h-[460px]">
                  {JSON.stringify(getN8nNodeSpec(selectedAgent), null, 2)}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono">
                {selectedAgent.id.toString().padStart(2, '0')}_{selectedAgent.role_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json
              </span>
              <button
                onClick={() => {
                  const content =
                    exportFormat === 'json'
                      ? JSON.stringify(getAgentJsonSpec(selectedAgent), null, 2)
                      : exportFormat === 'ollama'
                      ? getOllamaModelfile(selectedAgent)
                      : JSON.stringify(getN8nNodeSpec(selectedAgent), null, 2);
                  const ext = exportFormat === 'ollama' ? 'Modelfile' : 'json';
                  downloadFile(`agent_${selectedAgent.id}_${exportFormat}.${ext}`, content);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Agent Specification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
