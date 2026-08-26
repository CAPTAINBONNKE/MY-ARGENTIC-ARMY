import React, { useState } from 'react';
import { Sparkles, Play, ShieldAlert, Code2, Copy, Check } from 'lucide-react';

export const PromptLab: React.FC = () => {
  const [rawPrompt, setRawPrompt] = useState<string>(
    'Look through this tech changelog and give me a summary of breaking changes and what users should do.'
  );
  const [targetModel, setTargetModel] = useState<string>('qwen2.5:14b / gemini-3.7-flash');
  const [includeFewShot, setIncludeFewShot] = useState<boolean>(true);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedResult, setOptimizedResult] = useState<string | null>(null);
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleOptimize = async () => {
    if (!rawPrompt.trim()) return;

    setIsOptimizing(true);
    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt,
          targetModel,
          includeFewShot,
        }),
      });

      const data = await response.json();
      setOptimizedResult(data.optimized || '');
      setParsedJson(data.parsed || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedResult) return;
    navigator.clipboard.writeText(optimizedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                POWERED BY AGENT #04
              </span>
              <span className="text-xs text-slate-400">AI Prompt Engineer</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">Prompt Engineering & Structured Schema Lab</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Transform informal, ambiguous natural language prompts into hardened, schema-enforced instructions with few-shot examples, hallucination prevention, and injection defense.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw Input and Options */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Draft Prompt (Unstructured)
              </span>
            </div>

            <textarea
              id="raw-prompt-textarea"
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              rows={8}
              placeholder="Paste raw instructions to be optimized..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-y"
            />

            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Target Deployment Runtime:
                </label>
                <select
                  value={targetModel}
                  onChange={(e) => setTargetModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs"
                >
                  <option value="qwen2.5:14b / gemini-3.7-flash">
                    Qwen 2.5:14B / Gemini 3.7 Flash (Hybrid Engine)
                  </option>
                  <option value="ollama-edge-7b">Ollama Edge 7B (High-Compression Schema)</option>
                  <option value="openai-gpt4o-mini">OpenAI GPT-4o-mini / Enterprise Proxy</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="few-shot-check"
                  checked={includeFewShot}
                  onChange={(e) => setIncludeFewShot(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                />
                <label htmlFor="few-shot-check" className="text-slate-300">
                  Include 1-2 Few-Shot Grounding Examples
                </label>
              </div>
            </div>

            <button
              id="optimize-prompt-btn"
              disabled={isOptimizing || !rawPrompt.trim()}
              onClick={handleOptimize}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Synthesizing Hardened Prompt Specification...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Optimize Prompt via Agent #04</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Optimized Specification */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" /> Hardened Machine Prompt Specification
              </span>
              {optimizedResult && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Hardened Spec</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 mt-4">
              {optimizedResult ? (
                <div className="space-y-4">
                  {parsedJson ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                          System Instruction & Persona:
                        </span>
                        <p className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
                          {parsedJson.optimized_prompt || JSON.stringify(parsedJson, null, 2)}
                        </p>
                      </div>

                      {parsedJson.expected_schema && (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            Expected JSON Schema:
                          </span>
                          <pre className="text-xs font-mono text-emerald-300">
                            {JSON.stringify(parsedJson.expected_schema, null, 2)}
                          </pre>
                        </div>
                      )}

                      {parsedJson.injection_risks && (
                        <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900/60 flex items-start gap-2 text-xs text-amber-200">
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block mb-0.5">Injection & Drift Risk Analysis:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-amber-300/90 font-mono text-[11px]">
                              {Array.isArray(parsedJson.injection_risks)
                                ? parsedJson.injection_risks.map((r: string, idx: number) => (
                                    <li key={idx}>{r}</li>
                                  ))
                                : String(parsedJson.injection_risks)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {optimizedResult}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-24 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl p-8">
                  <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
                  <h4 className="text-xs font-semibold text-slate-400">Awaiting Prompt Optimization</h4>
                  <p className="text-xs text-slate-600 max-w-sm mt-1">
                    Enter any unformatted task prompt on the left and click optimize to generate production-grade prompts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
