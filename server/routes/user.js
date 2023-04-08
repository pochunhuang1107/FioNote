import express from "express";
import { verifyToken } from "../middleware/auth.js"
import { register, 
        login, 
        sendFriendRequest, 
        fetchFriendRequests, 
        acceptFriendRequest, 
        declineFriendRequest,
        modifyRead,
        fetchFriendsList,
} from "../controllers/users.js";

const router = express.Router();

// ACCOUNT
// create
router.post("/register", register);

// read
router.post("/login", login);

// FRIEND REQUEST
// request
router.post("/friends/request", verifyToken, sendFriendRequest);
// accept
router.post("/friends/accept", verifyToken, acceptFriendRequest);
// decline/remove
router.post("/friends/decline", verifyToken, declineFriendRequest);
// fetch
router.get("/friends/fetch/:_id", verifyToken, fetchFriendRequests);
// modify read
router.post("/friends/read", verifyToken, modifyRead);

// FRIEND LIST
// fetch
router.get("/friends/list/:_id", verifyToken, fetchFriendsList);

export default router;