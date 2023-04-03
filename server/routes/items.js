import express from 'express';
import { verifyToken } from "../middleware/auth.js"
import { createItem, fetchItems, completeItem, removeItem } from "../controllers/items.js";

const router = express.Router();

// CREATE
router.post("/create", verifyToken, createItem);

// READ
router.get("/:_id/:date", verifyToken, fetchItems);

// MODIFY
router.patch("/modify", verifyToken, completeItem);

// DELETE
router.delete("/remove", verifyToken, removeItem);

export default router;