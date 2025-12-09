const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async(req, res) => {
    try {
        const normalizedName = req.body.name.trim().toLowerCase();

        const exists = await User.findOne({
            name: { $regex: new RegExp("^" + normalizedName + "$", "i") }
        });

        if (exists) {
            return res.status(400).json({
                error: "This name is already registered!",
                user: exists
            });
        }

        req.body.name = req.body.name.trim();

        const user = new User(req.body);
        await user.save();

        return res.status(201).json({
            message: "Registration successful",
            user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;