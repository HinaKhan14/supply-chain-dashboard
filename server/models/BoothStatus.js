import mongoose from "mongoose";

const BoothStatusSchema = new mongoose.Schema({
    boothNum: { type: String, required: true, unique: true }, // unique key
    boothStatus: { type: String, default: "inactive" },
    // timestamps
}, { timestamps: true });

export default mongoose.model("BoothStatus", BoothStatusSchema);