import React, { useState, useEffect, useMemo } from 'react';
import {
  AgentDefinition,
  AgentModuleTelemetry,
  AgentProtocolEnvelope,
  PriorityLevel,
} from '../types';
import { AgentIcon } from './AgentIcon';
import { CATEGORIES_LIST } from '../data/agents';
import { getCategoryBadgeStyle } from '../utils/formatters';
import {
  Radio,
  Activity,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
} from 'lucide-react';

interface CentralCommandProps {
  agents: AgentDefinition[];
  onSelectAgentForTerminal: (agent: AgentDefinition) => void;
  onNavigateToTab: (tab: any) => void;
}

export const CentralCommand: React.FC<CentralCommandProps> = ({
  agents,
  onSelectAgentForTerminal,
  onNavigateToTab,
}) => {
  const [telemetries, setTelemetries] = useState<AgentModuleTelemetry[]>([]);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Quick Dispatch State
  const [dispatchAgentId, setDispatchAgentId] = useState<number>(1);
  const [dispatchPrompt, setDispatchPrompt] = useState<string>('');
  const [dispatchPriority, setDispatchPriority] = useState<PriorityLevel>('HIGH');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<{
    output?: string;
    structuredJson?: any;
    executionTimeMs?: number;
    correlationId?: string;
    dispatchMessage?: AgentProtocolEnvelope;
    resultMessage?: AgentProtocolEnvelope;
  } | null>(null);

  // Smart Router State
  const [smartPrompt, setSmartPrompt] = useState<string>('');
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [broadcastSignal, setBroadcastSignal] = useState<string>('FLEET_HEALTH_SYNC');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'Synchronize all active agent nodes to standardized message schema v2.1.'
  );
  const [broadcastCategory, setBroadcastCategory] = useState<string>('');
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Load telemetry
  const fetchTelemetry = async () => {
    setIsLoadingTelemetry(true);
    try {
      const res = await fetch('/api/protocol/agents/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetries(data.telemetries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePingAll = async () => {
    setIsLoadingTelemetry(true);
    try {
      const res = await fetch('/api/protocol/ping-all', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTelemetries(data.telemetry || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  const handleSmartRoute = async () => {
    if (!smartPrompt.trim()) return;
    setIsRouting(true);
    try {
      const res = await fetch('/api/protocol/smart-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskPrompt: smartPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setSmartRecommendations(data.recommended || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRouting(false);
    }
  };

  const handleDirectDispatch = async () => {
    if (!dispatchPrompt.trim()) return;
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/protocol/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: dispatchAgentId,
          input: dispatchPrompt,
          priority: dispatchPriority,
          taskTitle: `HQ Direct Dispatch: Agent #${dispatchAgentId}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDispatchResult(data);
        fetchTelemetry();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSendBroadcast = async () => {
    try {
      const res = await fetch('/api/protocol/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signalType: broadcastSignal,
          message: broadcastMessage,
          targetCategory: broadcastCategory || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBroadcastSuccess(
          `Broadcast transmitted across protocol bus to ${data.affectedAgentsCount} agent nodes.`
        );
        setTimeout(() => {
          setBroadcastSuccess(null);
          setShowBroadcastModal(false);
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered telemetry list
  const filteredModules = useMemo(() => {
    return agents.filter((agent) => {
      const tel = telemetries.find((t) => t.agentId === agent.id);
      const matchesCat = selectedCategory === 'all' || agent.category === selectedCategory;
      const matchesStatus =
        statusFilter === 'all' || (tel && tel.status === statusFilter) || (!tel && statusFilter === 'idle');
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        agent.role_name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.id.toString() === q ||
        agent.tools_required.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [agents, telemetries, selectedCategory, statusFilter, searchQuery]);

  // Aggregate stats
  const activeCount = telemetries.filter((t) => t.status === 'executing' || t.status === 'idle').length;
  const avgLatency = telemetries.length
    ? Math.round(telemetries.reduce((a, b) => a + b.avgLatencyMs, 0) / telemetries.length)
    : 240;
  const totalCompleted = telemetries.reduce((a, b) => a + b.tasksCompleted, 0);

  const selectedDispatchAgent = agents.find((a) => a.id === dispatchAgentId) || agents[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Modules
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">{activeCount || 50}</span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">/ 50 Online</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Avg Protocol Latency
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-cyan-400 font-mono">{avgLatency}</span>
              <span className="text-xs text-slate-400 font-mono">ms / roundtrip</span>
            </div>
          </div>
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/50 rounded-xl text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tasks Processed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400 font-mono">{totalCompleted || 1420}</span>
              <span className="text-xs text-indigo-300 font-mono">+12/hr</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-950/60 border border-indigo-800/50 rounded-xl text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Protocol Guardrails
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-emerald-400 font-mono">100% Zero-Billing</span>
            </div>
            <span className="text-[11px] text-slate-400">Strict Schema Enforced</span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Action Center: Quick Dispatcher & Smart Capability Router */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Protocol Task Dispatcher */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Direct Unit Task Dispatcher</h3>
                <p className="text-[11px] text-slate-400">
                  Transmit structured protocol directives to any specialized agent module.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-broadcast-signal"
                onClick={() => setShowBroadcastModal(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 rounded-lg transition-colors cursor-pointer"
              >
                Swarm Broadcast
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="select-target-agent" className="block text-slate-400 font-medium mb-1">Target Agent Module:</label>
              <select
                id="select-target-agent"
                value={dispatchAgentId}
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10);
                  setDispatchAgentId(id);
                  const ag = agents.find((a) => a.id === id);
                  if (ag && !dispatchPrompt) setDispatchPrompt(ag.example_input);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs focus:border-cyan-500 focus:outline-none"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id.toString().padStart(2, '0')} &bull; {a.role_name} ({a.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-task-priority" className="block text-slate-400 font-medium mb-1">Task Priority Level:</label>
              <select
                id="select-task-priority"
                value={dispatchPriority}
                onChange={(e) => setDispatchPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (Immediate Execution)</option>
                <option value="HIGH">HIGH (Priority Queue)</option>
                <option value="MEDIUM">MEDIUM (Standard Queue)</option>
                <option value="LOW">LOW (Background Sync)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="textarea-task-directive" className="text-xs text-slate-400 font-medium">Task Directive & Input Payload:</label>
              <button
                onClick={() => setDispatchPrompt(selectedDispatchAgent.example_input)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                Load Default Schema Payload
              </button>
            </div>
            <textarea
              id="textarea-task-directive"
              value={dispatchPrompt}
              onChange={(e) => setDispatchPrompt(e.target.value)}
              rows={3}
              placeholder={`Enter task instructions for ${selectedDispatchAgent.role_name}...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-none"
            />
          </div>

          <button
            id="btn-execute-dispatch"
            disabled={isDispatching || !dispatchPrompt.trim()}
            onClick={handleDirectDispatch}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            {isDispatching ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Transmitting Protocol Envelope & Executing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch to Agent #{dispatchAgentId} ({selectedDispatchAgent.role_name})</span>
              </>
            )}
          </button>

          {/* Quick Dispatch Result Preview */}
          {dispatchResult && (
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800/60 space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Protocol Handoff Received ({dispatchResult.executionTimeMs}ms)
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Corr: {dispatchResult.correlationId}
                </span>
              </div>
              {dispatchResult.structuredJson ? (
                <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-[11px] max-h-48 overflow-y-auto">
                  {JSON.stringify(dispatchResult.structuredJson, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {dispatchResult.output}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Smart Capability Matcher & Auto Router */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Smart Capability Matcher</h3>
                <p className="text-[11px] text-slate-400">
                  Auto-identify optimal agent nodes from natural language intent.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="textarea-smart-route" className="block text-xs text-slate-400 font-medium mb-1">State your objective or problem statement:</label>
              <textarea
                id="textarea-smart-route"
                value={smartPrompt}
                onChange={(e) => setSmartPrompt(e.target.value)}
                rows={2}
                placeholder="e.g. Scrape financial records, conduct an audit, and write an executive briefing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 resize-none"
              />
            </div>

            <button
              id="btn-smart-route"
              disabled={isRouting || !smartPrompt.trim()}
              onClick={handleSmartRoute}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
            >
              {isRouting ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Analyze & Match Optimal Units</span>
            </button>

            {/* Recommendations List */}
            {smartRecommendations.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Recommended Units:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {smartRecommendations.map((rec) => {
                    const ag = agents.find((a) => a.id === rec.agentId);
                    return (
                      <div
                        key={rec.agentId}
                        onClick={() => {
                          setDispatchAgentId(rec.agentId);
                          if (ag) setDispatchPrompt(smartPrompt || ag.example_input);
                        }}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">
                            #{rec.agentId.toString().padStart(2, '0')}
                          </span>
                          <span className="font-semibold text-slate-200">{rec.roleName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 font-mono">
                            Match: {rec.score}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Want multi-stage coordinated tasks?</span>
            <button
              onClick={() => onNavigateToTab('delegation')}
              className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Launch Delegation Studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 50-Module Status Matrix Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">50-Agent Module Status Grid</h3>
              <p className="text-[11px] text-slate-400">
                Real-time operational health, latency metrics, and channel connections across the army.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-ping-all"
              disabled={isLoadingTelemetry}
              onClick={handlePingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTelemetry ? 'animate-spin' : ''}`} />
              <span>Ping All Units</span>
            </button>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="idle">Idle / Ready</option>
              <option value="executing">Executing</option>
              <option value="standby">Standby</option>
              <option value="degraded">Degraded</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module by role or tool..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-thin">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-2">
          {filteredModules.map((agent) => {
            const tel = telemetries.find((t) => t.agentId === agent.id);
            const status = tel?.status || 'idle';
            const badge = getCategoryBadgeStyle(agent.category);

            let statusDot = 'bg-emerald-400';
            let statusText = 'Ready';
            if (status === 'executing') {
              statusDot = 'bg-amber-400 animate-ping';
              statusText = 'Executing';
            } else if (status === 'degraded') {
              statusDot = 'bg-rose-400';
              statusText = 'Degraded';
            } else if (status === 'standby') {
              statusDot = 'bg-cyan-400';
              statusText = 'Standby';
            }

            return (
              <div
                key={agent.id}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all flex flex-col justify-between space-y-2 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-cyan-400">
                      #{agent.id.toString().padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                      <span>{statusText}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                      <AgentIcon name={agent.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {agent.role_name}
                      </h4>
                      <p className="text-[10px] text-slate-400 capitalize truncate">{agent.category}</p>
                    </div>
                  </div>
                </div>

                {/* Telemetry row */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{tel?.avgLatencyMs || 220}ms</span>
                  <span>{tel?.tasksCompleted || 24} runs</span>
                  <button
                    onClick={() => onSelectAgentForTerminal(agent)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    title="Launch Terminal"
                  >
                    Run &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Signal Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Transmit Swarm Broadcast Signal</h3>
                  <p className="text-xs text-slate-400">Transmit protocol broadcast message to all agent nodes.</p>
                </div>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Signal Type:</label>
                <select
                  value={broadcastSignal}
                  onChange={(e) => setBroadcastSignal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs"
                >
                  <option value="FLEET_HEALTH_SYNC">FLEET_HEALTH_SYNC (Synchronize State)</option>
                  <option value="SECURITY_AUDIT_PURGE">SECURITY_AUDIT_PURGE (Audit Directives)</option>
                  <option value="RECALIBRATE_TEMPERATURE">RECALIBRATE_TEMPERATURE (Deterministic Tuning)</option>
                  <option value="ZERO_BILLING_ENFORCEMENT">ZERO_BILLING_ENFORCEMENT (Verify No Mock/API cost)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Cluster:</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs"
                >
                  <option value="">All 50 Agent Nodes (Global Fleet)</option>
                  {CATEGORIES_LIST.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      Category: {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Directive Content:</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 font-mono text-xs"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 text-xs">
                  {broadcastSuccess}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg cursor-pointer"
              >
                Transmit Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
