import Item from "../models/Item.js";

// READ
export const fetchItems = async (req, res) => {
    try {
        const { _id, date } = req.params;
        const items = await Item.find({ userId: _id, $or: [{ dateCompleted: null }, { dateCompleted: { $eq: new Date(Number(date)) } }] });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// CREATE
export const createItem = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, description, dateCreated } = req.body;
        const newItem = new Item({
            userId,
            description,
            dateCreated: dateCreated,
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
        console.log(typeof date);
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