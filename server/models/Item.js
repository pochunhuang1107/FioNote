import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        min: 1,
        max: 100,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    dateCompleted: {
        type: Date,
        default: null,
    },
    pending: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Item = mongoose.model("item", itemSchema);

export default Item;