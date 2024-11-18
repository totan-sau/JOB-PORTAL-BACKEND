import { Job } from '../models/job.model.js';

export const postJob = async (req, res) => {
    try {
        const userId = req.id;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;
        if(!title ||
            !description ||
            !requirements ||
            !salary ||
            !location ||
            !jobType ||
            !experience ||
            !position ||
            !companyId
        ) {
            return res.status(400).json({
                success: false,
                message: 'Something mission'
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            success: true,
            job,
            message: 'New job created successfully!'
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

// For student end
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                {title: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({
            createdAt: -1
        });

        if(!jobs) {
            return res.status(404).json({
                success: false,
                message: 'Jobs not found'
            });
        }

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

// For student end
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if(!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        return res.status(200).json({
            success: true,
            job
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

// For admin end
export const getJobsByAdminId = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId}).populate({
            path: 'company',
            createdAt: -1
        });

        if(!jobs) {
            return res.status(404).json({
                success: false,
                message: 'Jobs not found'
            });
        }

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}