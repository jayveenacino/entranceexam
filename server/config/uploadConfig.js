const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dateFolder = new Date().toISOString().split("T")[0];

        const uploadPath = path.join(process.cwd(), "uploads", dateFolder);

        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

module.exports = multer({ storage });
