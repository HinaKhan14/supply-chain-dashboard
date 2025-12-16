import express from "express";
import BoothStatus from "../models/BoothStatus.js";

const router = express.Router();

// Save new booth item
router.post("/add-booth", async (req, res) => {
    console.log("Incoming booth Data:", req.body);
    try {
        const data = new BoothStatus(req.body);
        await data.save();
        res.status(201).json({ message: "Data saved successfully", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/get-booth-status/:boothNo", async (req, res) => {
    const { boothNo } = req.params;

    try {
        const status = await BoothStatus.findOne({ boothNum: boothNo });

        if (!status) {
            return res.json({ boothNum: boothNo, boothStatus: "inactive" });
        }

        res.json(status);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/get-all-booths-status", async (req, res) => {
    try {
        const status = await BoothStatus.find();

        res.json(status);
    } catch (err) {
        res.status(500).json(err);
    }
});



// router.put("/update-booth-status/:boothNo", async (req, res) => {
//     const { boothNo } = req.params;
//     const { boothStatus } = req.body;

//     if (!boothStatus) {
//         return res.status(400).json({ message: "boothStatus is required" });
//     }

//     try {
//         // Find booth and update it
//         const updatedBooth = await BoothStatus.findOneAndUpdate(
//             { boothNum: boothNo },
//             { boothStatus },
//             { new: true, upsert: false }   // return updated doc
//         );

//         if (!updatedBooth) {
//             return res.status(404).json({ message: "Booth not found" });
//         }

//         return res.json({
//             message: "Booth status updated successfully",
//             data: updatedBooth
//         });

//     } catch (error) {
//         console.error("Error updating booth status:", error);
//         return res.status(500).json({ message: "Server error", error });
//     }
// });
// 

router.put("/update-booth-status/:boothNo", async (req, res) => {
    const { boothNo } = req.params;
    const { boothStatus } = req.body;

    try {
        const updated = await BoothStatus.findOneAndUpdate(
            { boothNum: boothNo },  // MUST MATCH DB FIELD
            { boothStatus },
            { new: true, upsert: true }  // upsert ensures it always exists
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
