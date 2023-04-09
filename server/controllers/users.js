import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
    try {
        const { firstName, lastName, username, password, email } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ firstName, lastName, username, password: passwordHash, email });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.email === 1) {
            res.status(400).send("This email already has an associated account. Please try another email.");
        } else if (err.code === 11000 && err.keyPattern.username === 1) {
            res.status(400).send("This username has already been taken. Please try another one.");
        } else {
            res.status(500).json({ error: err.message });
        }
    }
}
// LOGIN
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) return res.status(400).json({ msg: `User account ${username} does not exist.` });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
    try {
        const { requesterId, recipientEmail, recipientUsername } = req.body;
        const recipient = await User.findOne({ $or: [{ email: recipientEmail }, { username: recipientUsername }] });

        if (!recipient) {
            res.status(400).send("Cannot find the username.");
            return;
        }

        if (String(recipient._id) === requesterId) {
            res.status(400).send("You cannot add your own account.");
            return;
        }

        const requester = await User.findOne({ _id: requesterId, 'friends.user': recipient._id });
        if (requester) {
            res.status(400).send("Friends or awaiting your response.");
            return;
        }

        const existingRequest = recipient.friends.findIndex(friend => friend.user.equals(requesterId));

        if (existingRequest) {
            recipient.friends.push({
                user: requesterId,
            });
            await recipient.save();
            res.status(201).json({ data: "Successfully added user." });
        } else {
            res.status(400).send("Duplicated request.");
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (req, res) => {
    try {
        const { recipientId, requesterId } = req.body;
        const recipient = await User.findById(recipientId);
        const requester = await User.findById(requesterId);
        const existing = requester.friends.filter(friend => friend.user.toString()===recipientId);
        if(!existing.length){
            requester.friends.push({
                user: recipientId,
                pending: false,
                read: true,
            });
        }
        const requesterIndex = recipient.friends.findIndex(friend => friend.user.equals(requesterId));
        recipient.friends[requesterIndex].pending = false;
        await recipient.save();
        await requester.save();
        res.status(201).json(recipient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DECLINE FRIEND REQUEST
export const declineFriendRequest = async (req, res) => {
    try {
        const { recipientId, requesterId } = req.body;
        const recipient = await User.findById(recipientId);
        const requester = await User.findById(requesterId);
        const recipientIndex = requester.friends.findIndex(friend => friend.user.equals(recipientId));
        const requesterIndex = recipient.friends.findIndex(friend => friend.user.equals(requesterId));
        if (requesterIndex !== -1) {
            recipient.friends.pull(recipient.friends[requesterIndex]._id);
            await recipient.save();
        }
        if (recipientIndex !== -1) {
            requester.friends.pull(requester.friends[recipientIndex]._id);
            await requester.save();
        }
        res.status(204).json(recipient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// FETCH FRIENDS REQUESTS
export const fetchFriendRequests = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findById(_id).populate('friends.user', 'firstName lastName');
        const friendsRequests = user.friends.filter(friend => friend.pending === true);
        res.status(200).json(friendsRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// READ PROPERTY CHANGE
export const modifyRead = async (req, res) => {
    try {
        const { _id } = req.body;
        await User.updateOne({ _id: _id, "friends.read": false }, { $set: { "friends.$[].read": true } });

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// FETCH FRIENDS LIST
export const fetchFriendsList = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findById(_id).populate('friends.user', 'firstName lastName _id');
        const friendsList = user.friends.filter(friend => friend.pending === false);
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}