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
  const [showApkGuide, setShowApkGuide] = useState(false);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApkGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold transition-all shadow-sm hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>BUILD_APK_GUIDE</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'SOURCE_COPIED' : 'COPY_KOTLIN'}</span>
          </button>
        </div>
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

      {/* APK & Mobile Installation Modal */}
      {showApkGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl max-w-2xl w-full p-5 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative max-h-[90vh] overflow-y-auto font-mono text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-hud font-bold text-base">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span>HOW TO RUN & INSTALL APK ON ANDROID</span>
              </div>
              <button
                onClick={() => setShowApkGuide(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Option 1: Instant Installation on Phone */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Method 1: Instant Standalone App on your Android Phone (0 Setup)</span>
              </div>
              <p className="text-xs text-cyan-100/90">
                You can install this app directly onto your Android home screen as a standalone full-screen app right now:
              </p>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-1">
                <li>Open this app link in <span className="text-cyan-300 font-bold">Google Chrome</span> on your Android phone.</li>
                <li>Tap the <span className="text-amber-300 font-bold">3 dots (Menu)</span> in the top-right of Chrome.</li>
                <li>Tap <span className="text-emerald-300 font-bold">"Install app"</span> or <span className="text-emerald-300 font-bold">"Add to Home screen"</span>.</li>
                <li>The J.A.R.V.I.S. Android OS app icon will appear in your app drawer with full hardware, camera, audio dictation, and Keep sync permissions!</li>
              </ol>
            </div>

            {/* Option 2: Build Standalone APK from Kotlin Codebase */}
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Method 2: Compile Native Android APK (Android Studio)</span>
              </div>
              <p className="text-xs text-purple-200/90">
                All production Kotlin files (<span className="text-cyan-300">AgentOrchestrator.kt</span>, <span className="text-amber-300">GoogleKeepTool.kt</span>, <span className="text-purple-300">CameraVisionTool.kt</span>, etc.) are available in this tab.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-purple-500/30 text-[11px] text-purple-200 overflow-x-auto space-y-1">
                <div>1. In Android Studio, select <span className="text-yellow-300">New Project &gt; Empty Activity</span> (Kotlin).</div>
                <div>2. Paste the provided Kotlin files into your <span className="text-cyan-300">app/src/main/java/com/jarvis/agent/</span> directory.</div>
                <div>3. Click <span className="text-emerald-300 font-bold">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</span>.</div>
                <div>4. Transfer the generated <span className="text-cyan-300 font-bold">app-debug.apk</span> to your phone and install!</div>
              </div>
            </div>

            {/* Option 3: One-Line TWA/Capacitor APK Generator */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Method 3: Build APK via CLI (Bubblewrap / Capacitor)</span>
              </div>
              <p className="text-xs text-slate-400">
                Run this command in terminal to convert the web application directly into a signed Android APK:
              </p>
              <pre className="bg-slate-900 p-2.5 rounded border border-cyan-500/30 text-[11px] text-emerald-300 overflow-x-auto">
                <code>npx @bubblewrap/cli init --manifest=https://ais-pre-kfaipvrdfreo4b5l4qqe5g-986726881102.europe-west2.run.app/manifest.json&#10;npx @bubblewrap/cli build</code>
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowApkGuide(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
              >
                Got It, Let's Go!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
