import express from "express";
import axios from "axios";
import csv from "csvtojson";
import SheetRow from "../models/SheetRow.js";

const router = express.Router();

router.get("/import-sheet", async (req, res) => {
    console.log("inside")
    try {
        const sheetURL =
            "https://docs.google.com/spreadsheets/d/1ksHRrNtvxOy2bEpKR__7PsTavmGJN4yz0az91xLoZ9w/export?format=csv";

        // Fetch CSV
        const response = await axios.get(sheetURL);

        // Convert CSV → JSON
        const jsonData = await csv().fromString(response.data);
        // Insert into MongoDB
        await SheetRow.insertMany(jsonData);

        res.json({
            success: true,
            rowsInserted: jsonData.length,
            msg: "Google Sheet imported successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to import sheet" });
    }
});

// GET all rows from MongoDB
router.get("/sheet-data", async (req, res) => {
    console.log("Backend HIT!");
    try {
        const data = await SheetRow.find(); // get all documents
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

export default router;
