import express from 'express';
import { applicationController } from '../controllers/applicationController.js';

const router = express.Router();

router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplicationById);
router.post('/', applicationController.apply);
router.put('/:id/status', applicationController.updateStatus);

export default router;
