import express from 'express';
import { verifyToken } from "../middleware/auth.js"
import { createItem, fetchItems, completeItem, removeItem,
    sendTask, fetchTaskRequest, acceptTaskRequest, deleteTaskRequest, modifyTaskRead,
} from "../controllers/items.js";

const router = express.Router();

// CREATE
router.post("/create", verifyToken, createItem);

// READ
router.get("/:_id/:date", verifyToken, fetchItems);

// MODIFY
router.patch("/modify", verifyToken, completeItem);

// DELETE
router.delete("/remove", verifyToken, removeItem);

// SEND TASK
router.post("/request/send", verifyToken, sendTask);

// FETCH TASK
router.get("/request/fetch/:_id", verifyToken, fetchTaskRequest);

// READ TASK
router.patch("/request/read", verifyToken, modifyTaskRead);

// ACCEPT TASK
router.patch("/request/accept", verifyToken, acceptTaskRequest);

// DELETE TASK
router.delete("/request/delete", verifyToken, deleteTaskRequest);

export default router;