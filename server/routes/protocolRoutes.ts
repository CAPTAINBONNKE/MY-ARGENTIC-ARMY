import { Router } from 'express';
import { ProtocolController } from '../controllers/protocolController.ts';
import { MissionController } from '../controllers/missionController.ts';
import { validateBody } from '../middleware/validator.ts';
import { aiInferenceRateLimiter } from '../middleware/rateLimiter.ts';
import {
  ProtocolDispatchSchema,
  BroadcastSchema,
  SmartRouteSchema,
  MissionExecuteSchema,
  GenerateReportSchema,
  WorkflowChainSchema,
  OptimizePromptSchema,
} from '../schemas/apiSchemas.ts';

const router = Router();

// Protocol & Telemetry inspection
router.get('/agents/telemetry', ProtocolController.getTelemetry);
router.get('/messages', ProtocolController.getMessages);

// Protocol actions
router.post('/dispatch', aiInferenceRateLimiter, validateBody(ProtocolDispatchSchema), ProtocolController.dispatch);
router.post('/broadcast', validateBody(BroadcastSchema), ProtocolController.broadcast);
router.post('/ping-all', ProtocolController.pingAll);
router.post('/smart-route', validateBody(SmartRouteSchema), ProtocolController.smartRoute);

// Mission & Workflow orchestration
router.post('/mission/execute', aiInferenceRateLimiter, validateBody(MissionExecuteSchema), MissionController.executeMission);
router.post('/reports/generate', validateBody(GenerateReportSchema), MissionController.generateReport);
router.get('/reports', MissionController.getReports);

export default router;
