import React from 'react';
import { AgentDefinition } from '../types';
import { AgentIcon } from './AgentIcon';
import { getCategoryBadgeStyle } from '../utils/formatters';
import { Play, Eye, Wrench, GitBranch, Cpu } from 'lucide-react';

interface AgentCardProps {
  agent: AgentDefinition;
  onSelect: (agent: AgentDefinition) => void;
  onExecute: (agent: AgentDefinition) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, onExecute }) => {
  const badgeStyle = getCategoryBadgeStyle(agent.category);

  return (
    <div
      id={`agent-card-${agent.id}`}
      className="group relative flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30"
    >
      <div>
        {/* Top bar: ID and Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              #{agent.id.toString().padStart(2, '0')}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}></span>
              <span className="capitalize">{agent.category}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>T: {agent.model_config.temperature}</span>
          </div>
        </div>

        {/* Role Name and Icon */}
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700/60 shrink-0 group-hover:bg-cyan-950/50 group-hover:text-cyan-300 transition-colors">
            <AgentIcon name={agent.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white leading-tight">
              {agent.role_name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Capabilities Pill List */}
        <div className="flex flex-wrap gap-1 my-3">
          {agent.capabilities.slice(0, 2).map((cap, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/40"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 2 && (
            <span className="text-[10px] text-slate-500 px-1 py-0.5">
              +{agent.capabilities.length - 2} more
            </span>
          )}
        </div>

        {/* Tools and Workflows */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wrench className="w-3 h-3 text-slate-500 shrink-0" />
            <div className="flex items-center gap-1 truncate">
              {agent.tools_required.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[10px] bg-slate-800/90 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700/50"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {agent.linked_workflows && agent.linked_workflows.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-400 truncate">
              <GitBranch className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="text-[10px] text-indigo-300 truncate">
                {agent.linked_workflows[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
        <button
          id={`inspect-agent-${agent.id}-btn`}
          onClick={() => onSelect(agent)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Inspect</span>
        </button>

        <button
          id={`deploy-agent-${agent.id}-btn`}
          onClick={() => onExecute(agent)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch</span>
        </button>
      </div>
    </div>
  );
};
