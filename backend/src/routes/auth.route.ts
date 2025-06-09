import {Router} from "express";
import { signin, signout, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares";

const router = Router()

router.route('/signup').post(signup)

router.route('/signin').post(signin)
router.route('/signout').post(authMiddleware,signout)

export default router