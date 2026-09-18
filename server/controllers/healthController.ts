import { Request, Response } from 'express';
import { AGENTS_DATA } from '../../src/data/agents.ts';
import { ProtocolRepository } from '../db/repositories.ts';
import { getGenAI } from '../services/geminiService.ts';

export const HealthController = {
  getHealth(req: Request, res: Response) {
    const hasKey = Boolean(getGenAI());
    const mem = process.memoryUsage();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'J.A.R.V.I.S. Android AI Agent OS & Autonomous 50-Agent Swarm',
      total_agents: AGENTS_DATA.length,
      gemini_configured: hasKey,
      default_model: 'gemini-3.7-flash',
      protocol_version: 'AGENT_COMM_V3.0_ENTERPRISE',
      persistence_engine: 'SQLite3_WAL_Optimized',
      messages_in_bus: ProtocolRepository.count(),
      system_telemetry: {
        uptime_sec: Math.floor(process.uptime()),
        heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        rss_mb: Math.round(mem.rss / 1024 / 1024),
      },
    });
  },
};
