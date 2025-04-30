import express from "express"
const app = express()
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import cloudinaryConnect from "./config/cloudinary.js"
import cors from "cors"
import fileUpload from "express-fileupload"
import user from "./routers/user.routers.js"
import book from "./routers/book.routers.js"

dotenv.config({
    path:"./env"
})

app.use(cors())
app.use(express.json())

app.use(fileUpload (
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
))

app.use("/api/auth", user)
app.use("/api/book",book)

cloudinaryConnect();
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error: ",error);
    })

    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running at port !!! ${process.env.PORT}`);
    })
})
.catch((error)=>{
console.log("MongoDB connection failed: ",error)
})