const mongoose = require("mongoose");

const ExamResultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    answers: { type: Object, required: true },

    totalScore: { type: Number, required: true },
    subjectScores: { type: Object, required: true },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExamResult", ExamResultSchema);
