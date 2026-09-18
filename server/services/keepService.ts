import { NoteRepository } from '../db/repositories.ts';
import { KeepNoteItem } from '../../src/types/androidAgent.ts';
import { AGENTS_DATA } from '../../src/data/agents.ts';
import { getGenAI, generateContentWithRetry, extractStructuredJson } from './geminiService.ts';

export const KeepService = {
  getAllNotes(): KeepNoteItem[] {
    return NoteRepository.getAll();
  },

  getNoteById(id: string): KeepNoteItem | null {
    return NoteRepository.getById(id);
  },

  createNote(data: Partial<KeepNoteItem>): KeepNoteItem {
    const note: KeepNoteItem = {
      id: data.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title || 'Untitled Note',
      content: data.content || '',
      updated: data.updated || 'Just now',
      color: data.color || 'yellow',
      pinned: data.pinned ?? false,
      tags: data.tags || ['Personal'],
      checklist: data.checklist || [],
      authorAgent: data.authorAgent,
    };
    return NoteRepository.create(note);
  },

  updateNote(id: string, updates: Partial<KeepNoteItem>): KeepNoteItem | null {
    return NoteRepository.update(id, updates);
  },

  deleteNote(id: string): boolean {
    return NoteRepository.delete(id);
  },

  searchNotes(q: string): KeepNoteItem[] {
    return NoteRepository.search(q);
  },

  async syncWithAgentArmy(promptText: string, agentCount: number = 50, targetTag: string = 'AgentArmy'): Promise<KeepNoteItem> {
    const ai = getGenAI();
    const coordinatorAgent = AGENTS_DATA[0]; // Lead Architect / Agent #1

    let generatedTitle = `Agent Army Swarm: ${promptText.substring(0, 40)}`;
    let generatedContent = `Autonomous strategic synthesis across ${agentCount} agent nodes for: "${promptText}"`;
    let generatedChecklist = [
      { id: `c_${Date.now()}_1`, text: 'Initialize Multi-Agent Consensus Matrix', done: true },
      { id: `c_${Date.now()}_2`, text: 'Validate Tool Calling & API Credentials', done: true },
      { id: `c_${Date.now()}_3`, text: 'Deploy Kotlin Background Task Handler', done: false },
      { id: `c_${Date.now()}_4`, text: 'Sync Long-Term Memory to SQLite WAL Store', done: true },
      { id: `c_${Date.now()}_5`, text: 'Execute Technical Verification & Architecture Audit', done: false }
    ];

    if (ai) {
      try {
        const rawOutput = await generateContentWithRetry({
          model: 'gemini-3.7-flash',
          contents: `You are the Coordinator for the 50-Agent Army Swarm.
Generate an actionable tactical checklist and summary for the user's mobile Google Keep note based on:
"${promptText}"

Return JSON ONLY:
{
  "title": "Short punchy title",
  "summary": "2-3 sentences overview",
  "checklist": [
    {"text": "Action item 1", "done": true},
    {"text": "Action item 2", "done": false},
    {"text": "Action item 3", "done": false},
    {"text": "Action item 4", "done": false}
  ]
}`,
          temperature: 0.3,
        });

        const parsed = extractStructuredJson(rawOutput);
        if (parsed && parsed.title && Array.isArray(parsed.checklist)) {
          generatedTitle = parsed.title;
          generatedContent = parsed.summary || generatedContent;
          generatedChecklist = parsed.checklist.map((item: any, idx: number) => ({
            id: `c_${Date.now()}_${idx}`,
            text: String(item.text),
            done: Boolean(item.done),
          }));
        }
      } catch (err: any) {
        console.warn('Agent army sync AI fallback:', err.message);
      }
    }

    const noteItem: KeepNoteItem = {
      id: `note_swarm_${Date.now()}`,
      title: generatedTitle,
      content: generatedContent,
      updated: 'Just now',
      color: 'purple',
      pinned: true,
      tags: ['Work', 'Swarm', targetTag],
      checklist: generatedChecklist,
      authorAgent: {
        agentId: coordinatorAgent.id,
        roleName: coordinatorAgent.role_name,
        avatarIcon: 'Sparkles',
      },
    };

    return NoteRepository.create(noteItem);
  }
};
