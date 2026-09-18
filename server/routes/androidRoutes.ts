import { Router } from 'express';
import { AndroidController } from '../controllers/androidController.ts';
import keepRoutes from './keepRoutes.ts';
import { validateBody } from '../middleware/validator.ts';
import { aiInferenceRateLimiter } from '../middleware/rateLimiter.ts';
import {
  AndroidExecuteSchema,
  AndroidTechnicalTaskSchema,
  AndroidVisionSchema,
} from '../schemas/apiSchemas.ts';

const router = Router();

// ReAct execution loop & hardware endpoints
router.post('/execute', aiInferenceRateLimiter, validateBody(AndroidExecuteSchema), AndroidController.execute);
router.post('/agent/technical-task', aiInferenceRateLimiter, validateBody(AndroidTechnicalTaskSchema), AndroidController.technicalTask);
router.post('/vision', validateBody(AndroidVisionSchema), AndroidController.vision);

// Mount Keep endpoints under /api/android/keep
router.use('/keep', keepRoutes);

export default router;
