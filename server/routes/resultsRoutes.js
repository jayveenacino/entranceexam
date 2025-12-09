const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const User = require("../models/User");
const ExamResult = require("../models/ExamResult");

router.get("/folders", async (req, res) => {
    try {
        const folders = await Folder.find().sort({ createdAt: 1 });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/students", async (req, res) => {
    try {
        const users = await User.find();

        const merged = await Promise.all(
            users.map(async (u) => {
                const result = await ExamResult.findOne({ userId: u._id });

                return {
                    ...u.toObject(),
                    totalScore: result?.totalScore || 0,
                    subjectScores: result?.subjectScores || {}
                };
            })
        );

        res.json(merged);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/update-score/:id", async (req, res) => {
    try {
        const newScores = req.body.subjectScores;

        const total = Object.values(newScores).reduce((sum, val) => sum + Number(val), 0);

        const updated = await ExamResult.findOneAndUpdate(
            { userId: req.params.id },
            { 
                subjectScores: newScores,
                totalScore: total
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Result not found" });
        }

        res.json({
            success: true,
            message: "Scores updated",
            updated
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
