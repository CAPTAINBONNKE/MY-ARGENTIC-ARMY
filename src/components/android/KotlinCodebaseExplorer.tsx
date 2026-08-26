import React, { useState } from 'react';
import {
  Code,
  Folder,
  FileCode,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Terminal,
  Shield,
  Download,
  Activity,
  Zap
} from 'lucide-react';
import { KOTLIN_FILES } from '../../data/kotlinCodebase';
import { KotlinFileDescriptor } from '../../types/androidAgent';

export const KotlinCodebaseExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<KotlinFileDescriptor>(KOTLIN_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'kotlin': true,
    'llm': true,
    'capabilities': true,
    'orchestrator': true,
    'tools': true,
    'services': true
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="kotlin-codebase-explorer" className="jarvis-panel rounded-2xl p-4 flex flex-col h-full shadow-[0_0_30px_rgba(0,240,255,0.15)] border-cyan-500/40">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-hud font-bold text-cyan-200 flex items-center gap-2 tracking-wider">
              <span>ANDROID KOTLIN ARCHITECTURE & PROTOCOL HUB</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/80 font-mono">
                KOTLIN_2.0 // COROUTINES
              </span>
            </h2>
            <p className="text-xs font-mono text-cyan-400/80">
              Modular Android Subsystems: Orchestrator, Tools, Google Keep Swarm, Hardware Services & LLMs
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'SOURCE_COPIED' : 'COPY_KOTLIN'}</span>
        </button>
      </div>

      {/* Main Grid: Architecture Tree on Left, Source Code Viewer on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3 flex-1 min-h-[480px]">
        {/* Left: Interactive Architecture Tree */}
        <div className="md:col-span-4 bg-slate-950/90 rounded-xl p-3 border border-cyan-500/30 flex flex-col overflow-y-auto text-xs space-y-1 select-none font-mono">
          <div className="font-hud font-bold text-cyan-300 uppercase tracking-wider text-[10px] pb-1 border-b border-cyan-500/30 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> ANDROID TREE MATRIX
          </div>

          {/* Root: Android App */}
          <div className="space-y-1 pt-1 text-xs">
            {/* 1. Kotlin Subsystem */}
            <div>
              <div 
                onClick={() => toggleFolder('kotlin')}
                className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-cyan-950/60 cursor-pointer text-cyan-200 font-bold"
              >
                {expandedFolders['kotlin'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5 text-cyan-600" />}
                <Folder className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kotlin Core</span>
              </div>

              {expandedFolders['kotlin'] && (
                <div className="pl-4 space-y-1 border-l border-cyan-500/30 ml-2">
                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'AgentOrchestrator.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'AgentOrchestrator.kt' ? 'bg-cyan-950 text-cyan-200 font-bold border border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    <span>Agent Orchestrator</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'ToolRegistry.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'ToolRegistry.kt' ? 'bg-cyan-950 text-cyan-200 font-bold border border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    <span>Tool/Action Registry</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'MemoryManager.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'MemoryManager.kt' ? 'bg-amber-950/80 text-amber-200 font-bold border border-amber-400 shadow-[0_0_8px_rgba(255,184,0,0.4)]' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-amber-400" />
                    <span>Memory (Room & Vector)</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'AccessibilityBridgeService.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'AccessibilityBridgeService.kt' ? 'bg-emerald-950 text-emerald-200 font-bold border border-emerald-400' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-emerald-400" />
                    <span>Accessibility Daemon</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'NotificationAgentService.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'NotificationAgentService.kt' ? 'bg-cyan-950 text-cyan-200 font-bold border border-cyan-400' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    <span>Notification Listener</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tools & Capabilities */}
            <div>
              <div 
                onClick={() => toggleFolder('capabilities')}
                className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-cyan-950/60 cursor-pointer text-cyan-200 font-bold"
              >
                {expandedFolders['capabilities'] ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5 text-cyan-600" />}
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kotlin Tools (7 Subsystems)</span>
              </div>

              {expandedFolders['capabilities'] && (
                <div className="pl-4 space-y-1 border-l border-cyan-500/30 ml-2">
                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'GoogleKeepTool.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'GoogleKeepTool.kt' ? 'bg-amber-950 text-amber-200 font-bold border border-amber-400 shadow-[0_0_8px_rgba(255,184,0,0.4)]' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-amber-400" />
                    <span>GoogleKeepTool.kt</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'CameraVisionTool.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'CameraVisionTool.kt' ? 'bg-purple-950 text-purple-200 font-bold border border-purple-400' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-purple-400" />
                    <span>CameraVisionTool.kt</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'LocationTacticalTool.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'LocationTacticalTool.kt' ? 'bg-emerald-950 text-emerald-200 font-bold border border-emerald-400' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-emerald-400" />
                    <span>LocationTacticalTool.kt</span>
                  </div>

                  <div
                    onClick={() => {
                      const f = KOTLIN_FILES.find(x => x.fileName === 'MessagingTool.kt');
                      if (f) setSelectedFile(f);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                      selectedFile.fileName === 'MessagingTool.kt' ? 'bg-blue-950 text-blue-200 font-bold border border-blue-400' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-blue-400" />
                    <span>MessagingTool.kt</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="md:col-span-8 bg-slate-950/90 rounded-xl border border-cyan-500/30 flex flex-col overflow-hidden">
          {/* File Header */}
          <div className="bg-slate-900/90 px-3.5 py-2 border-b border-cyan-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-cyan-200">{selectedFile.fileName}</span>
              <span className="text-[10px] text-cyan-500 font-mono">({selectedFile.package})</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              {selectedFile.language.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div className="p-2.5 bg-cyan-950/20 border-b border-cyan-500/20 text-xs font-mono text-cyan-300">
            {selectedFile.description}
          </div>

          {/* Source Code Content */}
          <pre className="flex-1 p-4 text-xs font-mono text-cyan-100 overflow-auto bg-slate-950/90 leading-relaxed selection:bg-cyan-500 selection:text-slate-950">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
