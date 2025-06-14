import { v2 as cloudinary } from "cloudinary";
import { Book } from "../models/book.models.js";


//upload to cloudinary function
const uploadToCloudinary = async(file, folder)=>{
    const options ={folder}
    options.resource_type = "auto"

    return await cloudinary.uploader.upload(file.tempFilePath, options)
}

const createBook = async(req, res)=>{
    try {
        const {title, caption, rating} = req.body
        const image = req.files.image

        if(!title || !caption || !rating || !image){
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }
        // image upload to cloudinary
        const imageDetails = await uploadToCloudinary(image, process.env.CLOUDINARY_FOLDER_NAME)

        const book = await Book.create({
            title,
            caption,
            rating,
            image: imageDetails.secure_url,
            user: req.user._id
        })

        res.status(200).json({
            success: false,
            message: "Post created",
            book
        })
    } catch (error) {
        console.error("Create post error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

const getBooks = async(req, res)=>{
    try {
        //pagination => infinite loading
        const page = req.query.page || 1;
        const limit = req.query.limit || 2;
        const skip = (page -1)*limit

        const books = await Book.find()
        .sort({createdAt: - 1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username avatar")
        .exec()


        if(!books){
            return res.status(400).json({
                success: false,
                message: "Books are not founded"
            })
        }
        const totalBooks = await Book.countDocuments()
        //res send
        res.status(200).json({
            success: true,
            message: "Books fetch successfully",
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.error("fetch books error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteBook = async(req, res)=>{
    try {
        const id = req.params.id
        const book = await Book.findById(id)

        if(!book){
            return res.status(400).json({
                success: false,
                message: "Books are not founded"
            })
        }

        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message:"Unauthorized"
            })
        }
        //delete from cloudinary
        if(book.image && book.image.includes("cloudinary")){
            try {
                const url = book.image.split("/").pop().split(".")[0]
                const publicId = `${process.env.CLOUDINARY_FOLDER_NAME}/` + url

                const deletedImage = await cloudinary.uploader.destroy(publicId)
                
                if(deletedImage.result !== "ok"){
                    return res.status(404).json({
                        success: false,
                        message: "image are not deleted"
                    })
                }

            } catch (error) {
                console.error("Error deleting image form cloudinary!!! ",error.message)
                return res.status(500).json({
                success: false,
                message: "Error deleting image form cloudinary"
        })
            }
        }
        //delete book
        await book.deleteOne()
        //res send
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            book,
        })
    } catch (error) {
        console.error("book delete error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const updateBook = async(req, res)=>{
    try {
        const id = req.params.id;
        const {title, caption, rating} = req.body ||{}
        const image = req.files?.image;

        if(!image && !title && !caption && !rating){
            return res.status(400).json({
                success: false,
                message: "Please provide minimum one field"
            })
        }
        
        const book = await Book.findById(id)

        if(!book){
            return res.status(400).json({
                success: false,
                message: "Books are not founded"
            })
        }

        //authontication
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message:"Unauthorized"
            })
        }

         if(image && book.image && book.image.includes("cloudinary")){


                const url = book.image.split("/").pop().split(".")[0]
                const publicId = `${process.env.CLOUDINARY_FOLDER_NAME}/` + url

                const updateImage = await cloudinary.uploader.upload(image.tempFilePath, {public_id:publicId, overwrite:true, invalidate: true})
                
                
                // if(update.result !== "ok"){
                //     return res.status(404).json({
                //         success: false,
                //         message: "image are not deleted"
                //     })
                // }
         }
        
        book.title = title || book.title;
        book.caption = caption || book.caption;
        book.rating = rating || book.rating

        await book.save()
        res.status(200).json({
            success: true,
            message: "post updated successfully"
        })
    } catch (error) {
        console.error("book updation error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const userBooks = async(req, res)=>{
    try {

        const book = await Book.find({user: req.user._id })
        .sort({createdAt: - 1})

        if(!book){
            return res.status(400).json({
                success: false,
                message: "User Books are not founded"
            })
        }
        //res send
        res.status(200).json({
            success: true,
            message: "User Books fetch successfully",
            book,
         
        })
    } catch (error) {
        console.error("fetch books error!!! ",error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
export {
    createBook,
    getBooks,
    deleteBook,
    updateBook,
    userBooks
}