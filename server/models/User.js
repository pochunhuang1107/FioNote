import mongoose from "mongoose";

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
    username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 50,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;