const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

router.get("/", async(req, res) => {
    try {
        const questions = await Question.find()
            .populate("subjectId", "name")
            .sort({ order: 1 });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to load questions" });
    }
});

router.post("/", async(req, res) => {
    try {
        const { subjectId, text, options, correct } = req.body;

        const newQuestion = new Question({
            subjectId,
            text,
            options,
            correct
        });

        await newQuestion.save();

        const populated = await newQuestion.populate("subjectId", "name");

        res.json(populated);
    } catch (err) {
        res.status(500).json({ error: "Failed to add question" });
    }
});

router.get("/:subjectId", async(req, res) => {
    try {
        const questions = await Question.find({ subjectId: req.params.subjectId })
            .populate("subjectId", "name")
            .sort({ order: 1 });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to load questions" });
    }
});

router.put("/:id", async(req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        ).populate("subjectId", "name");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update question" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete question" });
    }
});

module.exports = router;