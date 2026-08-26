import React, { useState } from 'react';
import { AgentDefinition, MultiAgentPipeline, PipelineExecutionLog } from '../types';
import { MULTI_AGENT_PIPELINES } from '../data/agents';
import { AgentIcon } from './AgentIcon';
import {
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface SwarmOrchestratorProps {
  agents: AgentDefinition[];
}

export const SwarmOrchestrator: React.FC<SwarmOrchestratorProps> = ({ agents }) => {
  const [selectedPipeline, setSelectedPipeline] = useState<MultiAgentPipeline>(MULTI_AGENT_PIPELINES[0]);
  const [pipelineInput, setPipelineInput] = useState<string>(
    'Building an open-source autonomous agent swarm system that automates video and technical blog production.'
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<PipelineExecutionLog[]>([]);
  const [expandedStage, setExpandedStage] = useState<number | null>(1);
  const [copiedStage, setCopiedStage] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunPipeline = async () => {
    if (!pipelineInput.trim()) return;

    setIsExecuting(true);
    setErrorMsg(null);
    setExecutionLogs([]);

    try {
      const response = await fetch('/api/workflow/execute-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineId: selectedPipeline.id,
          userInput: pipelineInput,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      setExecutionLogs(data.logs || []);
      if (data.logs && data.logs.length > 0) {
        setExpandedStage(data.logs[0].stageNumber);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Pipeline execution encountered an error');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyStageOutput = (text: string, stageNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStage(stageNum);
    setTimeout(() => setCopiedStage(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Pipeline Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
                <Workflow className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Multi-Agent Autonomous Orchestrator
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Swarm Pipeline Deployment</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute coordinated agent swarms where each specialized AI unit hands off structured context to the next node.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Select Pipeline:</span>
            <select
              id="pipeline-select"
              value={selectedPipeline.id}
              onChange={(e) => {
                const found = MULTI_AGENT_PIPELINES.find((p) => p.id === e.target.value);
                if (found) {
                  setSelectedPipeline(found);
                  setExecutionLogs([]);
                }
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {MULTI_AGENT_PIPELINES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.stages.length} Stages)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Pipeline Stages Graph */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedPipeline.stages.map((stg, idx) => {
              const ag = agents.find((a) => a.id === stg.agentId);
              const isLast = idx === selectedPipeline.stages.length - 1;
              return (
                <div key={stg.stageNumber} className="relative flex items-center">
                  <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                      <span>STAGE 0{stg.stageNumber}</span>
                      <span className="text-cyan-400 font-bold">#{stg.agentId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-slate-800 text-indigo-300">
                        {ag && <AgentIcon name={ag.iconName} className="w-3.5 h-3.5" />}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate">
                        {stg.stageName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {ag ? ag.role_name : 'Agent'}
                    </p>
                  </div>
                  {!isLast && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-600 absolute -right-2 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input & Execution Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Pipeline Seed Topic / Context Input
          </span>
          <span className="text-xs text-slate-500">
            Will be passed into Stage 1 and propagated sequentially
          </span>
        </div>

        <textarea
          id="pipeline-input-textarea"
          value={pipelineInput}
          onChange={(e) => setPipelineInput(e.target.value)}
          rows={3}
          placeholder="Provide initial subject, problem statement, or technical topic to trigger the multi-agent swarm..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 resize-none leading-relaxed"
        />

        <button
          id="trigger-pipeline-btn"
          disabled={isExecuting || !pipelineInput.trim()}
          onClick={handleRunPipeline}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
        >
          {isExecuting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Running Autonomous Multi-Stage Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch {selectedPipeline.name} ({selectedPipeline.stages.length} Agents)</span>
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Output Stages Accordion */}
      {executionLogs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pipeline Execution Artifacts ({executionLogs.length} Stages Completed)
            </h3>
          </div>

          {executionLogs.map((log) => {
            const isExpanded = expandedStage === log.stageNumber;
            const ag = agents.find((a) => a.id === log.agentId);

            return (
              <div
                key={log.stageNumber}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedStage(isExpanded ? null : log.stageNumber)}
                  className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      STAGE {log.stageNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {log.agentName}
                      </span>
                      <span className="text-xs text-slate-400">({ag?.category})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {log.durationMs && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {log.durationMs}ms
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                      COMPLETED
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Stage Output & Synthesized Artifact:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyStageOutput(log.output || '', log.stageNumber);
                        }}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedStage === log.stageNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Stage Output</span>
                          </>
                        )}
                      </button>
                    </div>

                    {log.structuredJson ? (
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[300px]">
                        {JSON.stringify(log.structuredJson, null, 2)}
                      </pre>
                    ) : (
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {log.output}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
