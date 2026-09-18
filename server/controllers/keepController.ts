import { Request, Response } from 'express';
import { KeepService } from '../services/keepService.ts';

export const KeepController = {
  getNotes(req: Request, res: Response) {
    const { query } = req.query;
    if (query && typeof query === 'string') {
      const notes = KeepService.searchNotes(query);
      return res.json({ total: notes.length, notes });
    }
    const notes = KeepService.getAllNotes();
    res.json({ total: notes.length, notes });
  },

  getNoteById(req: Request, res: Response) {
    const note = KeepService.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Note #${req.params.id} not found` },
      });
    }
    res.json(note);
  },

  createNote(req: Request, res: Response) {
    const note = KeepService.createNote(req.body);
    res.status(201).json({
      status: 'success',
      note,
    });
  },

  updateNote(req: Request, res: Response) {
    const updated = KeepService.updateNote(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Note #${req.params.id} not found` },
      });
    }
    res.json({
      status: 'success',
      note: updated,
    });
  },

  deleteNote(req: Request, res: Response) {
    const deleted = KeepService.deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Note #${req.params.id} not found` },
      });
    }
    res.json({
      status: 'success',
      message: `Note #${req.params.id} deleted successfully`,
    });
  },

  async agentArmySync(req: Request, res: Response) {
    try {
      const { prompt, agentCount = 50, targetTag = 'AgentArmy' } = req.body;
      const note = await KeepService.syncWithAgentArmy(prompt, agentCount, targetTag);
      res.json({
        status: 'success',
        note,
        message: `Successfully synchronized ${agentCount} agents into Google Keep note`,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: { code: 'SYNC_ERROR', message: err.message },
      });
    }
  },
};
