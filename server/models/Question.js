const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    text: { type: String, required: true },
    options: {
        A: String,
        B: String,
        C: String,
        D: String
    },
    correct: { type: String, required: true },
    order: { type: Number, default: 0 }
});

module.exports = mongoose.model("Question", QuestionSchema);