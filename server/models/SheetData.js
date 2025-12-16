import mongoose from "mongoose";

const SheetDataSchema = new mongoose.Schema({
    material: { type: String, required: true, unique: true }, // unique key
    materialDescription: { type: String },
    setupHrs: { type: Number },
    processHrs: { type: Number },
    totalHrs: { type: Number },

    // helper: store hash of the row to detect changes quickly
    rowHash: { type: String },

    // timestamps
}, { timestamps: true });

export default mongoose.model("SheetData", SheetDataSchema);
