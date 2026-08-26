import React, { useState } from 'react';
import {
  Smartphone,
  Bell,
  Camera,
  MapPin,
  Folder,
  Accessibility,
  Play,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Send,
  Eye,
  RefreshCw,
  Edit3,
  Bot,
  Sparkles,
  Plus,
  Zap,
  Shield,
  Activity,
  Terminal
} from 'lucide-react';
import { PhoneCapabilityType, DeviceLocation, KeepNoteItem } from '../../types/androidAgent';
import { TOOL_DEFINITIONS } from '../../data/kotlinCodebase';

interface CapabilitiesSandboxProps {
  onLaunchApp: (packageName: string) => void;
  onPostNotification: (title: string, body: string) => void;
  onUpdateLocation: (newLoc: Partial<DeviceLocation>) => void;
  location: DeviceLocation;
  onInspectAccessibility: () => void;
  onToggleFlashlight: (val: boolean) => void;
  flashlight: boolean;
  notes?: KeepNoteItem[];
  onAddNote?: (note: Partial<KeepNoteItem>) => void;
}

export const CapabilitiesSandbox: React.FC<CapabilitiesSandboxProps> = ({
  onLaunchApp,
  onPostNotification,
  onUpdateLocation,
  location,
  onInspectAccessibility,
  onToggleFlashlight,
  flashlight,
  notes = [],
  onAddNote = (_note: Partial<KeepNoteItem>) => {}
}) => {
  const [activeCap, setActiveCap] = useState<PhoneCapabilityType>('notes');
  const [notifTitle, setNotifTitle] = useState('Agent Alert: Calendar Sync');
  const [notifBody, setNotifBody] = useState('Meeting in 15 minutes with Dev Team.');
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);

  const capabilitiesList: Array<{ id: PhoneCapabilityType; name: string; icon: any; color: string; desc: string }> = [
    { id: 'notes', name: 'Google Keep & Notes', icon: Edit3, color: 'text-amber-300 bg-amber-950/80 border-amber-500/50', desc: 'ContentProvider, Agent Army Swarm Sync & Checklists' },
    { id: 'apps', name: 'Apps Subsystem', icon: Smartphone, color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50', desc: 'Intent Dispatcher, PackageManager & Deep Links' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-amber-300 bg-amber-950/80 border-amber-500/50', desc: 'NotificationListenerService & RemoteInput' },
    { id: 'camera', name: 'Camera & Vision', icon: Camera, color: 'text-purple-300 bg-purple-950/80 border-purple-500/50', desc: 'CameraX ImageAnalysis & Multi-Modal OCR' },
    { id: 'location', name: 'Location & GPS', icon: MapPin, color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50', desc: 'FusedLocationProviderClient & Geofencing' },
    { id: 'files', name: 'Files & Storage', icon: Folder, color: 'text-blue-300 bg-blue-950/80 border-blue-500/50', desc: 'MediaStore & Scoped Storage DocumentFile' },
    { id: 'accessibility', name: 'Accessibility Service', icon: Accessibility, color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50', desc: 'AccessibilityNodeInfo Tree & UI Touch Automation' },
  ];

  const currentTool = TOOL_DEFINITIONS.find(t => t.name.includes(activeCap));

  return (
    <div id="capabilities-sandbox-panel" className="jarvis-panel rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.15)] border-emerald-500/40">
      <div className="jarvis-corner-tl" />
      <div className="jarvis-corner-tr" />
      <div className="jarvis-corner-bl" />
      <div className="jarvis-corner-br" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(0,255,157,0.3)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-hud font-bold text-emerald-200 flex items-center gap-2 tracking-wider">
              <span>ANDROID 15 HARDWARE SUBSYSTEMS & CAPABILITIES</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/80 font-mono">
                7_ONLINE
              </span>
            </h2>
            <p className="text-xs font-mono text-emerald-400/80">
              Direct Kotlin API invocation for Google Keep, Optics, Location, Notifications, Files & Accessibility
            </p>
          </div>
        </div>
      </div>

      {/* Capability Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3">
        {capabilitiesList.map(cap => {
          const Icon = cap.icon;
          const isSelected = activeCap === cap.id;
          return (
            <button
              key={cap.id}
              onClick={() => {
                setActiveCap(cap.id);
                setLastActionResult(null);
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_12px_rgba(0,255,157,0.4)] ring-1 ring-emerald-400'
                  : 'bg-slate-950/80 border-slate-800 opacity-70 hover:opacity-100 hover:border-emerald-500/40'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${cap.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-hud font-bold text-slate-100 tracking-wider truncate w-full">
                {cap.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Capability Action Work Area */}
      <div className="mt-3 bg-slate-950/90 rounded-xl p-4 border border-emerald-500/30 space-y-3 font-mono">
        {currentTool && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/20 text-xs">
            <div>
              <span className="text-emerald-400 font-hud text-[10px]">KOTLIN SIGNATURE:</span>
              <span className="text-emerald-200 font-bold ml-2">{currentTool.kotlinSignature}</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono">ID: {currentTool.name}</span>
          </div>
        )}

        {/* 0. Google Keep & Notes Subsystem */}
        {activeCap === 'notes' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between font-sans">
              <p className="text-slate-300">Test Google Keep ContentProvider and Agent Army note synchronization:</p>
              <button
                onClick={() => onLaunchApp('com.google.android.keep')}
                className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-bold font-mono cursor-pointer"
              >
                <Play className="w-3 h-3" /> LAUNCH KEEP APP
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onLaunchApp('com.google.android.keep');
                  setLastActionResult(`Read ${notes.length} Google Keep notes via ContentProvider resolver.`);
                }}
                className="p-3 rounded-xl jarvis-panel border-amber-500/40 hover:border-amber-300 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-hud font-bold text-amber-300">1. List All Notes</span>
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Execute <code>GoogleKeepTool.list_notes()</code> across device database ({notes.length} active).
                </p>
              </button>

              <button
                onClick={() => {
                  onAddNote({
                    title: 'Agent Army: Tactical Deliverable',
                    content: 'Created via J.A.R.V.I.S. Capabilities Sandbox. Swarm verified zero-billing protocol.',
                    color: 'yellow',
                    pinned: true,
                    tags: ['AgentArmy', 'JARVIS'],
                    checklist: [
                      { id: `c_${Date.now()}_1`, text: 'Verify ReAct daemon loop', done: true },
                      { id: `c_${Date.now()}_2`, text: 'Test ContentProvider Keep bridge', done: true }
                    ],
                    authorAgent: {
                      agentId: 1,
                      roleName: 'AI Content Curator',
                      avatarIcon: 'Compass'
                    }
                  });
                  onLaunchApp('com.google.android.keep');
                  setLastActionResult('Agent Army successfully wrote new note with checklist to Google Keep.');
                }}
                className="p-3 rounded-xl jarvis-panel border-purple-500/40 hover:border-purple-300 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-hud font-bold text-purple-300">2. Army Swarm Note</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Dispatch Agent #01 to write structured checklist note directly into Keep.
                </p>
              </button>

              <button
                onClick={() => {
                  onLaunchApp('com.google.android.keep');
                  setLastActionResult('Searched Keep database for tag "#AgentArmy".');
                }}
                className="p-3 rounded-xl jarvis-panel border-cyan-500/40 hover:border-cyan-300 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-hud font-bold text-cyan-300">3. Filter #AgentArmy</span>
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Query ContentProvider with filter query: <code>tag == 'AgentArmy'</code>.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* 1. Apps Subsystem */}
        {activeCap === 'apps' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-300 font-sans">Trigger Android Intents to launch packages:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onLaunchApp('com.google.android.apps.messaging');
                  setLastActionResult('Intent launched: com.google.android.apps.messaging');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-950 cursor-pointer"
              >
                Launch Messages
              </button>
              <button
                onClick={() => {
                  onLaunchApp('com.google.android.apps.maps');
                  setLastActionResult('Intent launched: com.google.android.apps.maps');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-950 cursor-pointer"
              >
                Launch Google Maps
              </button>
              <button
                onClick={() => {
                  onLaunchApp('com.android.camera2');
                  setLastActionResult('Intent launched: com.android.camera2');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-950 cursor-pointer"
              >
                Launch CameraX
              </button>
            </div>
          </div>
        )}

        {/* 2. Notifications */}
        {activeCap === 'notifications' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-300 font-sans">Dispatch custom push notification via NotificationManager:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={notifTitle}
                onChange={e => setNotifTitle(e.target.value)}
                placeholder="Notification Title"
                className="p-2 rounded bg-slate-900 border border-amber-500/40 text-slate-100 flex-1 font-sans"
              />
              <button
                onClick={() => {
                  onPostNotification(notifTitle, notifBody);
                  setLastActionResult(`Notification dispatched: "${notifTitle}"`);
                }}
                className="px-4 py-2 rounded bg-amber-400 text-slate-950 font-bold font-hud text-xs cursor-pointer shadow-[0_0_10px_#FFB800]"
              >
                DISPATCH ALERT
              </button>
            </div>
          </div>
        )}

        {/* 3. Camera & Vision */}
        {activeCap === 'camera' && (
          <div className="space-y-2 text-xs font-sans">
            <p className="text-slate-300">CameraX Optical Analysis & Multi-modal Vision API:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onLaunchApp('com.android.camera2');
                  setLastActionResult('CameraX preview started with 60 FPS ImageAnalysis.');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-950 cursor-pointer"
              >
                Capture High-Res Frame
              </button>
              <button
                onClick={() => onToggleFlashlight(!flashlight)}
                className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  flashlight ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_#00F0FF]' : 'bg-slate-900 border border-cyan-500/40 text-cyan-300'
                }`}
              >
                {flashlight ? 'TORCH ACTIVE (ON)' : 'TOGGLE FLASHLIGHT'}
              </button>
            </div>
          </div>
        )}

        {/* 4. Location & GPS */}
        {activeCap === 'location' && (
          <div className="space-y-2 text-xs font-sans">
            <p className="text-slate-300">FusedLocationProviderClient GPS Simulation:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onUpdateLocation({ latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA (Market St)' });
                  setLastActionResult('GPS Coordinates updated to San Francisco.');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-950 cursor-pointer"
              >
                Set SF HQ (37.7749° N)
              </button>
              <button
                onClick={() => {
                  onUpdateLocation({ latitude: 40.7128, longitude: -74.0060, address: 'New York, NY (Broadway)' });
                  setLastActionResult('GPS Coordinates updated to New York.');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-950 cursor-pointer"
              >
                Set NYC Stark Tower (40.7128° N)
              </button>
            </div>
          </div>
        )}

        {/* 5. Files */}
        {activeCap === 'files' && (
          <div className="space-y-2 text-xs font-sans">
            <p className="text-slate-300">Scoped Storage & DocumentFile Content Resolver:</p>
            <button
              onClick={() => {
                onLaunchApp('com.google.android.documentsui');
                setLastActionResult('Opened Downloads folder with 4 strategy files.');
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-blue-500/40 text-blue-300 font-bold hover:bg-blue-950 cursor-pointer"
            >
              Browse Storage Hierarchy
            </button>
          </div>
        )}

        {/* 6. Accessibility */}
        {activeCap === 'accessibility' && (
          <div className="space-y-2 text-xs font-sans">
            <p className="text-slate-300">AccessibilityNodeInfo Tree Inspector & Autonomous Click Emulator:</p>
            <button
              onClick={() => {
                onInspectAccessibility();
                setLastActionResult('Extracted live AccessibilityNodeInfo hierarchy tree.');
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-950 cursor-pointer"
            >
              Inspect UI Node Hierarchy Tree
            </button>
          </div>
        )}

        {/* Action Output Feedback */}
        {lastActionResult && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono">{lastActionResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
