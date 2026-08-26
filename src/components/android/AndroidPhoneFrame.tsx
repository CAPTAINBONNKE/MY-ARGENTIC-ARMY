import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Bell,
  MessageSquare,
  MapPin,
  Camera,
  Folder,
  FileText,
  Settings,
  Sparkles,
  Zap,
  Cpu,
  ChevronLeft,
  Square,
  Circle,
  Triangle,
  RotateCcw,
  Volume2,
  Moon,
  Info,
  Radio,
  Sliders,
  X,
  Shield,
  Activity,
  Layers,
  Flame,
  Terminal
} from 'lucide-react';
import {
  AndroidNotification,
  DeviceLocation,
  VirtualFileItem,
  AccessibilityNode,
  KeepNoteItem
} from '../../types/androidAgent';
import { MessagesApp } from './apps/MessagesApp';
import { MapsApp } from './apps/MapsApp';
import { CameraApp } from './apps/CameraApp';
import { FilesApp } from './apps/FilesApp';
import { NotesApp } from './apps/NotesApp';
import { SettingsApp } from './apps/SettingsApp';

interface AndroidPhoneFrameProps {
  activePackage: string;
  onLaunchApp: (packageName: string) => void;
  notifications: AndroidNotification[];
  onDismissNotification: (id: string) => void;
  location: DeviceLocation;
  files: VirtualFileItem[];
  notes?: KeepNoteItem[];
  onAddNote?: (note: Partial<KeepNoteItem>) => void;
  onUpdateNote?: (id: string, updates: Partial<KeepNoteItem>) => void;
  onDeleteNote?: (id: string) => void;
  onTriggerAgentArmySync?: (prompt?: string) => Promise<void>;
  onReorderNotes?: (notes: KeepNoteItem[]) => void;
  flashlight: boolean;
  onToggleFlashlight: (val: boolean) => void;
  onTriggerAgentPrompt?: (prompt: string) => void;
  agentThought?: string;
  agentStatus?: 'idle' | 'thinking' | 'running' | 'completed' | 'error';
  accessibilityTree?: AccessibilityNode | null;
  onUpdateBattery?: (level: number, charging?: boolean) => void;
  batteryLevel?: number;
  isCharging?: boolean;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  activePackage,
  onLaunchApp,
  notifications,
  onDismissNotification,
  location,
  files,
  notes = [],
  onAddNote = () => {},
  onUpdateNote = () => {},
  onDeleteNote = () => {},
  onTriggerAgentArmySync,
  onReorderNotes,
  flashlight,
  onToggleFlashlight,
  onTriggerAgentPrompt,
  agentThought,
  agentStatus = 'idle',
  accessibilityTree,
  onUpdateBattery,
  batteryLevel = 88,
  isCharging = false,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isNotificationShadeOpen, setIsNotificationShadeOpen] = useState(false);
  const [showBatteryQuickControl, setShowBatteryQuickControl] = useState(false);
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);

  // Battery thresholds with JARVIS HUD glow
  const isLowBattery = batteryLevel <= 20;
  const isCriticalBattery = batteryLevel <= 10;
  
  const batteryColorClass = isCharging
    ? 'text-cyan-300'
    : isLowBattery
      ? 'text-rose-400'
      : 'text-cyan-400';

  const batteryBgFillClass = isCharging
    ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]'
    : isLowBattery
      ? 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'
      : 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]';

  const batteryBorderClass = isCharging
    ? 'border-cyan-400'
    : isLowBattery
      ? 'border-rose-400'
      : 'border-cyan-400/80';

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showBatteryQuickControl) {
      setShowBatteryQuickControl(false);
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickRipple({ x, y });
    setTimeout(() => setClickRipple(null), 500);
  };

  const getActiveAppTitle = () => {
    switch (activePackage) {
      case 'com.google.android.apps.messaging': return 'Messages // Comm Link';
      case 'com.google.android.apps.maps': return 'Maps // GPS Tactical Grid';
      case 'com.android.camera2': return 'CameraX // Visual Optics';
      case 'com.google.android.documentsui': return 'Documents // Core Storage';
      case 'com.google.android.keep': return 'Google Keep // Agent Army Matrix';
      case 'com.android.settings': return 'System Settings // Subsystems';
      default: return 'JARVIS Home HUD';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 relative select-none">
      {/* Outer Tactical Holographic Halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-amber-500/5 blur-2xl pointer-events-none" />

      {/* Titanium Mark-85 Armor Phone Frame */}
      <div 
        id="android-phone-chassis"
        className="w-[370px] h-[730px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[46px] p-3.5 shadow-[0_0_40px_rgba(0,240,255,0.2)] border-2 border-cyan-500/40 relative flex flex-col transition-all duration-300 ring-1 ring-cyan-400/30"
      >
        {/* Sci-Fi Decorative Corner Markings */}
        <div className="absolute top-2 left-4 text-[9px] font-mono text-cyan-400/60 tracking-widest">
          SYS // MK-85
        </div>
        <div className="absolute top-2 right-4 text-[9px] font-mono text-cyan-400/60 tracking-widest">
          CORE // LIVE
        </div>

        {/* Hardware Buttons on side */}
        <div className="absolute -right-[6px] top-28 w-[4px] h-10 bg-cyan-500/60 rounded-r shadow-[0_0_6px_#00F0FF]" />
        <div className="absolute -right-[6px] top-42 w-[4px] h-10 bg-cyan-500/60 rounded-r shadow-[0_0_6px_#00F0FF]" />
        <div className="absolute -right-[6px] top-60 w-[4px] h-14 bg-amber-500/80 rounded-r shadow-[0_0_6px_#FFB800]" />

        {/* Flashlight Indicator Glow */}
        {flashlight && (
          <div className="absolute -top-3 right-12 w-6 h-6 bg-cyan-400 rounded-full blur-md animate-pulse shadow-[0_0_15px_#00F0FF]" />
        )}

        {/* Screen Bezel / Hologram Display Glass */}
        <div 
          onClick={handleScreenClick}
          className="w-full h-full bg-slate-950 rounded-[36px] overflow-hidden flex flex-col relative border border-cyan-500/40 jarvis-scanline shadow-inner"
        >
          {/* Top Status Bar */}
          <div className="h-7 bg-slate-950/95 px-3.5 flex items-center justify-between z-40 select-none text-[11px] font-semibold text-cyan-200 border-b border-cyan-500/20 relative">
            {/* Time & ReAct Status */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold tracking-wider">{currentTime || '12:38'}</span>
              {agentStatus === 'running' && (
                <span className="flex items-center gap-1 text-[9px] text-cyan-300 bg-cyan-950/90 border border-cyan-400 px-1.5 py-0.2 rounded font-mono shadow-[0_0_8px_rgba(0,240,255,0.4)] animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" /> RE-ACT
                </span>
              )}
            </div>

            {/* Front Camera Sensor / Optical Node */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-cyan-500/60 flex items-center justify-center shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* System Status Indicators */}
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationShadeOpen(!isNotificationShadeOpen);
                }}
                className="relative text-cyan-400 hover:text-cyan-200 cursor-pointer"
                title="Open Tactical Notification Shade"
              >
                <Bell className="w-3.5 h-3.5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_6px_#FFB800] animate-ping" />
                )}
              </button>
              <span className="text-[10px] font-mono text-cyan-300">5G_HUD</span>
              <Wifi className="w-3 h-3 text-cyan-400" />
              
              {/* LIVE BATTERY STATUS INDICATOR */}
              <button
                id="status-bar-battery-indicator"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBatteryQuickControl(!showBatteryQuickControl);
                }}
                title={`Battery: ${batteryLevel}% • Click to calibrate`}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-cyan-950/60 transition-colors cursor-pointer group ${batteryColorClass}`}
              >
                {isCharging ? (
                  <Zap className="w-3 h-3 text-cyan-300 animate-pulse" />
                ) : isCriticalBattery ? (
                  <BatteryWarning className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-cyan-400" />
                )}

                <div className={`w-4 h-2 rounded-[2px] border ${batteryBorderClass} p-[1px] flex items-center relative`}>
                  <div 
                    style={{ width: `${Math.max(5, Math.min(100, batteryLevel))}%` }} 
                    className={`h-full rounded-[1px] transition-all duration-300 ${batteryBgFillClass}`}
                  />
                  <div className={`absolute -right-[2px] top-[2px] bottom-[2px] w-[1.5px] rounded-r-[1px] ${batteryBgFillClass}`} />
                </div>

                <span className="text-[10px] font-mono font-bold tracking-tight">
                  {batteryLevel}%
                </span>
              </button>
            </div>
          </div>

          {/* Quick Battery Simulation Popover */}
          {showBatteryQuickControl && (
            <div 
              id="battery-quick-control-popover"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-8 right-2 w-64 jarvis-panel rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-cyan-100 text-xs space-y-2.5 border-cyan-500/50"
            >
              <div className="jarvis-corner-tl" />
              <div className="jarvis-corner-tr" />
              <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/30">
                <span className="font-hud font-bold flex items-center gap-1.5 text-cyan-300 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> ARC REACTOR CALIBRATION
                </span>
                <button 
                  onClick={() => setShowBatteryQuickControl(false)}
                  className="p-1 text-cyan-400 hover:text-white rounded hover:bg-cyan-950"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Status Header Badge */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${isLowBattery ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'}`}>
                    {isCharging ? <Zap className="w-4 h-4 text-cyan-300" /> : <Battery className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`font-bold font-mono text-sm ${batteryColorClass}`}>
                      {batteryLevel}% {isCharging ? '(⚡ CHARGING)' : '(FUSION ONLINE)'}
                    </p>
                    <p className="text-[10px] text-cyan-400/80 font-mono">
                      State: {isLowBattery ? 'CRITICAL WARN (≤20%)' : 'OPTIMAL (CYAN)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Interactive Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                  <span>SET CORE OUTPUT</span>
                  <span className="font-bold text-cyan-400">{batteryLevel}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={batteryLevel}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (onUpdateBattery) onUpdateBattery(val, isCharging);
                  }}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-cyan-500/40"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400/80 font-mono block">QUICK PRESETS:</span>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => onUpdateBattery && onUpdateBattery(100, isCharging)}
                    className="p-1 rounded bg-slate-950 border border-cyan-500/40 hover:bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => onUpdateBattery && onUpdateBattery(50, isCharging)}
                    className="p-1 rounded bg-slate-950 border border-cyan-500/40 hover:bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => onUpdateBattery && onUpdateBattery(20, isCharging)}
                    className="p-1 rounded bg-slate-950 border border-rose-500/40 hover:bg-rose-950 text-rose-400 font-mono font-bold text-[10px]"
                  >
                    20%
                  </button>
                  <button
                    onClick={() => onUpdateBattery && onUpdateBattery(5, isCharging)}
                    className="p-1 rounded bg-slate-950 border border-rose-500/40 hover:bg-rose-950 text-rose-400 font-mono font-bold text-[10px]"
                  >
                    5%
                  </button>
                </div>
              </div>

              {/* Charge Toggle */}
              <button
                onClick={() => onUpdateBattery && onUpdateBattery(batteryLevel, !isCharging)}
                className={`w-full py-1.5 rounded font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCharging
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_#00F0FF]'
                    : 'bg-slate-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-950'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isCharging ? 'DISCONNECT ARC CHARGER' : 'CONNECT ARC CHARGER'}
              </button>
            </div>
          )}

          {/* Notification Shade */}
          {isNotificationShadeOpen && (
            <div 
              id="android-notification-shade"
              className="absolute inset-x-0 top-7 bottom-0 jarvis-panel z-50 flex flex-col p-3 divide-y divide-cyan-500/30 overflow-y-auto animate-in slide-in-from-top duration-200"
            >
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-hud font-bold text-cyan-300 flex items-center gap-1.5 tracking-wider">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" /> TACTICAL NOTIFICATION MATRIX ({notifications.length})
                </span>
                <button 
                  onClick={() => setIsNotificationShadeOpen(false)}
                  className="p-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-2 space-y-2 flex-1">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-xs space-y-1 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-200 flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3 text-cyan-400" />
                          {notif.appName}: {notif.title}
                        </span>
                        <span className="text-[10px] text-cyan-500 font-mono">{notif.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-sans">{notif.body}</p>
                      
                      {notif.actions && (
                        <div className="flex items-center gap-1.5 pt-1.5">
                          {notif.actions.map(act => (
                            <button
                              key={act.actionId}
                              onClick={() => {
                                if (onTriggerAgentPrompt) {
                                  onTriggerAgentPrompt(`Execute notification action: ${act.label}`);
                                }
                                setIsNotificationShadeOpen(false);
                              }}
                              className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 rounded text-[10px] text-cyan-300 font-mono font-semibold transition-colors cursor-pointer"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => onDismissNotification(notif.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-cyan-500/70 font-mono py-8">NO ACTIVE PROTOCOLS IN QUEUE</p>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-cyan-400/80">
                <span>NotificationListenerService: ACTIVE</span>
                <button 
                  onClick={() => setIsNotificationShadeOpen(false)}
                  className="text-cyan-300 hover:underline cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
            </div>
          )}

          {/* Active Screen Content (Apps or Holographic Home Launcher) */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {activePackage === 'com.android.launcher3' || !activePackage ? (
              // J.A.R.V.I.S. Sci-Fi Hologram Home Screen
              <div className="flex-1 flex flex-col justify-between p-4 jarvis-hex-pattern select-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                {/* Hologram Arc Widget & Time */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-extrabold font-hud text-cyan-200 tracking-wider jarvis-glow-text">
                        {currentTime || '12:38'}
                      </h1>
                      <p className="text-xs text-cyan-400/90 font-mono">
                        LOCATION: 37.7749° N, 122.4194° W • PROTOCOL 15
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                      <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                    </div>
                  </div>
                  
                  {/* Tactical ReAct Live HUD Pill */}
                  <div 
                    onClick={() => onTriggerAgentPrompt && onTriggerAgentPrompt('Access Google Keep on my phone and list all notes and sprint checklists')}
                    className="p-2.5 rounded-xl jarvis-panel flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-colors shadow-lg"
                  >
                    <div className="jarvis-corner-tl" />
                    <div className="jarvis-corner-tr" />
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-hud font-bold text-cyan-200">JARVIS RE-ACT CORE</p>
                        <p className="text-[10px] font-mono text-cyan-400/80 truncate max-w-[180px]">
                          {agentThought || 'Standby • 7 Subsystems Ready'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-cyan-950 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Tactical Holographic App Grid */}
                <div className="grid grid-cols-3 gap-3 my-auto pt-2">
                  <button
                    id="launcher-app-notes"
                    onClick={() => onLaunchApp('com.google.android.keep')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30 transition-all cursor-pointer group shadow-[0_0_12px_rgba(255,184,0,0.15)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-hud text-amber-300 font-bold tracking-wider truncate">KEEP NOTES</span>
                  </button>

                  <button
                    id="launcher-app-messages"
                    onClick={() => onLaunchApp('com.google.android.apps.messaging')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all cursor-pointer group shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform relative">
                      <MessageSquare className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono shadow-[0_0_6px_#F43F5E]">2</span>
                    </div>
                    <span className="text-[10px] font-hud text-cyan-300 font-bold tracking-wider truncate">MESSAGES</span>
                  </button>

                  <button
                    id="launcher-app-maps"
                    onClick={() => onLaunchApp('com.google.android.apps.maps')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all cursor-pointer group shadow-[0_0_12px_rgba(0,255,157,0.15)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-hud text-emerald-300 font-bold tracking-wider truncate">GPS TACTICAL</span>
                  </button>

                  <button
                    id="launcher-app-camera"
                    onClick={() => onLaunchApp('com.android.camera2')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/30 transition-all cursor-pointer group shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-hud text-purple-300 font-bold tracking-wider truncate">OPTICS CAM</span>
                  </button>

                  <button
                    id="launcher-app-files"
                    onClick={() => onLaunchApp('com.google.android.documentsui')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-blue-500/40 hover:border-blue-400 hover:bg-blue-950/30 transition-all cursor-pointer group shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                      <Folder className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-hud text-blue-300 font-bold tracking-wider truncate">STORAGE</span>
                  </button>

                  <button
                    id="launcher-app-settings"
                    onClick={() => onLaunchApp('com.android.settings')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-cyan-400 hover:bg-slate-900 transition-all cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-cyan-300 border border-cyan-500/30 shadow-md group-hover:scale-105 transition-transform">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-hud text-slate-300 font-bold tracking-wider truncate">SUBSYSTEMS</span>
                  </button>
                </div>

                {/* Bottom Tactical Dock */}
                <div className="p-2 rounded-2xl jarvis-panel flex items-center justify-around">
                  <button 
                    onClick={() => onLaunchApp('com.google.android.keep')}
                    className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:scale-110 transition-transform cursor-pointer"
                    title="Google Keep Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onLaunchApp('com.google.android.apps.messaging')}
                    className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:scale-110 transition-transform cursor-pointer"
                    title="Messages"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onLaunchApp('com.google.android.apps.maps')}
                    className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:scale-110 transition-transform cursor-pointer"
                    title="Maps Tactical"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onLaunchApp('com.android.camera2')}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:scale-110 transition-transform cursor-pointer"
                    title="CameraX"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onLaunchApp('com.android.settings')}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Running Application Frame
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                {/* Tactical App Title Bar */}
                <div className="h-8 bg-slate-950/95 border-b border-cyan-500/30 px-3 flex items-center justify-between text-xs text-cyan-300">
                  <div className="flex items-center gap-1.5 font-hud font-bold text-[11px] tracking-wider truncate">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00F0FF]" />
                    <span className="truncate">{getActiveAppTitle()}</span>
                  </div>
                  <button
                    onClick={() => onLaunchApp('com.android.launcher3')}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 cursor-pointer"
                  >
                    <span>EXIT</span>
                  </button>
                </div>

                {/* Subsystem App Component Viewport */}
                <div className="flex-1 overflow-hidden">
                  {activePackage === 'com.google.android.apps.messaging' && <MessagesApp />}
                  {activePackage === 'com.google.android.apps.maps' && <MapsApp location={location} />}
                  {activePackage === 'com.android.camera2' && <CameraApp />}
                  {activePackage === 'com.google.android.documentsui' && <FilesApp files={files} />}
                  {activePackage === 'com.google.android.keep' && (
                    <NotesApp
                      notes={notes}
                      onAddNote={onAddNote}
                      onUpdateNote={onUpdateNote}
                      onDeleteNote={onDeleteNote}
                      onTriggerAgentArmySync={onTriggerAgentArmySync}
                      onReorderNotes={onReorderNotes}
                      isAgentRunning={agentStatus === 'running' || agentStatus === 'thinking'}
                    />
                  )}
                  {activePackage === 'com.android.settings' && (
                    <SettingsApp 
                      flashlight={flashlight} 
                      onToggleFlashlight={onToggleFlashlight}
                      batteryLevel={batteryLevel}
                      isCharging={isCharging}
                      onUpdateBattery={onUpdateBattery}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="h-9 bg-slate-950/95 border-t border-cyan-500/20 px-8 flex items-center justify-around z-40">
            <button
              id="nav-back-button"
              onClick={() => onLaunchApp('com.android.launcher3')}
              className="p-2 text-cyan-400 hover:text-white transition-colors cursor-pointer"
              title="Back"
            >
              <Triangle className="w-3.5 h-3.5 -rotate-90 fill-current opacity-80" />
            </button>
            <button
              id="nav-home-button"
              onClick={() => onLaunchApp('com.android.launcher3')}
              className="p-2 text-cyan-400 hover:text-white transition-colors cursor-pointer"
              title="Home"
            >
              <Circle className="w-4 h-4 fill-current opacity-80" />
            </button>
            <button
              id="nav-recents-button"
              onClick={() => onLaunchApp('com.android.launcher3')}
              className="p-2 text-cyan-400 hover:text-white transition-colors cursor-pointer"
              title="Recent Apps"
            >
              <Square className="w-3.5 h-3.5 fill-current opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
