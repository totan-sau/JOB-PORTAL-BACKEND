import { Company } from '../models/company.model.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if(!companyName) {
            return res.status(400).json({
                success: false,
                message: 'Company name is required'
            });
        }
        let company = await Company.findOne({name: companyName});
        if(company) {
            return res.status(400).json({
                success: false,
                message: 'Company name must not be duplicate'
            });
        }

        const createdCompany = await Company.create({
            name: companyName,
            userId: req.id
        });
        return res.status(201).json({
            success: true,
            company: createdCompany,
            message: 'Company registered'
        });

    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged id user_id
        const companies = await Company.find({userId});
        console.log(companies);
        
        if(!companies) {
            return res.status(404).json({
                success: false,
                message: 'No company yet!'
            });
        }
        return res.status(200).json({
            success: true,
            companies
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; // company id
        const company = await Company.findById(companyId);
        if(!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found!'
            });
        }
        return res.status(200).json({
            success: true,
            company
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const {name, description, website, location} = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const updateData = {name, description, website, location, 
            logo: cloudResponse.secure_url};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new: true});
        if(!company) {
            return res.status(404).json({
                success: false,
                message: 'No Company updated!'
            });
        }
        return res.status(200).json({
            success: true,
            company,
            message: 'Company updated successfully!'
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}