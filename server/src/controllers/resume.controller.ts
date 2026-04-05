import { Response } from 'express';
import Resume from '../models/Resume.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user!.id },
      {
        userId:   req.user!.id,
        fileUrl:  `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyResume = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findOne({ userId: req.user!.id });

    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }

    res.status(200).json({ message: 'Resume fetched', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { skills } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user!.id },
      { skills },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'No resume found. Upload a resume first.' });
    }

    res.status(200).json({ message: 'Skills updated', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};