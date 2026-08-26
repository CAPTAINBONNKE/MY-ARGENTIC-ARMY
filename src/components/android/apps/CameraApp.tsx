import React, { useState, useRef, useEffect } from 'react';
import { Camera, SwitchCamera, Sparkles, Image as ImageIcon, Eye, Scan, CheckCircle2, RefreshCw } from 'lucide-react';

interface CameraAppProps {
  onCaptureAnalysis?: (result: any) => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onCaptureAnalysis }) => {
  const [lens, setLens] = useState<'BACK' | 'FRONT'>('BACK');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);
  const [visionReport, setVisionReport] = useState<any>({
    analysis: 'Viewfinder focused on workstation. Ready to snap frame or run multi-modal AI vision inspection.',
    objects: ['Laptop Display', 'Coffee Cup', 'Architectural Blueprint', 'Android Mobile'],
    ocrText: 'ANDROID AGENT OS - KOTLIN REACT ENGINE v2.6'
  });
  const [webcamActive, setWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize webcam stream if permitted
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: lens === 'BACK' ? 'environment' : 'user' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setWebcamActive(true);
          }
        }
      } catch (err) {
        // Camera permission denied or not available, fallback to high-res simulation
        setWebcamActive(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [lens]);

  const handleCapture = async () => {
    setIsCapturing(true);
    let capturedBase64: string | null = null;

    if (webcamActive && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          capturedBase64 = canvas.toDataURL('image/jpeg');
          setLastSnapshot(capturedBase64);
        }
      } catch (e) {
        console.warn('Webcam capture error', e);
      }
    }

    setTimeout(() => setIsCapturing(false), 200);

    // Call Gemini 2.5 Flash Vision API
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/android/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedBase64,
          query: 'Describe the scene, identify any visible text/code, and propose Android agent actions.'
        })
      });
      const data = await res.json();
      setVisionReport(data);
      if (onCaptureAnalysis) {
        onCaptureAnalysis(data);
      }
    } catch (e) {
      console.warn('Vision fetch error', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="app-camera" className="flex flex-col h-full bg-black text-slate-100 select-none relative overflow-hidden">
      {/* Top Overlay Bar */}
      <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between">
        <span className="text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-purple-300 font-mono flex items-center gap-1 border border-purple-500/30">
          <Eye className="w-3 h-3 text-purple-400" /> CameraX • {lens} Lens
        </span>
        <button
          onClick={() => setLens(prev => prev === 'BACK' ? 'FRONT' : 'BACK')}
          className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white"
        >
          <SwitchCamera className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
        {webcamActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          // Simulated Viewfinder Background
          <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-purple-950/40 flex flex-col items-center justify-center p-4">
            <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-purple-500/50 flex flex-col items-center justify-center p-4 text-center relative bg-purple-950/20 backdrop-blur-xs">
              <Scan className="w-10 h-10 text-purple-400 animate-pulse mb-2" />
              <p className="text-[11px] font-semibold text-purple-200">CameraX ImageAnalysis</p>
              <p className="text-[9px] text-slate-400 mt-1">Multi-modal OCR & Object Detection</p>
              
              {/* Corner focus brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-purple-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-purple-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-purple-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-400" />
            </div>
          </div>
        )}

        {/* Vision Detection Overlay Badges */}
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-slate-950/85 backdrop-blur-md rounded-xl p-2.5 border border-purple-500/30 text-xs shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {isAnalyzing ? 'Gemini 2.5 Flash Analyzing...' : 'Vision Intelligence'}
            </span>
            {isAnalyzing && <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
          </div>
          <p className="text-[11px] text-slate-200 line-clamp-2 leading-tight">
            {visionReport?.analysis || 'Point camera and tap shutter to analyze scene.'}
          </p>
          {visionReport?.objects && (
            <div className="flex items-center gap-1 mt-1.5 overflow-x-auto no-scrollbar">
              {visionReport.objects.slice(0, 3).map((obj: string, i: number) => (
                <span key={i} className="text-[9px] bg-purple-950/80 text-purple-300 border border-purple-800/60 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                  {obj}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Camera Controls Bottom Bar */}
      <div className="h-20 bg-slate-950 border-t border-slate-900 flex items-center justify-around px-4 z-20">
        <button 
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 overflow-hidden"
          title="Last Snapshot"
        >
          {lastSnapshot ? (
            <img src={lastSnapshot} alt="thumb" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        {/* Big Shutter Button */}
        <button
          id="btn-camera-shutter"
          onClick={handleCapture}
          disabled={isCapturing || isAnalyzing}
          className="w-14 h-14 rounded-full border-4 border-white/80 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <div className={`w-full h-full rounded-full ${isCapturing ? 'bg-purple-400' : 'bg-white'} transition-colors`} />
        </button>

        <button 
          onClick={handleCapture}
          className="p-2 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 hover:text-white"
          title="Ask Agent Vision"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
