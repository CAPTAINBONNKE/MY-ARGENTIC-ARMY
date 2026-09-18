import { Request, Response } from 'express';
import { AGENTS_DATA } from '../../src/data/agents.ts';

export const AgentController = {
  getAllAgents(req: Request, res: Response) {
    const { category, search } = req.query;
    let filtered = AGENTS_DATA;

    if (category && category !== 'all' && typeof category === 'string') {
      filtered = filtered.filter(a => a.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.role_name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tools_required.some(t => t.toLowerCase().includes(q)) ||
          a.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }

    res.json({
      total: filtered.length,
      agents: filtered,
    });
  },

  getAgentById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const agent = AGENTS_DATA.find(a => a.id === id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Agent #${id} not found` },
      });
    }
    res.json(agent);
  },
};
