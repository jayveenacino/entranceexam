const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");

router.post("/", async(req, res) => {
    try {
        const folder = new Folder(req.body);
        await folder.save();
        res.json(folder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async(req, res) => {
    try {
        const folders = await Folder.find().sort({ createdAt: 1 });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete("/:id", async(req, res) => {
    try {
        await Folder.findByIdAndDelete(req.params.id);
        res.json({ message: "Folder deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;