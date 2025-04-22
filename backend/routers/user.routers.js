import { Router } from "express";
import { userLogin, userRegister } from "../controllers/user.controllers.js";
import auth from "../middlewares/auth.middlewares.js";
const router = Router()

router.post("/register", userRegister)
router.post("/login",userLogin)

export default router;