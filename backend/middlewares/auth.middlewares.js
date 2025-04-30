import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
const auth = async (req, res, next)=>{
    try {
        //get token
        const token = req.header("Authorization").replace("Bearer ", "")
        if(!token){
            return res.status(401).json({
                success: false,
                message:"No authentication token, access denied"
            })
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        //find the user
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(400).json({
                success: false,
                message:"Invalid token"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("Auth error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export default auth