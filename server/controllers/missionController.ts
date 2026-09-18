import { Request, Response } from 'express';
import { MissionService } from '../services/missionService.ts';
import { ReportRepository } from '../db/repositories.ts';
import { AGENTS_DATA } from '../../src/data/agents.ts';
import { getGenAI, generateContentWithRetry, extractStructuredJson, generateDeterministicSimulation } from '../services/geminiService.ts';

export const MissionController = {
  async executeMission(req: Request, res: Response) {
    try {
      const result = await MissionService.executeMissionGraph(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: { code: 'MISSION_EXEC_ERROR', message: err.message },
      });
    }
  },

  async executeWorkflowChain(req: Request, res: Response) {
    try {
      const { pipelineId, input } = req.body;
      const result = await MissionService.executeWorkflowChain(pipelineId, input);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: { code: 'CHAIN_EXEC_ERROR', message: err.message },
      });
    }
  },

  async generateReport(req: Request, res: Response) {
    try {
      const { title, objective, logs = [] } = req.body;
      const report = await MissionService.generateConsolidatedReport(title, objective, logs);
      res.json({ status: 'success', report });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: { code: 'REPORT_GEN_ERROR', message: err.message },
      });
    }
  },

  getReports(req: Request, res: Response) {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const reports = ReportRepository.getAll(limit);
    res.json({ total: reports.length, reports });
  },

  async optimizePrompt(req: Request, res: Response) {
    const { rawPrompt, targetModel = 'gemini-3.7-flash', includeFewShot = true } = req.body;
    const promptEngineer = AGENTS_DATA.find(a => a.id === 4) || AGENTS_DATA[0];
    const ai = getGenAI();

    if (ai) {
      try {
        const optimizedText = await generateContentWithRetry({
          model: 'gemini-3.7-flash',
          contents: `Target Model: ${targetModel}\nInclude Few-Shot: ${includeFewShot}\nOriginal Prompt: "${rawPrompt}"\n\nRewrite this prompt for optimal structured JSON adherence and minimum token footprint. Format response as JSON with {optimized_prompt, expected_schema, few_shot_examples[], injection_risks[], fallback_chain}.`,
          systemInstruction: promptEngineer.system_prompt,
          temperature: 0.2,
        });

        const parsed = extractStructuredJson(optimizedText);
        return res.json({
          status: 'success',
          optimized: optimizedText,
          parsed,
        });
      } catch (err: any) {
        console.warn('Optimize prompt fallback:', err.message);
      }
    }

    const sim = generateDeterministicSimulation(promptEngineer, rawPrompt);
    res.json({
      status: 'success',
      optimized: sim.raw,
      parsed: sim.parsed,
    });
  },
};
