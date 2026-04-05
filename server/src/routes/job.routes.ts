import { Router } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/job.controller';
import { protect, recruiterOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/',     getAllJobs);
router.get('/:id',  getJobById);
router.post('/',    protect, recruiterOnly, createJob);
router.put('/:id',  protect, recruiterOnly, updateJob);
router.delete('/:id', protect, recruiterOnly, deleteJob);

export default router;
