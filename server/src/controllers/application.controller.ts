import { Response } from 'express';
import Application from '../models/Application.model';
import Job from '../models/Job.model';
import Resume from '../models/Resume.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { calculateSkillMatch } from '../utils/skillMatch';

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if already applied
    const existing = await Application.findOne({
  jobId: jobId as any,
  userId: req.user!.id as any,
});
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Get user's resume for skill matching
    const resume = await Resume.findOne({ userId: req.user!.id });

    // Calculate skill match score
    const matchScore = calculateSkillMatch(
      resume?.skills ?? [],
      job.skills ?? []
    );

   const application = await Application.create({
  jobId:    jobId as any,
  userId:   req.user!.id as any,
  resumeId: resume?._id,
  matchScore,
});
    res.status(201).json({
      message: 'Applied successfully',
      application,
      matchScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.user!.id })
      .populate('jobId', 'title company location skills salary')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Applications fetched', applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    // Make sure the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicants = await Application.find({ jobId })
      .populate('userId', 'name email')
      .populate('resumeId', 'fileUrl skills')
      .sort({ matchScore: -1 });

    res.status(200).json({ message: 'Applicants fetched', applicants });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
