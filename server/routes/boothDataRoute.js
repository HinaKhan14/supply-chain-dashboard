import express from "express";
import BoothData from "../models/BoothData.js";

const router = express.Router();

/* ================= ADD SINGLE ROW ================= */
router.post("/add-booth-data", async (req, res) => {
    try {
        const data = new BoothData(req.body);
        await data.save();
        res.status(201).json({ message: "Data saved successfully", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================= GET BOOTH DATA (DATE-WISE) ================= */
router.get("/get-booth-data/:boothNo", async (req, res) => {
    const { boothNo } = req.params;
    const { date } = req.query; // yyyy-mm-dd

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    try {
        const data = await BoothData.find({
            boothNo,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: 1 });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ================= UPDATE START TIME ================= */
router.put("/update-start-time", async (req, res) => {
    const { no, startTime } = req.body;

    try {
        const updated = await BoothData.findByIdAndUpdate(
            no,
            { startTime },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Row not found" });

        res.json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* ================= UPDATE END TIME ================= */
router.put("/update-end-time", async (req, res) => {
    const { no, endTime, totalTime } = req.body;

    try {
        const updated = await BoothData.findByIdAndUpdate(
            no,
            { endTime, TotalTime: totalTime },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Row not found" });

        res.json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* ================= GET ACTIVE PRODUCT (TODAY ONLY) ================= */
router.get("/get-active-product/:boothNo", async (req, res) => {
    const { boothNo } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const activeRow = await BoothData.findOne({
            boothNo,
            startTime: { $ne: "" },
            endTime: "",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });

        res.json(activeRow || null);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/* ================= DELETE ROW ================= */
router.delete("/delete-booth-row/:id", async (req, res) => {
    try {
        const deleted = await BoothData.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send("Row not found");
        res.send("Row deleted successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

/* ================= COMMENTS ================= */
router.put("/update-comment", async (req, res) => {
    try {
        const { id, comment } = req.body;
        const updated = await BoothData.findByIdAndUpdate(
            id,
            { comment },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/get-comment/:id", async (req, res) => {
    try {
        const row = await BoothData.findById(req.params.id);
        res.json({ comment: row.comment || "" });
    } catch {
        res.status(500).send("Error fetching comment");
    }
});

/* ================= CSV UPLOAD ================= */
router.post("/upload-booth-csv", async (req, res) => {
    try {
        const { boothId, rows } = req.body;

        const formattedRows = rows.map(row => ({
            boothNo: boothId, // ✅ FIXED
            material: row["Material"] || "",
            materialDescription: row["Material Description"] || "",
            setupHrs: row["Setup Hrs"] || "",
            processHrs: row["Process Hrs"] || "",
            totalHrs: row["Total Hrs"] || "",
            startTime: "",
            endTime: "",
            TotalTime: "",
        }));

        await BoothData.insertMany(formattedRows);

        res.json({ message: "CSV uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "CSV upload failed" });
    }
});

export default router;
