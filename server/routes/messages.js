import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { fetchMessages, modifyMessageRead } from "../controllers/message.js";

const router = express.Router();

// FETCH
router.get("/fetch/:_id", verifyToken, fetchMessages);

// MODIFY READ
router.patch("/read", verifyToken, modifyMessageRead);

export default router;