import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    referenceId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message = new mongoose.model("message", messageSchema);

export default Message;