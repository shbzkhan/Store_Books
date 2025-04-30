import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateToken = (userId)=>{
    return jwt.sign({userId}, process.env.JWT_TOKEN,{expiresIn: "15d"})
}
const userRegister = async(req, res)=>{
    try {
        const{username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //find user by username
        const userDetails = await User.findOne({username})
        if(userDetails){
            return res.status(401).json({
                success: false,
                message: "username already exist"
            })
        }
        //find user by email
        const emailDetails = await User.findOne({email})
        if(emailDetails){
            return res.status(401).json({
                success: false,
                message: "email already exist"
            })
        }

        const user = await User.create({
            username,
            email,
            password,
            avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${username}`
        })

        const token = generateToken(user._id)
        res.status(200).json({
            success: true,
            message: "User Registerd successfully",
            token,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                avatar:user.avatar

            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

const userLogin = async(req, res)=>{
    try {
        const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //find user
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        //compare password
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect){
            return res.status(401).json({
            success: false,
            message: "Invalid credentials password"
        })
        }
        //generate token
        const token = generateToken(user._id)

        //send response
        res.status(200).json({
            success: true,
            message: "User logged-in successfully",
            token,
            user:{
                _id: user._id,
                username:user.username,
                email:user.email,
                avatar:user.avatar
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export {
    userRegister,
    userLogin,
}