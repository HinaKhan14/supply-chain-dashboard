import mongoose from "mongoose";

const BoothDataSchema = new mongoose.Schema({
    material: { type: String, required: true }, // unique key
    materialDescription: { type: String },
    setupHrs: { type: String },
    processHrs: { type: String },
    totalHrs: { type: String },
    boothNo: { type: String },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    TotalTime: { type: String, default: "" },
    comment: { type: String, default: '' }
    // timestamps
}, { timestamps: true });

export default mongoose.model("BoothData", BoothDataSchema);