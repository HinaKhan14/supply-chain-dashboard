import express from "express";
import mongoose from "mongoose";
import sheetImportRoute from "./services/getSheetData.js";
import 'dotenv/config';
import cors from "cors";
import boothDataRoute from "./routes/boothDataRoute.js"
import boothStatusRoute from "./routes/boothStatusRoute.js"
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors({
    origin: "*"
}));

app.use(express.json({ limit: "10mb" }));

// app.use(cors());
// app.use(express.json());          // 👈 REQUIRED
app.use(express.urlencoded({ extended: true })); // optional but useful


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✔");
    } catch (error) {
        console.error("MongoDB connection error ❌", error);
        process.exit(1);
    }
};
// Connect to MongoDB
// async function connectDB() {
//     await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");
// }

connectDB().catch(err => console.error(err));

// Use router
app.use("/api", sheetImportRoute);
app.use("/api", boothDataRoute);
app.use("/api", boothStatusRoute);
app.use("/api/auth", authRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
