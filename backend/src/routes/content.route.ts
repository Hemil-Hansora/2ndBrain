import { Router } from "express";
import { addContent } from "../controllers/content.controller";
import { authMiddleware } from "../middlewares";


const router = Router()

router.use(authMiddleware)
router.route('/add-content').post(addContent)


export default router