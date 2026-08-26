import { AgentCategory } from '../types';

export function getCategoryBadgeStyle(category: AgentCategory): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (category) {
    case 'content':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-800/40',
        dot: 'bg-emerald-400',
      };
    case 'video':
      return {
        bg: 'bg-indigo-950/40',
        text: 'text-indigo-300',
        border: 'border-indigo-800/40',
        dot: 'bg-indigo-400',
      };
    case 'engineering':
      return {
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-300',
        border: 'border-cyan-800/40',
        dot: 'bg-cyan-400',
      };
    case 'conversational':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-800/40',
        dot: 'bg-amber-400',
      };
    case 'visual':
      return {
        bg: 'bg-purple-950/40',
        text: 'text-purple-300',
        border: 'border-purple-800/40',
        dot: 'bg-purple-400',
      };
    case 'audio':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-300',
        border: 'border-rose-800/40',
        dot: 'bg-rose-400',
      };
    case 'data':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-300',
        border: 'border-blue-800/40',
        dot: 'bg-blue-400',
      };
    case 'marketing':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-300',
        border: 'border-orange-800/40',
        dot: 'bg-orange-400',
      };
    case 'quality':
      return {
        bg: 'bg-teal-950/40',
        text: 'text-teal-300',
        border: 'border-teal-800/40',
        dot: 'bg-teal-400',
      };
    case 'research':
      return {
        bg: 'bg-sky-950/40',
        text: 'text-sky-300',
        border: 'border-sky-800/40',
        dot: 'bg-sky-400',
      };
    case 'productivity':
      return {
        bg: 'bg-lime-950/40',
        text: 'text-lime-300',
        border: 'border-lime-800/40',
        dot: 'bg-lime-400',
      };
    case 'business':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-200',
        border: 'border-amber-700/40',
        dot: 'bg-amber-400',
      };
    case 'education':
      return {
        bg: 'bg-violet-950/40',
        text: 'text-violet-300',
        border: 'border-violet-800/40',
        dot: 'bg-violet-400',
      };
    default:
      return {
        bg: 'bg-slate-900',
        text: 'text-slate-300',
        border: 'border-slate-800',
        dot: 'bg-slate-400',
      };
  }
}
