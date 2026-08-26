import React, { useState } from 'react';
import {
  AgentDefinition,
  PriorityLevel,
  TaskDelegationNode,
} from '../types';
import { AgentIcon } from './AgentIcon';
import {
  Workflow,
  Play,
  Plus,
  Trash2,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface TaskDelegationStudioProps {
  agents: AgentDefinition[];
  onGenerateReport?: (missionData: { title: string; objective: string; logs: any[] }) => void;
}

const PRESET_MISSIONS = [
  {
    id: 'full_tech_launch',
    title: 'Autonomous Software Architecture & QA Verification',
    objective: 'Design a microservice architecture, perform prompt injection hardening, generate database schemas, and run comprehensive QA audits.',
    nodes: [
      {
        nodeId: 'node_1',
        agentId: 1, // Content/Concept or System Architect
        taskTitle: 'System Requirements & Architecture Specs',
        taskPrompt: 'Draft high-level functional requirements and data flow specifications for: {{mission_objective}}',
        expectedOutputKey: 'arch_spec',
        priority: 'HIGH' as PriorityLevel,
      },
      {
        nodeId: 'node_2',
        agentId: 4, // AI Prompt Engineer
        taskTitle: 'Hardened Prompt & Schema Synthesis',
        taskPrompt: 'Review architectural spec: {{arch_spec}}. Synthesize production-grade JSON schemas and injection-proof system prompts.',
        expectedOutputKey: 'prompt_spec',
        priority: 'HIGH' as PriorityLevel,
      },
      {
        nodeId: 'node_3',
        agentId: 26, // Code Auditor / Security
        taskTitle: 'Security & Vulnerability Audit',
        taskPrompt: 'Analyze prompt schemas: {{prompt_spec}}. Identify potential injection vulnerabilities, zero-billing leaks, or schema drifts.',
        expectedOutputKey: 'security_audit',
        priority: 'CRITICAL' as PriorityLevel,
      },
      {
        nodeId: 'node_4',
        agentId: 36, // QA Analyst / Test Lead
        taskTitle: 'Consolidated Acceptance & Test Verification',
        taskPrompt: 'Synthesize all previous stage outputs [Arch: {{arch_spec}}, Security: {{security_audit}}] and produce automated test suites and validation checklist.',
        expectedOutputKey: 'qa_verification',
        priority: 'HIGH' as PriorityLevel,
      },
    ],
  },
  {
    id: 'market_intel_sprint',
    title: 'Market Intelligence & Content Strategy Engine',
    objective: 'Scan competitive landscape, analyze market sentiment, synthesize viral hooks, and generate structured social campaigns.',
    nodes: [
      {
        nodeId: 'node_1',
        agentId: 37, // Research Lead
        taskTitle: 'Market Trend & Competitive Research',
        taskPrompt: 'Analyze industry landscape and market opportunities for: {{mission_objective}}',
        expectedOutputKey: 'market_research',
        priority: 'HIGH' as PriorityLevel,
      },
      {
        nodeId: 'node_2',
        agentId: 1, // Content Strategist
        taskTitle: 'Content Funnel & Editorial Pillars',
        taskPrompt: 'Based on market research: {{market_research}}, create a 4-week multi-channel content funnel and engagement strategy.',
        expectedOutputKey: 'editorial_funnel',
        priority: 'HIGH' as PriorityLevel,
      },
      {
        nodeId: 'node_3',
        agentId: 29, // Copywriter / SEO
        taskTitle: 'Conversion Copy & Social Scripts',
        taskPrompt: 'Draft high-conversion viral hooks, technical threads, and newsletter copy based on: {{editorial_funnel}}',
        expectedOutputKey: 'conversion_copy',
        priority: 'MEDIUM' as PriorityLevel,
      },
    ],
  },
];

export const TaskDelegationStudio: React.FC<TaskDelegationStudioProps> = ({
  agents,
  onGenerateReport,
}) => {
  const [missionTitle, setMissionTitle] = useState<string>(PRESET_MISSIONS[0].title);
  const [missionObjective, setMissionObjective] = useState<string>(PRESET_MISSIONS[0].objective);
  const [missionPriority, setMissionPriority] = useState<PriorityLevel>('HIGH');
  const [nodes, setNodes] = useState<TaskDelegationNode[]>(
    PRESET_MISSIONS[0].nodes.map((n) => ({
      ...n,
      status: 'pending',
      dependsOn: [],
    }))
  );

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);

  const loadPreset = (presetId: string) => {
    const p = PRESET_MISSIONS.find((m) => m.id === presetId);
    if (!p) return;
    setMissionTitle(p.title);
    setMissionObjective(p.objective);
    setNodes(
      p.nodes.map((n) => ({
        ...n,
        status: 'pending',
        dependsOn: [],
      }))
    );
    setExecutionLogs([]);
  };

  const addNode = () => {
    const nextNum = nodes.length + 1;
    const defaultAgent = agents[Math.min(nextNum - 1, agents.length - 1)];
    const newNode: TaskDelegationNode = {
      nodeId: `node_${nextNum}`,
      agentId: defaultAgent.id,
      taskTitle: `Delegated Task ${nextNum}: ${defaultAgent.role_name}`,
      taskPrompt: `Process task using context from previous steps: {{node_${nextNum - 1}}}`,
      expectedOutputKey: `output_step_${nextNum}`,
      priority: 'HIGH',
      status: 'pending',
      dependsOn: nextNum > 1 ? [`node_${nextNum - 1}`] : [],
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (index: number) => {
    if (nodes.length <= 1) return;
    const updated = nodes.filter((_, idx) => idx !== index);
    setNodes(updated);
  };

  const updateNode = (index: number, updates: Partial<TaskDelegationNode>) => {
    const updated = [...nodes];
    updated[index] = { ...updated[index], ...updates };
    setNodes(updated);
  };

  const handleExecuteMission = async () => {
    if (!nodes.length) return;
    setIsExecuting(true);
    setErrorMsg(null);
    setExecutionLogs([]);

    try {
      const res = await fetch('/api/protocol/mission/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: missionTitle,
          objective: missionObjective,
          priority: missionPriority,
          nodes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Mission execution failed');
      }

      const data = await res.json();
      setExecutionLogs(data.logs || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mission execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
              <Workflow className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Dynamic Mission Delegation Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Multi-Agent Task Delegation Studio</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Assemble multi-module AI task delegation graphs. Every agent sequentially processes, validates, and hands off structured protocol envelopes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Load Preset:</span>
          {PRESET_MISSIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 transition-colors"
            >
              {p.title.split(' ')[0]} Sprint
            </button>
          ))}
        </div>
      </div>

      {/* Mission Objective Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mission Title
            </label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mission Priority
            </label>
            <select
              value={missionPriority}
              onChange={(e) => setMissionPriority(e.target.value as PriorityLevel)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="CRITICAL">CRITICAL (Top Swarm Queue)</option>
              <option value="HIGH">HIGH (Standard Production)</option>
              <option value="MEDIUM">MEDIUM (Balanced Async)</option>
              <option value="LOW">LOW (Background Sync)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Global Mission Objective (Available to all nodes via {'{{mission_objective}}'})
          </label>
          <textarea
            value={missionObjective}
            onChange={(e) => setMissionObjective(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Delegation Graph Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Workflow className="w-4 h-4 text-indigo-400" />
            <span>Delegation Chain Topology ({nodes.length} Stages)</span>
          </h3>

          <button
            onClick={addNode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Delegation Node</span>
          </button>
        </div>

        <div className="space-y-3">
          {nodes.map((node, index) => {
            const agent = agents.find((a) => a.id === node.agentId) || agents[0];
            const isLast = index === nodes.length - 1;

            return (
              <React.Fragment key={node.nodeId}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-indigo-500/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        STEP 0{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-800 text-indigo-400">
                          <AgentIcon name={agent.iconName} className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-white">{node.taskTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={node.agentId}
                        onChange={(e) => {
                          const id = parseInt(e.target.value, 10);
                          const ag = agents.find((a) => a.id === id);
                          updateNode(index, {
                            agentId: id,
                            taskTitle: ag ? `Delegated to: ${ag.role_name}` : node.taskTitle,
                          });
                        }}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-indigo-500"
                      >
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>
                            #{a.id.toString().padStart(2, '0')} - {a.role_name}
                          </option>
                        ))}
                      </select>

                      {nodes.length > 1 && (
                        <button
                          onClick={() => removeNode(index)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                          title="Remove Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Prompt Template */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Task Directive Template (Use {'{{variable_name}}'} for context injection):
                    </label>
                    <textarea
                      value={node.taskPrompt}
                      onChange={(e) => updateNode(index, { taskPrompt: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>Output Variable Key: <strong>{node.expectedOutputKey}</strong></span>
                    <span>Tools Required: {agent.tools_required.join(', ')}</span>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center">
                    <div className="p-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Execute Mission Button */}
        <div className="pt-2">
          <button
            id="btn-launch-mission"
            disabled={isExecuting || !nodes.length}
            onClick={handleExecuteMission}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:opacity-90 disabled:opacity-50 text-white shadow-xl shadow-indigo-950/50 transition-all cursor-pointer"
          >
            {isExecuting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Executing Multi-Agent Delegation Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Autonomous Mission ({nodes.length} Sequential Nodes)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mission Execution Results & Artifacts */}
      {executionLogs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Mission Execution Completed ({executionLogs.length} Stages Verified)
                </h3>
                <p className="text-[11px] text-slate-400">
                  All protocol envelopes successfully transmitted and artifacts synthesized.
                </p>
              </div>
            </div>

            {onGenerateReport && (
              <button
                onClick={() =>
                  onGenerateReport({
                    title: missionTitle,
                    objective: missionObjective,
                    logs: executionLogs,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Consolidated Mission Report</span>
              </button>
            )}
          </div>

          {/* Logs by stage */}
          <div className="space-y-3">
            {executionLogs.map((log, idx) => (
              <div
                key={log.nodeId || idx}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                      STEP 0{idx + 1}
                    </span>
                    <span className="font-bold text-white">{log.agentName}</span>
                    <span className="text-slate-400">({log.taskTitle})</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {log.durationMs}ms
                  </span>
                </div>

                {log.structuredJson ? (
                  <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-56">
                    {JSON.stringify(log.structuredJson, null, 2)}
                  </pre>
                ) : (
                  <div className="p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {log.output}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
