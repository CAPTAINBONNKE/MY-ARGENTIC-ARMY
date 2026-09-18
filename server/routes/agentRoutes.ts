import { Router } from 'express';
import { AgentController } from '../controllers/agentController.ts';

const router = Router();

router.get('/', AgentController.getAllAgents);
router.get('/:id', AgentController.getAgentById);

export default router;
