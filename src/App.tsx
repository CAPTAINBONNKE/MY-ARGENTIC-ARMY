import React, { useState } from 'react';
import { AndroidHeader, AndroidAppTab } from './components/android/AndroidHeader';
import { AndroidPhoneFrame } from './components/android/AndroidPhoneFrame';
import { AgentAssistantDrawer } from './components/android/AgentAssistantDrawer';
import { KotlinCodebaseExplorer } from './components/android/KotlinCodebaseExplorer';
import { MemoryInspector } from './components/android/MemoryInspector';
import { CapabilitiesSandbox } from './components/android/CapabilitiesSandbox';
import { LLMBenchmarkPanel } from './components/android/LLMBenchmarkPanel';
import { JarvisHudTelemetry } from './components/android/JarvisHudTelemetry';
import {
  INITIAL_APPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FILES,
  INITIAL_LOCATION,
  INITIAL_MEMORY,
  INITIAL_KEEP_NOTES
} from './data/androidInitialState';
import {
  AndroidNotification,
  DeviceLocation,
  VirtualFileItem,
  DeviceMemory,
  AgentExecutionSession,
  LLMProviderType,
  AccessibilityNode,
  KeepNoteItem
} from './types/androidAgent';
import { Smartphone, Sparkles, Code, Brain, Layers, Cpu, Terminal, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AndroidAppTab>('mobile_agent');
  const [activePackage, setActivePackage] = useState<string>('com.google.android.apps.messaging');
  const [notifications, setNotifications] = useState<AndroidNotification[]>(INITIAL_NOTIFICATIONS);
  const [location, setLocation] = useState<DeviceLocation>(INITIAL_LOCATION);
  const [files, setFiles] = useState<VirtualFileItem[]>(INITIAL_FILES);
  const [notes, setNotes] = useState<KeepNoteItem[]>(INITIAL_KEEP_NOTES);
  const [memory, setMemory] = useState<DeviceMemory>(INITIAL_MEMORY);
  const [flashlight, setFlashlight] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [llmProvider, setLlmProvider] = useState<LLMProviderType>('hybrid');
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [isArmySyncActive, setIsArmySyncActive] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<AgentExecutionSession | null>(null);
  const [isInspectingAccessibility, setIsInspectingAccessibility] = useState<boolean>(false);

  // Note management helpers
  const handleAddNote = (newNoteData: Partial<KeepNoteItem>) => {
    const newNote: KeepNoteItem = {
      id: `note_${Date.now()}`,
      title: newNoteData.title || 'Untitled Note',
      content: newNoteData.content || '',
      updated: 'Just now',
      color: newNoteData.color || 'yellow',
      pinned: newNoteData.pinned || false,
      tags: newNoteData.tags || ['Personal'],
      checklist: newNoteData.checklist || [],
      authorAgent: newNoteData.authorAgent
    };
    setNotes(prev => [newNote, ...prev]);

    // Also sync to backend keep notes API in background
    fetch('/api/android/keep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    }).catch(err => console.error('Failed to sync note to API:', err));
  };

  const handleUpdateNote = (id: string, updates: Partial<KeepNoteItem>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates, updated: 'Just now' } : note
      )
    );

    // Sync update to backend keep notes API
    fetch(`/api/android/keep/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.error('Failed to sync note update:', err));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));

    fetch(`/api/android/keep/${id}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to delete note on API:', err));
  };

  // Trigger Agent Army automated sync to Google Keep
  const handleTriggerAgentArmySync = async (prompt?: string) => {
    setIsArmySyncActive(true);
    const promptText = prompt || 'Generate Q3 Mobile Agent Strategy and task checklist';
    try {
      const res = await fetch('/api/android/keep/agent-army-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          agentCount: 50,
          targetTag: 'AgentArmy'
        })
      });
      const data = await res.json();
      if (data.note) {
        setNotes(prev => [data.note, ...prev.filter(n => n.id !== data.note.id)]);
        setActivePackage('com.google.android.keep');
      }
    } catch (e) {
      console.error('Agent army sync error:', e);
    } finally {
      setIsArmySyncActive(false);
    }
  };

  // Battery update helper
  const handleUpdateBattery = (level: number, charging: boolean = false) => {
    setBatteryLevel(level);
    setIsCharging(charging);
    setMemory(prev => ({
      ...prev,
      workingMemory: {
        ...prev.workingMemory,
        batteryLevel: level,
        isCharging: charging
      }
    }));
  };

  // App launcher helper
  const handleLaunchApp = (packageName: string) => {
    setActivePackage(packageName);
    setMemory(prev => ({
      ...prev,
      workingMemory: {
        ...prev.workingMemory,
        activeAppPackage: packageName
      }
    }));
  };

  // Notification dismiss helper
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Post notification helper
  const handlePostNotification = (title: string, body: string) => {
    const newNotif: AndroidNotification = {
      id: `notif_${Date.now()}`,
      packageName: 'com.android.agent',
      appName: 'Android Agent OS',
      title,
      body,
      timestamp: 'Just now',
      iconName: 'Bell',
      priority: 'HIGH'
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Add long-term memory helper
  const handleAddLongTermMemory = (key: string, value: string, category: any) => {
    const newMem = {
      id: `mem_${Date.now()}`,
      key,
      value,
      category,
      confidence: 0.99,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMemory(prev => ({
      ...prev,
      longTermMemory: [newMem, ...prev.longTermMemory]
    }));
  };

  // Execute user prompt through Android Kotlin ReAct Orchestrator API
  const handleExecutePrompt = async (prompt: string, provider: LLMProviderType) => {
    setIsAgentRunning(true);
    setIsInspectingAccessibility(false);

    // Record user turn in memory
    setMemory(prev => ({
      ...prev,
      shortTermHistory: [
        ...prev.shortTermHistory,
        {
          role: 'user',
          content: prompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));

    try {
      const response = await fetch('/api/android/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt,
          llmProvider: provider,
          deviceState: {
            activePackage,
            location,
            battery: memory.workingMemory.batteryLevel,
            network: memory.workingMemory.networkStatus,
            flashlight,
            notificationsCount: notifications.length,
            notesCount: notes.length,
            longTermMemory: memory.longTermMemory
          }
        })
      });

      const sessionResult: AgentExecutionSession = await response.json();
      setCurrentSession(sessionResult);

      // Apply physical device actions executed by the agent
      if (sessionResult.executedDeviceActions && sessionResult.executedDeviceActions.length > 0) {
        sessionResult.executedDeviceActions.forEach(action => {
          if (action.type === 'notes') {
            setActivePackage('com.google.android.keep');
            if (action.payload?.note) {
              const newOrUpdated = action.payload.note;
              setNotes(prev => [newOrUpdated, ...prev.filter(n => n.id !== newOrUpdated.id)]);
            }
          } else if (action.type === 'apps' && action.payload?.package) {
            setActivePackage(action.payload.package);
          } else if (action.type === 'apps' && action.payload?.thread) {
            setActivePackage('com.google.android.apps.messaging');
          } else if (action.type === 'location' && action.payload?.lat) {
            setLocation(prev => ({ ...prev, latitude: action.payload.lat, longitude: action.payload.lng }));
          } else if (action.type === 'accessibility') {
            setIsInspectingAccessibility(true);
            setTimeout(() => setIsInspectingAccessibility(false), 3000);
          } else if (action.type === 'camera') {
            setActivePackage('com.android.camera2');
          } else if (action.type === 'files') {
            setActivePackage('com.google.android.documentsui');
          }
        });
      }

      // Record assistant answer in memory
      if (sessionResult.finalAnswer) {
        setMemory(prev => ({
          ...prev,
          shortTermHistory: [
            ...prev.shortTermHistory,
            {
              role: 'assistant',
              content: sessionResult.finalAnswer || '',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }));
      }
    } catch (err: any) {
      console.error('Execution error:', err);
    } finally {
      setIsAgentRunning(false);
    }
  };

  return (
    <div className="min-h-screen jarvis-grid-bg text-cyan-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950">
      {/* Top J.A.R.V.I.S. HUD Navigation Header */}
      <AndroidHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        llmProvider={llmProvider}
        agentRunning={isAgentRunning}
        isArmySyncActive={isArmySyncActive}
      />

      {/* Main Tactical Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-4">
        {/* Live Top HUD Telemetry Strip */}
        <JarvisHudTelemetry
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          agentRunning={isAgentRunning}
          notesCount={notes.length}
          notificationsCount={notifications.length}
          activePackage={activePackage}
        />

        {/* Tab 1: Live Android Mobile Device & ReAct Agent Orchestrator */}
        {activeTab === 'mobile_agent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Interactive Android Device Chassis */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="mb-1.5 text-center">
                <span className="text-[10px] font-hud font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.2)] tracking-wider">
                  MARK-85 HOLOGRAPHIC EMULATOR
                </span>
              </div>
              <AndroidPhoneFrame
                activePackage={activePackage}
                onLaunchApp={handleLaunchApp}
                notifications={notifications}
                onDismissNotification={handleDismissNotification}
                location={location}
                files={files}
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onTriggerAgentArmySync={handleTriggerAgentArmySync}
                onReorderNotes={(reordered) => setNotes(reordered)}
                flashlight={flashlight}
                onToggleFlashlight={setFlashlight}
                onTriggerAgentPrompt={(p) => handleExecutePrompt(p, llmProvider)}
                agentStatus={isAgentRunning ? 'running' : 'idle'}
                agentThought={currentSession?.steps[0]?.thought}
                isInspectingAccessibility={isInspectingAccessibility}
                batteryLevel={batteryLevel}
                isCharging={isCharging}
                onUpdateBattery={handleUpdateBattery}
              />
            </div>

            {/* Right: Kotlin ReAct Orchestrator & Live Thought Stream */}
            <div className="lg:col-span-7 space-y-4">
              <AgentAssistantDrawer
                currentSession={currentSession}
                onExecutePrompt={handleExecutePrompt}
                isRunning={isAgentRunning}
                activeProvider={llmProvider}
                onChangeProvider={setLlmProvider}
              />

              {/* J.A.R.V.I.S. Subsystems Matrix Card */}
              <div className="p-3.5 rounded-2xl jarvis-panel text-xs space-y-2.5 border-cyan-500/30">
                <div className="jarvis-corner-tl" />
                <div className="jarvis-corner-tr" />
                <div className="flex items-center justify-between">
                  <h3 className="font-hud font-bold text-cyan-200 flex items-center gap-1.5 text-xs tracking-wider">
                    <Shield className="w-4 h-4 text-cyan-400" /> TACTICAL TOPOLOGY & DISPATCH MATRIX
                  </h3>
                  <button
                    onClick={() => setActiveTab('kotlin_architecture')}
                    className="text-cyan-300 hover:text-white font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>VIEW KOTLIN SOURCE</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-purple-500/30">
                    <span className="text-[9px] text-purple-300 font-hud font-bold block">1. KOTLIN ORCHESTRATOR</span>
                    <span className="text-slate-300 font-sans text-[11px]">ReAct Loop & Tool Registry</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-cyan-500/30">
                    <span className="text-[9px] text-cyan-300 font-hud font-bold block">2. DUAL LLM MATRIX</span>
                    <span className="text-slate-300 font-sans text-[11px]">Gemini 2.5 + Edge NPU</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-emerald-500/30">
                    <span className="text-[9px] text-emerald-300 font-hud font-bold block">3. 7 SUBSYSTEMS</span>
                    <span className="text-slate-300 font-sans text-[11px]">Keep, GPS, Optics, Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kotlin Source Code & Architecture Hub */}
        {activeTab === 'kotlin_architecture' && (
          <div className="flex-1 flex flex-col">
            <KotlinCodebaseExplorer />
          </div>
        )}

        {/* Tab 3: Device Memory Inspector (RAM & Room SQLite) */}
        {activeTab === 'memory_system' && (
          <div className="flex-1 flex flex-col">
            <MemoryInspector
              memory={memory}
              onAddMemory={handleAddLongTermMemory}
              onClearShortTerm={() => setMemory(prev => ({ ...prev, shortTermHistory: [] }))}
            />
          </div>
        )}

        {/* Tab 4: Phone Capabilities Sandbox */}
        {activeTab === 'capabilities' && (
          <div className="flex-1 flex flex-col">
            <CapabilitiesSandbox
              onLaunchApp={handleLaunchApp}
              onPostNotification={handlePostNotification}
              onUpdateLocation={(loc) => setLocation(prev => ({ ...prev, ...loc }))}
              location={location}
              onInspectAccessibility={() => {
                setIsInspectingAccessibility(true);
                setTimeout(() => setIsInspectingAccessibility(false), 3000);
              }}
              onToggleFlashlight={setFlashlight}
              flashlight={flashlight}
              notes={notes}
              onAddNote={handleAddNote}
            />
          </div>
        )}

        {/* Tab 5: LLM Inference Matrix & Benchmark */}
        {activeTab === 'llm_matrix' && (
          <div className="flex-1 flex flex-col">
            <LLMBenchmarkPanel
              activeProvider={llmProvider}
              onChangeProvider={setLlmProvider}
            />
          </div>
        )}
      </main>
    </div>
  );
}
