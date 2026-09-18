import { Router } from 'express';
import { KeepController } from '../controllers/keepController.ts';
import { validateBody } from '../middleware/validator.ts';
import {
  NoteCreateSchema,
  NoteUpdateSchema,
  KeepArmySyncSchema,
} from '../schemas/apiSchemas.ts';

const router = Router();

router.get('/', KeepController.getNotes);
router.get('/:id', KeepController.getNoteById);
router.post('/', validateBody(NoteCreateSchema), KeepController.createNote);
router.patch('/:id', validateBody(NoteUpdateSchema), KeepController.updateNote);
router.put('/:id', validateBody(NoteUpdateSchema), KeepController.updateNote);
router.delete('/:id', KeepController.deleteNote);

// Agent Army Swarm to Google Keep Note synchronization
router.post('/agent-army-sync', validateBody(KeepArmySyncSchema), KeepController.agentArmySync);

export default router;
