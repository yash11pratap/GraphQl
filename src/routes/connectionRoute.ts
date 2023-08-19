import express  from "express";
const router = express.Router();

import {protect} from "../controllers/authController";
import {follow,unfollow} from "../controllers/connectionController";

// For Logged-in users
router.use(protect);

router.post("/follow/:id", follow);
router.delete("/unfollow/:id", unfollow);

export default router;
