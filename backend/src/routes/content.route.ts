import { Router } from "express";
import { addContent, deleteContent, getContent } from "../controllers/content.controller";
import { authMiddleware } from "../middlewares";


const router = Router()

router.use(authMiddleware)
router.route('/add-content').post(addContent)
router.route('/delete/:id').delete(deleteContent)
router.route('/').get(getContent)



export default router