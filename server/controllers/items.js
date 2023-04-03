import Item from "../models/Item.js";

// READ
export const fetchItems = async (req, res) => {
    try {
        const { _id, date } = req.params;
        const items = await Item.find({ userId: _id, createdAt: { $gte: new Date(date), $lte: new Date(date + 'T23:59:59Z') } });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// CREATE
export const createItem = async (req, res) => {
    try {
        const { userId, description } = req.body;
        const newItem = new Item({
            userId: userId,
            description,
            isCompleted: false,
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
        const { _id } = req.body;
        const item = await Item.findById(_id);
        item.isCompleted = !item.isCompleted;
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
        await Item.findByIdAndDelete(_id );

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}