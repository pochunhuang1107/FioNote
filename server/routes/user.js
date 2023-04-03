import express from "express";
import { register, login } from "../controllers/users.js";

const router = express.Router();

// CREATE
router.post("/register", register);

// READ
router.post("/login", login);

export default router;