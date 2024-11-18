import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname ||
            !email ||
            !phoneNumber ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: 'All field are required'
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exist with this email!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userCreated = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        if(userCreated) {
            return res.status(201).json({
                success: true,
                message: 'Your registration is successfully done!'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}


export const login = async (req, res) => {
    try {
        const {email, password, role} = req.body;

        if(!email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: 'All field are required'
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email or password!'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect email or password!'
            });
        }

        if(role !== user.role) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect role!'
            });
        }

        const tokenData = {
            userId: user.id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly: true, sameSite: 'strict'}).json({
            success: true,
            user,
            message: `Welcome back ${user.fullname}`
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(201).cookie("token", "", {maxAge: 0}).json({
            success: true,
            message:"Logout Successfully!"
        });
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        if (
            !fullname ||
            !email ||
            !phoneNumber ||
            !bio ||
            !skills
        ) {
            return res.status(400).json({
                success: false,
                message: 'All field are required'
            });
        }
        let skillsArray;
        if(skills) skillsArray = skills.split(",");
        const userId = req.id; // it's come from middleware authentication
        let user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // updationg data set
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;
        
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        if(cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        const userUpdated = await user.save();
        if(userUpdated) {
            user = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }
            return res.status(201).json({
                success: true,
                user,
                message: 'Profile updated successfully!'
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
}