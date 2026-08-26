import React, { useState, useEffect } from 'react';
import {
  AgentProtocolEnvelope,
  ProtocolMessageType,
  PriorityLevel,
  AgentDefinition,
} from '../types';
import {
  Activity,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Terminal,
  Code2,
  Share2,
  Clock,
  Radio,
  FileCode2,
} from 'lucide-react';

interface ProtocolInspectorProps {
  agents: AgentDefinition[];
}

export const ProtocolInspector: React.FC<ProtocolInspectorProps> = ({ agents }) => {
  const [messages, setMessages] = useState<AgentProtocolEnvelope[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<AgentProtocolEnvelope | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/protocol/messages?limit=100');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (!selectedMessage && data.messages && data.messages.length > 0) {
          setSelectedMessage(data.messages[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredMessages = messages.filter((msg) => {
    const matchesType = selectedType === 'all' || msg.type === selectedType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      msg.messageId.toLowerCase().includes(q) ||
      msg.correlationId.toLowerCase().includes(q) ||
      msg.sender.role_name.toLowerCase().includes(q) ||
      (msg.receiver.role_name && msg.receiver.role_name.toLowerCase().includes(q)) ||
      (msg.payload.taskTitle && msg.payload.taskTitle.toLowerCase().includes(q));

    return matchesType && matchesSearch;
  });

  const handleCopyEnvelope = (envelope: AgentProtocolEnvelope) => {
    navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
    setCopiedId(envelope.messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type: ProtocolMessageType) => {
    switch (type) {
      case 'TASK_DISPATCH':
        return 'bg-cyan-950 text-cyan-300 border-cyan-700/60';
      case 'TASK_DELEGATE':
        return 'bg-indigo-950 text-indigo-300 border-indigo-700/60';
      case 'PAYLOAD_HANDOFF':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'STATUS_UPDATE':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'BROADCAST_SIGNAL':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'CONSENSUS_VOTE':
        return 'bg-purple-950 text-purple-300 border-purple-700/60';
      case 'ERROR_ALERT':
        return 'bg-rose-950 text-rose-300 border-rose-700/60';
      case 'HEALTH_PING':
        return 'bg-teal-950 text-teal-300 border-teal-700/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-800';
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950 border-rose-800 font-bold';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950 border-amber-800';
      case 'MEDIUM':
        return 'text-cyan-400 bg-cyan-950 border-cyan-800';
      case 'LOW':
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Standardized Communication Protocol
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Live Protocol Bus & Message Packet Tracer</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect real-time message envelopes, task delegation packets, correlation traces, and cryptographic verification tokens passing between AI modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              autoRefresh
                ? 'bg-emerald-950 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>{autoRefresh ? 'Live Streaming' : 'Paused'}</span>
          </button>

          <button
            disabled={isLoading}
            onClick={fetchMessages}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Bus</span>
          </button>
        </div>
      </div>

      {/* Protocol Inspector 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Message Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            {/* Search and Type Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by msg ID, corr ID, or agent..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1 scrollbar-thin">
                {['all', 'TASK_DISPATCH', 'TASK_DELEGATE', 'PAYLOAD_HANDOFF', 'STATUS_UPDATE', 'BROADCAST_SIGNAL', 'HEALTH_PING'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap font-mono transition-colors ${
                      selectedType === t
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Stream */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No protocol packets matched current filters.
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.messageId === msg.messageId;
                  const typeClass = getTypeBadge(msg.type);
                  const prioClass = getPriorityBadge(msg.priority);

                  return (
                    <div
                      key={msg.messageId}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-slate-850 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${typeClass}`}>
                          {msg.type}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${prioClass}`}>
                            {msg.priority}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {/* Sender -> Receiver */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <span className="truncate max-w-[120px]">{msg.sender.role_name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[120px] text-cyan-300">
                          {msg.receiver.role_name || `Agent #${msg.receiver.id}`}
                        </span>
                      </div>

                      {msg.payload.taskTitle && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {msg.payload.taskTitle}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                        <span>{msg.correlationId}</span>
                        {msg.telemetry.latencyMs ? <span>{msg.telemetry.latencyMs}ms</span> : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Packet Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMessage ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
              {/* Envelope Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getTypeBadge(selectedMessage.type)}`}>
                      {selectedMessage.type}
                    </span>
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      {selectedMessage.messageId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Timestamp: {new Date(selectedMessage.timestamp).toISOString()}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyEnvelope(selectedMessage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedId === selectedMessage.messageId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied JSON</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Envelope</span>
                    </>
                  )}
                </button>
              </div>

              {/* Protocol Flow Routing Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Protocol Routing & Node Topology
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin Node */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Origin / Sender</span>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{selectedMessage.sender.role_name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      ID: {selectedMessage.sender.id} &bull; {selectedMessage.sender.category || 'SYSTEM'}
                    </div>
                  </div>

                  {/* Destination Node */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Target / Receiver</span>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{selectedMessage.receiver.role_name || `Agent #${selectedMessage.receiver.id}`}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      ID: {selectedMessage.receiver.id}
                    </div>
                  </div>
                </div>

                {/* Correlation & Trace */}
                <div className="pt-2 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Correlation ID:</span>
                    <span className="text-cyan-300 font-bold">{selectedMessage.correlationId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Parent Msg ID:</span>
                    <span className="text-slate-300">{selectedMessage.parentId || 'ROOT'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Priority:</span>
                    <span className="text-slate-300">{selectedMessage.priority}</span>
                  </div>
                </div>
              </div>

              {/* Payload Inspection */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Message Payload & Structured Artifacts
                </span>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-3 font-mono">
                  {selectedMessage.payload.taskTitle && (
                    <div>
                      <span className="text-slate-500 block text-[10px]">TASK TITLE:</span>
                      <p className="text-white font-sans font-semibold">{selectedMessage.payload.taskTitle}</p>
                    </div>
                  )}

                  {selectedMessage.payload.taskDescription && (
                    <div>
                      <span className="text-slate-500 block text-[10px]">TASK DIRECTIVE / DESCRIPTION:</span>
                      <p className="text-slate-300 whitespace-pre-wrap font-sans text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {selectedMessage.payload.taskDescription}
                      </p>
                    </div>
                  )}

                  {selectedMessage.payload.intermediateArtifact && (
                    <div>
                      <span className="text-emerald-400 block text-[10px] font-bold">
                        INTERMEDIATE ARTIFACT OUTPUT:
                      </span>
                      <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 overflow-x-auto max-h-60">
                        {typeof selectedMessage.payload.intermediateArtifact === 'object'
                          ? JSON.stringify(selectedMessage.payload.intermediateArtifact, null, 2)
                          : String(selectedMessage.payload.intermediateArtifact)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Protocol Telemetry & Cryptographic Verification */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Protocol Verification & Cryptographic Stamp</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono pt-1 text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Channel Type:</span>
                    <span className="text-slate-200">{selectedMessage.telemetry.channel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Execution Latency:</span>
                    <span className="text-cyan-400 font-bold">{selectedMessage.telemetry.latencyMs || 0} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Crypto Signature:</span>
                    <span className="text-emerald-400 truncate block">{selectedMessage.telemetry.signature}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Select a message packet on the left to inspect detailed protocol envelope data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
