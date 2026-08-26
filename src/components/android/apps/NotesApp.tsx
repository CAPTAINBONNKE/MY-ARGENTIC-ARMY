import React, { useState, useRef } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Pin,
  CheckSquare,
  Square,
  Tag,
  Bot,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Mic,
  MicOff,
  GripVertical
} from 'lucide-react';
import { KeepNoteItem } from '../../../types/androidAgent';

interface NotesAppProps {
  notes: KeepNoteItem[];
  onAddNote: (note: Partial<KeepNoteItem>) => void;
  onUpdateNote: (id: string, updates: Partial<KeepNoteItem>) => void;
  onDeleteNote: (id: string) => void;
  onTriggerAgentArmySync?: (prompt?: string) => Promise<void>;
  onReorderNotes?: (notes: KeepNoteItem[]) => void;
  isAgentRunning?: boolean;
}

export const NotesApp: React.FC<NotesAppProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTriggerAgentArmySync,
  onReorderNotes,
  isAgentRunning = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'agent' | 'checklist' | 'pinned'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState<string>('yellow');
  const [newPinned, setNewPinned] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistItems, setNewChecklistItems] = useState<string[]>([]);
  const [showAgentArmySyncModal, setShowAgentArmySyncModal] = useState(false);
  const [customArmyPrompt, setCustomArmyPrompt] = useState('');
  const [isSyncingArmy, setIsSyncingArmy] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Drag and Drop state for pinned notes reordering
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [dragOverNoteId, setDragOverNoteId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Color mappings for Google Keep style cards
  const colorStyles: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
    yellow: {
      bg: 'bg-amber-950/30 hover:bg-amber-950/40',
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400'
    },
    emerald: {
      bg: 'bg-emerald-950/30 hover:bg-emerald-950/40',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400'
    },
    blue: {
      bg: 'bg-blue-950/30 hover:bg-blue-950/40',
      border: 'border-blue-500/40',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400'
    },
    purple: {
      bg: 'bg-purple-950/30 hover:bg-purple-950/40',
      border: 'border-purple-500/40',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      dot: 'bg-purple-400'
    },
    rose: {
      bg: 'bg-rose-950/30 hover:bg-rose-950/40',
      border: 'border-rose-500/40',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400'
    },
    slate: {
      bg: 'bg-slate-900/60 hover:bg-slate-900/80',
      border: 'border-slate-700/60',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      dot: 'bg-slate-400'
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setNewChecklistItems([...newChecklistItems, newChecklistText.trim()]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setNewChecklistItems(newChecklistItems.filter((_, i) => i !== idx));
  };

  const handleSaveNote = () => {
    if (!newTitle.trim() && !newContent.trim() && newChecklistItems.length === 0) return;

    onAddNote({
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      color: newColor,
      pinned: newPinned,
      tags: ['Personal'],
      checklist: newChecklistItems.map((text, i) => ({
        id: `chk_${Date.now()}_${i}`,
        text,
        done: false
      }))
    });

    setNewTitle('');
    setNewContent('');
    setNewChecklistItems([]);
    setNewChecklistText('');
    setIsCreating(false);
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  const handleToggleChecklist = (noteId: string, itemId: string, currentDone: boolean) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote || !targetNote.checklist) return;

    const updatedChecklist = targetNote.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !currentDone } : item
    );

    onUpdateNote(noteId, { checklist: updatedChecklist });
  };

  const handleTogglePin = (noteId: string, currentPinned?: boolean) => {
    onUpdateNote(noteId, { pinned: !currentPinned });
  };

  const handleExecuteArmySync = async (promptText: string) => {
    if (onTriggerAgentArmySync) {
      setIsSyncingArmy(true);
      try {
        await onTriggerAgentArmySync(promptText);
      } finally {
        setIsSyncingArmy(false);
        setShowAgentArmySyncModal(false);
      }
    }
  };

  // Voice Dictation Toggle Handler for Note Content
  const toggleSpeechDictation = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setNewContent((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        simulateDictation();
      }
    } else {
      simulateDictation();
    }
  };

  const simulateDictation = () => {
    setIsListening(true);
    const sampleVoiceInputs = [
      'Tactical directive: Agent Army deploy and synchronize Keep matrix with zero-billing safeguards.',
      'Sprint milestone: Verify Kotlin ReAct Orchestrator loop and accessibility touch bridges.',
      'Intelligence brief: Benchmark on-device SLM models vs Cloud Gemini 3.7 Flash.'
    ];
    const chosen = sampleVoiceInputs[Math.floor(Math.random() * sampleVoiceInputs.length)];
    setTimeout(() => {
      setNewContent((prev) => (prev ? `${prev.trim()}\n${chosen}` : chosen));
      setIsListening(false);
    }, 1800);
  };

  // HTML5 Drag and Drop Handlers for Pinned Notes Reordering
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedNoteId(noteId);
  };

  const handleDragOver = (e: React.DragEvent, targetNoteId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedNoteId && draggedNoteId !== targetNoteId) {
      setDragOverNoteId(targetNoteId);
    }
  };

  const handleDragLeave = () => {
    setDragOverNoteId(null);
  };

  const handleDragEnd = () => {
    setDraggedNoteId(null);
    setDragOverNoteId(null);
  };

  const handleDrop = (e: React.DragEvent, targetNoteId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedNoteId;
    setDragOverNoteId(null);
    setDraggedNoteId(null);

    if (!sourceId || sourceId === targetNoteId) return;

    const currentNotes = [...notes];
    const sourceIdx = currentNotes.findIndex((n) => n.id === sourceId);
    const targetIdx = currentNotes.findIndex((n) => n.id === targetNoteId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    const [movedNote] = currentNotes.splice(sourceIdx, 1);
    currentNotes.splice(targetIdx, 0, movedNote);

    if (onReorderNotes) {
      onReorderNotes(currentNotes);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedFilter === 'agent') return Boolean(note.authorAgent);
    if (selectedFilter === 'checklist') return Boolean(note.checklist && note.checklist.length > 0);
    if (selectedFilter === 'pinned') return Boolean(note.pinned);
    return true;
  });

  const isSyncInProgress = isSyncingArmy || isAgentRunning;

  return (
    <div id="app-notes-keep" className="flex flex-col h-full bg-slate-950 text-slate-100 select-none">
      {/* Google Keep Header */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Google Keep
              <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-700/50 font-mono">
                Agent Army
              </span>
            </h2>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              50-Agent Access: Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-army-keep-sync"
            onClick={() => setShowAgentArmySyncModal(true)}
            title="Request Agent Army to write note"
            disabled={isSyncInProgress}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[10px] font-bold shadow transition-all disabled:opacity-80 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isSyncInProgress ? 'animate-spin' : ''}`} />
            <span>{isSyncInProgress ? 'Army Syncing...' : 'Army Write'}</span>
          </button>

          <button
            id="btn-keep-new-note"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[11px] font-bold shadow transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-2 bg-slate-900/70 border-b border-slate-800 space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            id="keep-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Keep notes, tags, or Agent Army briefs..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[10px] overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-900'
            }`}
          >
            All ({notes.length})
          </button>
          <button
            onClick={() => setSelectedFilter('agent')}
            className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'agent'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-2.5 h-2.5" /> Agent Army ({notes.filter((n) => n.authorAgent).length})
          </button>
          <button
            onClick={() => setSelectedFilter('checklist')}
            className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'checklist'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <CheckSquare className="w-2.5 h-2.5" /> Checklists ({notes.filter((n) => n.checklist?.length).length})
          </button>
          <button
            onClick={() => setSelectedFilter('pinned')}
            className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
              selectedFilter === 'pinned'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <Pin className="w-2.5 h-2.5" /> Pinned ({notes.filter((n) => n.pinned).length})
          </button>
        </div>
      </div>

      {/* Note Creator Box */}
      {isCreating && (
        <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2.5 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> New Google Keep Note
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNewPinned(!newPinned)}
                title={newPinned ? 'Pinned note' : 'Pin note'}
                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                  newPinned ? 'text-amber-400' : 'text-slate-500'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <input
            id="keep-create-title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-yellow-500"
          />

          {/* Text Area with Dictation Microphone */}
          <div className="relative">
            <textarea
              id="keep-create-content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Take a note..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 pr-8 text-xs text-slate-100 focus:outline-none focus:border-yellow-500"
            />
            <button
              type="button"
              id="btn-keep-dictate-content"
              onClick={toggleSpeechDictation}
              title={isListening ? 'Stop dictation' : 'Dictate note content'}
              className={`absolute right-2 bottom-2.5 p-1 rounded-md transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                  : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800/80'
              }`}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {isListening && (
            <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-mono animate-pulse px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Listening to voice dictation... Speak now</span>
            </div>
          )}

          {/* Checklist addition */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Checklist Items
            </span>
            {newChecklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-1 text-xs text-slate-300 bg-slate-950/60 px-2 py-1 rounded">
                <span className="flex items-center gap-1.5 truncate">
                  <Square className="w-3 h-3 text-slate-500" /> {item}
                </span>
                <button
                  onClick={() => handleRemoveChecklistItem(idx)}
                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                placeholder="Add checklist item..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Color Presets & Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              {['yellow', 'emerald', 'blue', 'purple', 'rose'].map((colorKey) => (
                <button
                  key={colorKey}
                  onClick={() => setNewColor(colorKey)}
                  className={`w-4 h-4 rounded-full cursor-pointer ${colorStyles[colorKey].dot} ${
                    newColor === colorKey ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-keep-save-note"
                onClick={handleSaveNote}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-lg text-xs shadow cursor-pointer"
              >
                Save to Keep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Army Sync Prompt Modal */}
      {showAgentArmySyncModal && (
        <div className="p-3 bg-purple-950/40 border-b border-purple-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Agent Army: Auto-Write to Google Keep
            </span>
            <button
              onClick={() => setShowAgentArmySyncModal(false)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300">
            Select a pre-configured directive or enter a custom prompt for your 50-agent army to synthesize and write directly onto your phone's Keep app:
          </p>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleExecuteArmySync('Generate Q3 Mobile Agent Strategy and task checklist')}
              disabled={isSyncInProgress}
              className="text-[10px] bg-slate-900 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 px-2 py-1 rounded-lg cursor-pointer"
            >
              📝 Q3 Strategy & Checklist
            </button>
            <button
              onClick={() => handleExecuteArmySync('Synthesize Security & Zero-Billing Audit for Agent Army')}
              disabled={isSyncInProgress}
              className="text-[10px] bg-slate-900 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 px-2 py-1 rounded-lg cursor-pointer"
            >
              🛡️ Security & Zero-Billing Audit
            </button>
            <button
              onClick={() => handleExecuteArmySync('Trending On-Device AI models and Kotlin integration tips')}
              disabled={isSyncInProgress}
              className="text-[10px] bg-slate-900 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 px-2 py-1 rounded-lg cursor-pointer"
            >
              💡 Tech Trends Brief
            </button>
          </div>

          <div className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={customArmyPrompt}
              onChange={(e) => setCustomArmyPrompt(e.target.value)}
              placeholder="Or enter custom army directive..."
              className="flex-1 bg-slate-950 border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => handleExecuteArmySync(customArmyPrompt || 'Generate Sprint Milestones')}
              disabled={isSyncInProgress}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              {isSyncInProgress ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes List / Feed */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-500">
            <Bot className="w-8 h-8 text-slate-600" />
            <p className="text-xs">No Google Keep notes found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-[11px] text-yellow-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const style = colorStyles[note.color || 'yellow'] || colorStyles.yellow;
            const isDragging = draggedNoteId === note.id;
            const isDragTarget = dragOverNoteId === note.id;

            return (
              <div
                key={note.id}
                draggable={Boolean(note.pinned)}
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragOver={(e) => handleDragOver(e, note.id)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, note.id)}
                className={`p-3 rounded-2xl border transition-all duration-200 shadow-sm relative group ${style.border} ${style.bg} ${
                  isDragging ? 'opacity-40 scale-95 border-dashed border-amber-400' : ''
                } ${
                  isDragTarget ? 'ring-2 ring-amber-400 border-amber-400 shadow-lg scale-[1.02]' : ''
                } ${note.pinned ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {/* Note Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-1 truncate">
                    {note.pinned && (
                      <span
                        title="Drag to reorder pinned notes"
                        className="text-amber-400/80 hover:text-amber-300 cursor-grab"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-100 leading-snug truncate">
                      {note.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id, note.pinned)}
                      title={note.pinned ? 'Unpin' : 'Pin to top (enables drag-reorder)'}
                      className={`p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        note.pinned ? 'text-amber-400' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete note"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Author Badge if created by Agent Army */}
                {note.authorAgent && (
                  <div className="flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 w-fit">
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="font-mono font-semibold">
                      Agent #{note.authorAgent.agentId} • {note.authorAgent.roleName}
                    </span>
                  </div>
                )}

                {/* Content Body */}
                {note.content && (
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mb-2 font-normal">
                    {note.content}
                  </p>
                )}

                {/* Interactive Checklist Items */}
                {note.checklist && note.checklist.length > 0 && (
                  <div className="space-y-1 mb-2 pt-1 border-t border-slate-800/40">
                    {note.checklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleToggleChecklist(note.id, item.id, item.done)}
                        className="w-full flex items-start gap-2 text-left text-xs text-slate-300 hover:text-slate-100 py-0.5 group/item cursor-pointer"
                      >
                        {item.done ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 group-hover/item:text-slate-300" />
                        )}
                        <span className={`text-[11px] leading-tight ${item.done ? 'line-through text-slate-500' : ''}`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tags and Meta Footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/40 text-[9px] text-slate-400">
                  <div className="flex items-center gap-1 flex-wrap">
                    {note.tags &&
                      note.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.2 rounded bg-slate-900/80 border border-slate-700/50 text-slate-300 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{note.updated}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

