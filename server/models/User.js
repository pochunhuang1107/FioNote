import mongoose, { Schema } from "mongoose";

const friendsSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    pending: {
        type: Boolean,
        default: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        min: 4,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 50,
    },
    friends: [friendsSchema],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;