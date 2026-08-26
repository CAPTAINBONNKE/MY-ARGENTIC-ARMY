import React from 'react';
import { Shield, Zap, Cpu, Activity, Wifi, Radio } from 'lucide-react';

interface JarvisHudTelemetryProps {
  batteryLevel: number;
  isCharging: boolean;
  agentRunning: boolean;
  notesCount: number;
  notificationsCount: number;
  activePackage: string;
}

export const JarvisHudTelemetry: React.FC<JarvisHudTelemetryProps> = ({
  batteryLevel,
  isCharging,
  agentRunning,
  notesCount,
  notificationsCount,
  activePackage
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs select-none">
      {/* 1. ARC REACTOR OUTPUT */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>REACTOR CORE</span>
          <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-lg font-bold font-mono text-cyan-200">
            {batteryLevel}%
          </span>
          <span className="text-[10px] text-cyan-400/80 font-mono">
            {isCharging ? 'ARC_CHARGING' : 'FUSION_NOMINAL'}
          </span>
        </div>
        <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden mt-1 border border-cyan-500/30">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500 shadow-[0_0_8px_#00F0FF]"
            style={{ width: `${batteryLevel}%` }}
          />
        </div>
      </div>

      {/* 2. RE-ACT REASONING STATE */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>AI PROTOCOL</span>
          <Activity className={`w-3 h-3 ${agentRunning ? 'text-emerald-400 animate-spin' : 'text-cyan-400'}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`text-sm font-bold font-mono ${agentRunning ? 'text-emerald-300 animate-pulse' : 'text-cyan-200'}`}>
            {agentRunning ? 'ORCHESTRATING' : 'STANDBY_SCAN'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${agentRunning ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
          <span>DAEMON LOOP: READY</span>
        </div>
      </div>

      {/* 3. HARDWARE SUBSYSTEMS */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>HARDWARE GRID</span>
          <Shield className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-lg font-bold font-mono text-cyan-200">7 / 7</span>
          <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          GPS • CAM • NOTIF • KEEP
        </div>
      </div>

      {/* 4. KEEP & AGENT ARMY MEMORY */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>KEEP MEMORY</span>
          <Radio className="w-3 h-3 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-lg font-bold font-mono text-amber-300">{notesCount}</span>
          <span className="text-[10px] text-amber-400/80 font-mono">NOTES_ACTIVE</span>
        </div>
        <div className="text-[10px] font-mono text-amber-400/70 truncate">
          50-AGENT SWARM SYNCED
        </div>
      </div>

      {/* 5. ACTIVE TARGET INTERFACE */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>TARGET PACKAGE</span>
          <Cpu className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="mt-1.5 font-mono text-xs font-bold text-cyan-200 truncate">
          {activePackage ? activePackage.split('.').slice(-1)[0].toUpperCase() : 'HOMESCREEN'}
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          {notificationsCount} NOTIFICATIONS QUEUED
        </div>
      </div>

      {/* 6. NEURAL LINK FREQUENCY */}
      <div className="jarvis-panel rounded-lg p-2.5 flex flex-col justify-between border-cyan-500/30">
        <div className="jarvis-corner-tl" />
        <div className="jarvis-corner-tr" />
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-hud tracking-wider">
          <span>NEURAL LINK</span>
          <Wifi className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-lg font-bold font-mono text-cyan-200">5.8 GHz</span>
          <span className="text-[10px] text-cyan-400 font-mono">LAT_4ms</span>
        </div>
        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ENCRYPTED_TLS_V1.3</span>
        </div>
      </div>
    </div>
  );
};
