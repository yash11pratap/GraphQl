import express  from "express";
const router = express.Router();

import {protect,getUserFromToken,signup,login} from "../controllers/authController";

router.get("/", protect, getUserFromToken);
router.post("/signup", signup);
router.post("/login", login);

export default router;
