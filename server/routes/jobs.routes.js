import express from 'express';
import { jobController } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', jobController.getJobs);
router.get('/saved/:userId', jobController.getSavedJobs);
router.post('/saved/toggle', jobController.toggleSaveJob);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;
