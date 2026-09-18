import { Router } from 'express';
import { HealthController } from '../controllers/healthController.ts';

const router = Router();
router.get('/', HealthController.getHealth);

export default router;
