import { Router } from 'express';
import healthRoutes from './healthRoutes.ts';
import agentRoutes from './agentRoutes.ts';
import protocolRoutes from './protocolRoutes.ts';
import androidRoutes from './androidRoutes.ts';
import { MissionController } from '../controllers/missionController.ts';
import { validateBody } from '../middleware/validator.ts';
import { WorkflowChainSchema, OptimizePromptSchema } from '../schemas/apiSchemas.ts';
import { aiInferenceRateLimiter } from '../middleware/rateLimiter.ts';

const apiRouter = Router();

// Mount domain routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/agents', agentRoutes);
apiRouter.use('/protocol', protocolRoutes);
apiRouter.use('/android', androidRoutes);

// Multi-Agent Workflow Chain & Prompt Lab routes
apiRouter.post(
  '/workflow/execute-chain',
  aiInferenceRateLimiter,
  validateBody(WorkflowChainSchema),
  MissionController.executeWorkflowChain
);

apiRouter.post(
  '/optimize-prompt',
  aiInferenceRateLimiter,
  validateBody(OptimizePromptSchema),
  MissionController.optimizePrompt
);

export default apiRouter;
