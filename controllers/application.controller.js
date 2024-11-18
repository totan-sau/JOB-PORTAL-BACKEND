import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        
        if(!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required!'
            });
        }

        // Check if the user already applied this job
        const existingApplication = await Application.findOne({job: jobId, applicant: userId});

        if(existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job!'
            });
        }

        // Check if the job is exist
        const existingJob = await Job.findById(jobId);
        if(!existingJob) {
            return res.status(400).json({
                success: false,
                message: 'Job not found!'
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });
        
        existingJob.applications.push(newApplication._id);
        await existingJob.save();
        return res.status(201).json({
            success: true,
            message: 'Job applied successfully!'
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({applicant: userId}).sort({created_at: -1}).populate({
            path: 'job',
            options: {sort: {created_at: -1}},
            populate: {
                path: "company",
                options: {sort: {created_at: -1}}
            }
        }); // Ascending order

        if(!applications) {
            return res.status(404).json({
                success: false,
                message: 'Applications not found'
            });
        }

        return res.status(200).json({
            success: true,
            applications
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

// Admin end to check how many users are applied 
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: {sort: {createdAt: -1}},
            populate: {
                path: 'applicant'
            }
        });

        if(!job) {
            return res.status(404).json({
                success: false,
                message: 'Job Not Found!'
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

export const updateStatus = async (req, res) => {
    try {
        const status = req.body.status;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required!'
            });
        }

        // Find the application by application id
        const application = await Application.findOne({_id: applicationId});
        if(!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found!'
            });
        }
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            success: true,
            message: 'Status update successfully!'
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

