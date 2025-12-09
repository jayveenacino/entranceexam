const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

router.get("/", async(req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: "Failed to load subjects" });
    }
});

router.post("/", async(req, res) => {
    try {
        const subject = new Subject({
            name: req.body.name
        });

        await subject.save();
        res.json(subject);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to add subject" });
    }
});

router.put("/:id", async(req, res) => {
    try {
        const updated = await Subject.findByIdAndUpdate(
            req.params.id, { name: req.body.name }, // ← FIXED
            { new: true }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: "Failed to update subject" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete subject" });
    }
});

module.exports = router;