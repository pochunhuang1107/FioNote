import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import itemRoutes from "./routes/items.js";
import messageRoutes from "./routes/messages.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/myapp";;
const SOCKET_IO_ORIGIN = process.env.SOCKET_IO_ORIGIN || "http://localhost:3000";

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/messages", messageRoutes);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    const server = app.listen(PORT, () => console.log(`Server successfully started on port ${PORT}`));

    const io = new Server(server, {
        cors: {
            origin: SOCKET_IO_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const users = {};
    io.on("connection", (socket) => {

        socket.on("user connected", (userId) => {
            users[userId] = socket.id;
            console.log(`User ${userId} connected with socket ID ${socket.id} `);
        })

        socket.on("send_message", (data) => {
            const recipientSocketId = users[data.id];
            io.to(recipientSocketId).emit("receive_message");
        });

        socket.on("disconnect", () => {
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            console.log(`User ${userId} disconnected with socket ${socket.id} `);
            delete users[userId];
        });
    });
}).catch(err => console.log(`Server failed to connect due to ${err}`));