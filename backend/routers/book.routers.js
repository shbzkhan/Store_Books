import { Router } from "express";
import { createBook, deleteBook, getBooks } from "../controllers/book.controllers.js";
import auth from "../middlewares/auth.middlewares.js";
const router = Router()

router.post("/create", auth, createBook)
router.get("/", auth, getBooks)
router.delete("/:id", auth, deleteBook)

export default router;