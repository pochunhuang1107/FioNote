import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import itemRoutes from "./routes/items.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server successfully started on port ${PORT}`));
}).catch(err => console.log(`Server failed to connect due to ${err}`));