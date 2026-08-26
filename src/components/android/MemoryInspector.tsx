import React, { useState } from 'react';
import {
  Brain,
  HardDrive,
  Database,
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Zap,
  Battery,
  Wifi,
  Volume2,
  Layers,
  Search,
  Activity,
  Radio
} from 'lucide-react';
import { DeviceMemory } from '../../types/androidAgent';

interface MemoryInspectorProps {
  memory: DeviceMemory;
  onAddMemory?: (key: string, value: string, category: any) => void;
  onClearShortTerm?: () => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  memory,
  onAddMemory,
  onClearShortTerm
}) => {
  const [activeTab, setActiveTab] = useState<'working' | 'shortTerm' | 'longTerm'>('working');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCat, setNewCat] = useState<'user_preference' | 'contact_info' | 'frequent_place' | 'routine'>('user_preference');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveLongTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    if (onAddMemory) {
      onAddMemory(newKey, newValue, newCat);
    }
    setNewKey('');
    setNewValue('');
    setShowAddForm(false);
  };

  return (
    <div id="memory-inspector-panel" className="jarvis-panel rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.15)] border-amber-500/40">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(255,184,0,0.3)]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-hud font-bold text-amber-200 flex items-center gap-2 tracking-wider">
              <span>J.A.R.V.I.S. MULTI-TIER DEVICE MEMORY MATRIX</span>
              <span className="text-[9px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/80 font-mono">
                ROOM_DB // RAM_CACHE
              </span>
            </h2>
            <p className="text-xs font-mono text-amber-400/80">
              Working Volatile State, ReAct Short-Term History & SQLite/Room Persistent Embeddings
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-amber-500/40 text-xs">
          <button
            onClick={() => setActiveTab('working')}
            className={`px-3 py-1.5 rounded-lg font-hud text-[10px] tracking-wider transition-all cursor-pointer ${
              activeTab === 'working'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_#FFB800]'
                : 'text-amber-300/80 hover:text-white hover:bg-amber-950'
            }`}
          >
            VOLATILE RAM
          </button>
          <button
            onClick={() => setActiveTab('shortTerm')}
            className={`px-3 py-1.5 rounded-lg font-hud text-[10px] tracking-wider transition-all cursor-pointer ${
              activeTab === 'shortTerm'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_#FFB800]'
                : 'text-amber-300/80 hover:text-white hover:bg-amber-950'
            }`}
          >
            RE-ACT TRACE ({memory.shortTermHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('longTerm')}
            className={`px-3 py-1.5 rounded-lg font-hud text-[10px] tracking-wider transition-all cursor-pointer ${
              activeTab === 'longTerm'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_#FFB800]'
                : 'text-amber-300/80 hover:text-white hover:bg-amber-950'
            }`}
          >
            PERSISTENT ROOM ({memory.longTermMemory.length})
          </button>
        </div>
      </div>

      {/* Main Memory Content */}
      <div className="pt-4 flex-1">
        {/* TAB 1: Volatile Working Memory */}
        {activeTab === 'working' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="jarvis-panel p-3 rounded-xl border-amber-500/30 space-y-2 font-mono">
              <div className="text-[10px] font-hud text-amber-300 flex items-center justify-between">
                <span>ACTIVE PROCESS</span>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-sm font-bold text-amber-100 truncate">
                {memory.workingMemory.activeAppPackage || 'com.android.launcher3'}
              </p>
              <p className="text-[10px] text-amber-400/80">Foreground Activity Stack</p>
            </div>

            <div className="jarvis-panel p-3 rounded-xl border-amber-500/30 space-y-2 font-mono">
              <div className="text-[10px] font-hud text-amber-300 flex items-center justify-between">
                <span>FUSION BATTERY</span>
                <Battery className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-sm font-bold text-amber-100">
                {memory.workingMemory.batteryLevel}% {memory.workingMemory.isCharging ? '(⚡ CHARGING)' : ''}
              </p>
              <p className="text-[10px] text-amber-400/80">Subsystem Power Grid</p>
            </div>

            <div className="jarvis-panel p-3 rounded-xl border-amber-500/30 space-y-2 font-mono">
              <div className="text-[10px] font-hud text-amber-300 flex items-center justify-between">
                <span>GPS POSITION</span>
                <Radio className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-sm font-bold text-amber-100 truncate">
                {memory.workingMemory.currentLocation?.address || 'San Francisco, CA'}
              </p>
              <p className="text-[10px] text-amber-400/80">Coordinates Fixed</p>
            </div>
          </div>
        )}

        {/* TAB 2: Short-Term History */}
        {activeTab === 'shortTerm' && (
          <div className="space-y-2 font-mono text-xs max-h-[420px] overflow-y-auto">
            {memory.shortTermHistory.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-amber-400">
                  <span className="font-hud font-bold uppercase">{item.role}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-slate-100 text-xs font-sans leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Long-Term Persistent Memory */}
        {activeTab === 'longTerm' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-amber-500/20">
              <span className="text-amber-300 font-hud text-xs">PERSISTENT USER KNOWLEDGE GRAPH</span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> ADD ENTRY
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSaveLongTerm} className="p-3 rounded-xl jarvis-panel border-amber-400 space-y-2">
                <input
                  type="text"
                  placeholder="Key (e.g. favorite_coffee)"
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  className="w-full p-2 rounded bg-slate-950 border border-amber-500/40 text-amber-100 text-xs font-sans"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Oat Milk Flat White)"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full p-2 rounded bg-slate-950 border border-amber-500/40 text-amber-100 text-xs font-sans"
                />
                <button type="submit" className="w-full py-1.5 rounded bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
                  SAVE TO ROOM DATABASE
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto">
              {memory.longTermMemory.map((entry, idx) => (
                <div key={idx} className="p-3 rounded-xl jarvis-panel border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-400">
                    <span className="font-hud font-bold">{entry.key.toUpperCase()}</span>
                    <span className="bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/50">{entry.category}</span>
                  </div>
                  <p className="text-slate-100 text-xs font-sans">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
