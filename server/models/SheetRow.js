// models/SheetRow.js
import mongoose from "mongoose";

const sheetRowSchema = new mongoose.Schema({}, { strict: false });
// strict:false allows dynamic columns

export default mongoose.model("SheetRow", sheetRowSchema);
