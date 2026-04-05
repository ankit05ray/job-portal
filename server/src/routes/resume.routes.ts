import { Router } from 'express';
import {
  uploadResume,
  getMyResume,
  updateSkills,
} from '../controllers/resume.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/my',      protect, getMyResume);
router.put('/skills',  protect, updateSkills);

export default router;