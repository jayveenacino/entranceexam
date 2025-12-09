const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    firstCourse: { type: String, required: true },
    secondCourse: { type: String, default: "" },
    sex: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: String, required: true },
    pob: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    contact: { type: String, required: true },
    guardian: { type: String, required: true },
    lastSchool: { type: String, required: true },
    lastSchoolAddress: { type: String, default: "" },
    transferee: { type: Boolean, default: false },
    transfereeCourse: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);