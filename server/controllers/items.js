import Item from "../models/Item.js";
import Message from "../models/Message.js";

// READ
export const fetchItems = async (req, res) => {
    try {
        const { _id, date } = req.params;
        const items = await Item.find({ userId: _id, pending: false, $or: [{ dateCompleted: null }, { dateCompleted: { $eq: new Date(Number(date)) } }] });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// CREATE
export const createItem = async (req, res) => {
    try {
        const { userId, description, dateCreated } = req.body;
        const newItem = new Item({
            userId,
            description,
            dateCreated: dateCreated,
            createdBy: userId
        });
        await newItem.save();

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// MODIFY
export const completeItem = async (req, res) => {
    try {
        const { _id, date } = req.body;
        const item = await Item.findById(_id);
        item.isCompleted = !item.isCompleted;
        if (item.isCompleted) {
            item.dateCompleted = date;
        } else {
            item.dateCompleted = null;
        }
        item.save();

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE
export const removeItem = async (req, res) => {
    try {
        const { _id } = req.body;

        await Item.findByIdAndDelete(_id);
        
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// SEND TASK REQUEST
export const sendTask = async (req, res) => {
    try {
        const { requester, recipient, description, dateCreated } = req.body;
        const newItem = new Item({
            userId: recipient,
            description,
            dateCreated,
            pending: true,
            createdBy: requester,
            read: false,
        });
        
        await newItem.save();

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// FETCH TASK REQUEST
export const fetchTaskRequest = async (req, res) => {
    try {
        const { _id } = req.params;
        const taskRequests = await Item.find({ userId: _id, pending: true });
        res.status(200).json(taskRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// READ TASK REQUEST
export const modifyTaskRead = async (req, res) => {
    try {
        const { _id } = req.body;
        await Item.updateMany({ userId: _id, read: false }, { $set: { read: true } });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ACCEPT TASK REQUEST
export const acceptTaskRequest = async (req, res) => {
    try {
        const { _id } = req.body;
        const taskRequests = await Item.findById(_id);
        taskRequests.pending = false;
        await taskRequests.save();

        const item = await Item.findById(_id);
        if (item.userId !== item.createdBy){
            const newMessage = new Message({
                referenceId: _id,
                type: "Item",
                userId: item.createdBy,
                content: `Task: ${item.description} has been accepted`,
                from: item.userId,
            });
            await newMessage.save();
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE TASK REQUEST
export const deleteTaskRequest = async (req, res) => {
    try {
        const { _id } = req.body;

        const item = await Item.findById(_id);
        if (item.userId !== item.createdBy){
            const newMessage = new Message({
                referenceId: _id,
                type: "Item",
                userId: item.createdBy,
                content: `Task: ${item.description} has been declined`,
                from: item.userId,
            });
            await newMessage.save();
        }

        await Item.deleteOne({ _id: _id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}