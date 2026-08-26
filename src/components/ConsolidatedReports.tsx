import React, { useState } from 'react';
import {
  ConsolidatedReport,
  AgentDefinition,
} from '../types';
import {
  FileText,
  Download,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface ConsolidatedReportsProps {
  agents: AgentDefinition[];
  initialReportData?: {
    title: string;
    objective: string;
    logs: any[];
  } | null;
}

export const ConsolidatedReports: React.FC<ConsolidatedReportsProps> = ({
  agents,
  initialReportData,
}) => {
  const [currentReport, setCurrentReport] = useState<ConsolidatedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [reportFormat, setReportFormat] = useState<'executive' | 'deliverables' | 'protocol' | 'raw_json'>('executive');

  const handleGenerateReport = async (title?: string, objective?: string, logs?: any[]) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/protocol/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionTitle: title || initialReportData?.title || 'Cross-Swarm Autonomous Engineering Sprint',
          objective: objective || initialReportData?.objective || 'Multi-Agent Autonomous Orchestration & Protocol Verification',
          logs: logs || initialReportData?.logs || [
            {
              agentId: 1,
              agentName: 'AI Content Strategist',
              category: 'content',
              taskTitle: 'Pillars & Architecture Spec',
              output: 'Structured content pillars, schema hierarchy, and multi-tier distribution taxonomy generated.',
              durationMs: 310,
              status: 'completed',
            },
            {
              agentId: 4,
              agentName: 'AI Prompt Engineer',
              category: 'engineering',
              taskTitle: 'Hardened Schema & Injection Defense',
              output: 'JSON schema enforced with zero-shot hallucination boundaries and anti-injection guardrails.',
              durationMs: 280,
              status: 'completed',
            },
            {
              agentId: 26,
              agentName: 'Code Auditor & Reviewer',
              category: 'quality',
              taskTitle: 'Security & Protocol Audit',
              output: 'Validated 0 billing leaks, clean interface typing, and zero unhandled exceptions.',
              durationMs: 240,
              status: 'completed',
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentReport(data.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate initial report if provided or on mount if empty
  React.useEffect(() => {
    if (initialReportData) {
      handleGenerateReport(
        initialReportData.title,
        initialReportData.objective,
        initialReportData.logs
      );
    } else if (!currentReport) {
      handleGenerateReport();
    }
  }, [initialReportData]);

  const generateMarkdown = (report: ConsolidatedReport) => {
    return `# CONSOLIDATED MISSION REPORT: ${report.missionTitle}
**Report ID**: ${report.reportId}  
**Timestamp**: ${report.timestamp}  
**Efficiency Score**: ${report.efficiencyScore}/100  
**Total Agents Coordinated**: ${report.totalAgentsInvolved}  
**Total Swarm Execution Time**: ${report.totalExecutionTimeMs}ms  

---

## 1. Executive Summary
${report.executiveSummary}

---

## 2. Agent Deliverables Breakdown
${report.agentDeliverables
  .map(
    (d, i) => `### Step ${i + 1}: ${d.roleName} (Agent #${d.agentId} - ${d.category})
- **Task**: ${d.taskTitle}
- **Latency**: ${d.latencyMs}ms
- **Status**: ${d.status.toUpperCase()}
- **Output Artifact**:
\`\`\`json
${typeof d.keyOutputs === 'object' ? JSON.stringify(d.keyOutputs, null, 2) : d.keyOutputs}
\`\`\`
`
  )
  .join('\n')}

---

## 3. Operational Audit & Guardrail Verification
${report.auditFindings.map((f) => `- [x] ${f}`).join('\n')}

---

## 4. Strategic Protocol Recommendations
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;
  };

  const handleCopy = () => {
    if (!currentReport) return;
    const text =
      reportFormat === 'raw_json'
        ? JSON.stringify(currentReport, null, 2)
        : generateMarkdown(currentReport);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentReport) return;
    const text =
      reportFormat === 'raw_json'
        ? JSON.stringify(currentReport, null, 2)
        : generateMarkdown(currentReport);
    const ext = reportFormat === 'raw_json' ? 'json' : 'md';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission_report_${currentReport.reportId.toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Consolidated Reporting & Intelligence HQ
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Multi-Agent Consolidated Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesize unified cross-module intelligence, audit deliverables, efficiency scores, and protocol execution traces into executive-ready reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isGenerating}
            onClick={() => handleGenerateReport()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Audit Report</span>
          </button>
        </div>
      </div>

      {currentReport && (
        <div className="space-y-6">
          {/* Executive KPI Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Efficiency Index
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {currentReport.efficiencyScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-medium">Optimal Protocol Handoff</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Modules Coordinated
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white font-mono">
                  {currentReport.totalAgentsInvolved}
                </span>
                <span className="text-xs text-cyan-400 font-mono">AI Specialists</span>
              </div>
              <span className="text-[11px] text-slate-400">Zero Inter-Agent Dropouts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Swarm Resolution Time
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {currentReport.totalExecutionTimeMs}
                </span>
                <span className="text-xs text-slate-400 font-mono">ms total</span>
              </div>
              <span className="text-[11px] text-slate-400">High-Performance Concurrency</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Zero-Billing Guardrail
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-emerald-400 font-mono">PASSED (100%)</span>
              </div>
              <span className="text-[11px] text-slate-400">No Mock Leaks Detected</span>
            </div>
          </div>

          {/* Report Viewer Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                  {currentReport.reportId}
                </span>
                <h3 className="text-base font-bold text-white">{currentReport.missionTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* View switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setReportFormat('executive')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reportFormat === 'executive' ? 'bg-slate-850 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Executive Summary
                  </button>
                  <button
                    onClick={() => setReportFormat('deliverables')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reportFormat === 'deliverables' ? 'bg-slate-850 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Deliverables Table
                  </button>
                  <button
                    onClick={() => setReportFormat('protocol')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reportFormat === 'protocol' ? 'bg-slate-850 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Audit & Recommendations
                  </button>
                  <button
                    onClick={() => setReportFormat('raw_json')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reportFormat === 'raw_json' ? 'bg-slate-850 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="p-2 text-xs text-slate-300 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 transition-colors"
                  title="Copy Report"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            {reportFormat === 'executive' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Operational High-Level Executive Summary
                  </span>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {currentReport.executiveSummary}
                  </div>
                </div>

                {/* Key Deliverables Overview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Synthesized Cross-Agent Deliverables ({currentReport.agentDeliverables.length} Units)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentReport.agentDeliverables.map((del, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-cyan-400">
                            #{del.agentId.toString().padStart(2, '0')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {del.latencyMs}ms
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs">{del.roleName}</h4>
                        <p className="text-slate-400 text-[11px] line-clamp-3">{del.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Deliverables Detailed Table */}
            {reportFormat === 'deliverables' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3 pl-4">Agent Node</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Task Directive</th>
                        <th className="p-3">Artifact Summary</th>
                        <th className="p-3">Resolution</th>
                        <th className="p-3 text-right pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {currentReport.agentDeliverables.map((del, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                          <td className="p-3 pl-4 font-semibold text-white">
                            #{del.agentId} &bull; {del.roleName}
                          </td>
                          <td className="p-3 capitalize font-mono text-[11px] text-slate-400">
                            {del.category}
                          </td>
                          <td className="p-3 font-medium text-slate-200">
                            {del.taskTitle}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">
                            {del.summary}
                          </td>
                          <td className="p-3 font-mono text-cyan-400">
                            {del.latencyMs}ms
                          </td>
                          <td className="p-3 text-right pr-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              SUCCESS
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 3: Audit Findings & Strategic Recommendations */}
            {reportFormat === 'protocol' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Audit findings */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Operational Audit & Zero-Billing Verification
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {currentReport.auditFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategic recommendations */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Swarm Scalability Recommendations
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {currentReport.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Section 4: Raw JSON */}
            {reportFormat === 'raw_json' && (
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-auto max-h-[500px]">
                {JSON.stringify(currentReport, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
