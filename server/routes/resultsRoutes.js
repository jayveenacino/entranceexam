const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const User = require("../models/User");
const ExamResult = require("../models/ExamResult");

// Get all folders
router.get("/folders", async (req, res) => {
    try {
        const folders = await Folder.find().sort({ createdAt: 1 });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get students by folderId
router.get("/students/:folderId", async (req, res) => {
    try {
        const { folderId } = req.params;

        const folder = await Folder.findById(folderId);
        if (!folder) return res.json([]);

        const results = await ExamResult.find({ folderId });
        const userIds = results.map(r => r.userId);

        const users = await User.find({ _id: { $in: userIds } });

        const merged = users.map(u => {
            const r = results.find(x => String(x.userId) === String(u._id));
            return {
                ...u.toObject(),
                totalScore: r?.totalScore || 0,
                subjectScores: r?.subjectScores || {}
            };
        });

        res.json(merged);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student's scores by userId
router.put("/update-score/:id", async (req, res) => {
    try {
        const newScores = req.body.subjectScores;
        const total = Object.values(newScores).reduce((sum, val) => sum + Number(val), 0);

        const updated = await ExamResult.findOneAndUpdate(
            { userId: req.params.id },
            { subjectScores: newScores, totalScore: total },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Result not found" });

        res.json({ success: true, message: "Scores updated", updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
