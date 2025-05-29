import { Router } from "express";
import { userLogin, userRegister, userDetails } from "../controllers/user.controllers.js";
import auth from "../middlewares/auth.middlewares.js";
const router = Router()

router.post("/register", userRegister)
router.post("/login",userLogin)
router.get("/profile", auth, userDetails)

export default router;