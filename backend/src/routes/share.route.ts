import { Router } from "express";
import { shareLink, toggleShare } from "../controllers/share.controller";
import { authMiddleware } from "../middlewares";

const router = Router();

router.route("/").post(authMiddleware, toggleShare);
router.route("/:shareLink").get(shareLink);

export default router;
