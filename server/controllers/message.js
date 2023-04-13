import Message from "../models/Message.js";

// FETCH
export const fetchMessages = async (req, res) => {
    try {
        const { _id } = req.params;
        const messages = await Message.find({ userId: _id, read: false});
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// MODIFY READ PROPERTY
export const modifyMessageRead = async (req, res) => {
    try {
        const { _id } = req.body;
        await Message.updateMany({ userId: _id, read: false }, { $set: { read: true } });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}