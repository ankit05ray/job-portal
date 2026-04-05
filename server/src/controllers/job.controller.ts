import { Response } from 'express';
import Job from '../models/Job.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills,
      postedBy: req.user!.id,
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { search, skills } = req.query;

    let filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { company:     { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (skills) {
      const skillArray = (skills as string).split(',').map(s => s.trim());
      filter.skills = { $in: skillArray };
    }

    const jobs = await Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({ message: 'Jobs fetched', jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ message: 'Job fetched', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ message: 'Job updated', job: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};