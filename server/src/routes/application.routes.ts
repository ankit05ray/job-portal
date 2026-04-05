import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from '../controllers/application.controller';
import { protect, recruiterOnly } from '../middleware/auth.middleware';

const router = Router();

router.post('/:jobId',           protect, applyToJob);
router.get('/my',                protect, getMyApplications);
router.get('/job/:jobId',        protect, recruiterOnly, getJobApplicants);
router.patch('/:id/status',      protect, recruiterOnly, updateApplicationStatus);

export default router;