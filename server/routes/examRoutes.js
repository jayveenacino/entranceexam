const express = require("express");
const router = express.Router();
const ExamResult = require("../models/ExamResult");
const Question = require("../models/Question");
const Subject = require("../models/Subject");

router.post("/submit", async (req, res) => {
    try {
        const { userId, answers } = req.body;

        const subjects = await Subject.find();

        let subjectScores = {};
        let subjectMap = {};

        subjects.forEach(sub => {
            const key = sub.name.toLowerCase().replace(/\s+/g, "");
            subjectScores[key] = 0;
            subjectMap[sub._id.toString()] = key;
        });

        const questions = await Question.find();
        let totalScore = 0;

        questions.forEach(q => {
            const qid = q._id.toString();
            const correctAnswer = q.correct;

            if (answers[qid] === correctAnswer) {
                totalScore++;

                const subjId = q.subjectId?.toString();
                const subjectKey = subjectMap[subjId];

                if (subjectKey) {
                    subjectScores[subjectKey] += 1;
                }
            }
        });

        const result = new ExamResult({
            userId,
            answers,
            totalScore,
            subjectScores
        });

        await result.save();

        res.json({
            success: true,
            totalScore,
            subjectScores,
            result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

router.get("/result/:userId", async (req, res) => {
    try {
        const result = await ExamResult.findOne({ userId: req.params.userId });

        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
