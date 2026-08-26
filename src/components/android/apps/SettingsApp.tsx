import React, { useState } from 'react';
import { Wifi, Bluetooth, MapPin, Moon, Shield, Volume2, Sun, Flashlight, Battery, Accessibility, BellRing, Cpu } from 'lucide-react';

interface SettingsAppProps {
  onToggleFlashlight?: (val: boolean) => void;
  flashlight?: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  onUpdateBattery?: (level: number, isCharging?: boolean) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ 
  onToggleFlashlight, 
  flashlight = false,
  batteryLevel: propBatteryLevel = 88,
  isCharging: propIsCharging = false,
  onUpdateBattery
}) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [location, setLocation] = useState(true);
  const [accessibilityService, setAccessibilityService] = useState(true);
  const [notificationListener, setNotificationListener] = useState(true);
  const [foregroundService, setForegroundService] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(propBatteryLevel);
  const [isCharging, setIsCharging] = useState(propIsCharging);
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(80);

  // Sync internal battery state if prop changes
  React.useEffect(() => {
    setBatteryLevel(propBatteryLevel);
  }, [propBatteryLevel]);

  React.useEffect(() => {
    setIsCharging(propIsCharging);
  }, [propIsCharging]);

  const handleBatteryChange = (newLevel: number) => {
    setBatteryLevel(newLevel);
    if (onUpdateBattery) {
      onUpdateBattery(newLevel, isCharging);
    }
  };

  const handleToggleCharging = (charging: boolean) => {
    setIsCharging(charging);
    if (onUpdateBattery) {
      onUpdateBattery(batteryLevel, charging);
    }
  };

  return (
    <div id="app-settings" className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800">
        <h2 className="text-sm font-bold text-slate-100">Settings & Android Services</h2>
        <p className="text-[10px] text-slate-400">Android 15 • Kernel 6.1-android-agent</p>
      </div>

      <div className="p-3 space-y-4">
        {/* Agent Services Group */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Agent Android Services
          </h3>
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 divide-y divide-slate-800/60 text-xs">
            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-slate-200">Accessibility Service</p>
                  <p className="text-[10px] text-slate-400">Enables agent UI inspection & clicks</p>
                </div>
              </div>
              <button
                onClick={() => setAccessibilityService(!accessibilityService)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  accessibilityService ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${accessibilityService ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold text-slate-200">Notification Listener</p>
                  <p className="text-[10px] text-slate-400">Intercepts alerts & RemoteInput</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationListener(!notificationListener)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  notificationListener ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationListener ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-semibold text-slate-200">Foreground Daemon Service</p>
                  <p className="text-[10px] text-slate-400">Keeps ReAct loop persistent</p>
                </div>
              </div>
              <button
                onClick={() => setForegroundService(!foregroundService)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  foregroundService ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${foregroundService ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Toggles */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Wireless & Hardware Controls
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setWifi(!wifi)}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                wifi ? 'bg-blue-950/40 border-blue-600/50 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-semibold">Wi-Fi (5GHz)</span>
              </div>
              <span className="text-[9px] font-mono">{wifi ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setBluetooth(!bluetooth)}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                bluetooth ? 'bg-indigo-950/40 border-indigo-600/50 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bluetooth className="w-4 h-4" />
                <span className="text-xs font-semibold">Bluetooth 5.3</span>
              </div>
              <span className="text-[9px] font-mono">{bluetooth ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setLocation(!location)}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                location ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold">GPS Location</span>
              </div>
              <span className="text-[9px] font-mono">{location ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => onToggleFlashlight && onToggleFlashlight(!flashlight)}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                flashlight ? 'bg-yellow-950/40 border-yellow-500/50 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flashlight className="w-4 h-4" />
                <span className="text-xs font-semibold">Flashlight</span>
              </div>
              <span className="text-[9px] font-mono">{flashlight ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Screen Brightness
              </span>
              <span className="font-mono text-slate-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Media & System Volume
              </span>
              <span className="font-mono text-slate-400">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Battery Health & Simulation Controls */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${batteryLevel > 20 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500 animate-pulse'}`}>
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Battery & Power Subsystem</p>
                <p className="text-[10px] text-slate-400">
                  {isCharging 
                    ? 'Fast charging active (9V / 2A)' 
                    : batteryLevel > 20 
                      ? `Normal status • ~${Math.round(batteryLevel * 0.16)} hrs remaining` 
                      : '⚠️ Low battery warning mode'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold font-mono ${batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-500'}`}>
                {batteryLevel}%
              </span>
              <span className="block text-[9px] text-slate-400 font-mono">
                {batteryLevel > 20 ? 'NORMAL (>20%)' : 'CRITICAL (≤20%)'}
              </span>
            </div>
          </div>

          {/* Battery level slider */}
          <div>
            <input
              type="range"
              min="1"
              max="100"
              value={batteryLevel}
              onChange={(e) => handleBatteryChange(Number(e.target.value))}
              className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${
                batteryLevel > 20 ? 'accent-emerald-400' : 'accent-rose-500'
              }`}
            />
          </div>

          {/* Preset Buttons & Charging Switch */}
          <div className="flex items-center justify-between pt-1 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">Presets:</span>
              <button
                onClick={() => handleBatteryChange(100)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono"
              >
                100%
              </button>
              <button
                onClick={() => handleBatteryChange(50)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono"
              >
                50%
              </button>
              <button
                onClick={() => handleBatteryChange(20)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 font-mono font-bold"
              >
                20% (Red)
              </button>
              <button
                onClick={() => handleBatteryChange(8)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-500 font-mono font-bold"
              >
                8% (Low)
              </button>
            </div>

            <button
              onClick={() => handleToggleCharging(!isCharging)}
              className={`px-2 py-0.5 rounded-full border transition-colors ${
                isCharging 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isCharging ? '⚡ Charging' : 'Plug In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
