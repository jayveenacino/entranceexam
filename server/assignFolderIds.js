const mongoose = require("mongoose");
const ExamResult = require("./models/ExamResult");
const Folder = require("./models/Folder");

async function assignFolderIds() {
    await mongoose.connect("mongodb://localhost:27017/entrance_exam");

    const folders = await Folder.find();

    for (const folder of folders) {
        const folderDate = new Date(folder.folderName);
        if (isNaN(folderDate)) continue;

        const start = new Date(folderDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(folderDate);
        end.setHours(23, 59, 59, 999);

        await ExamResult.updateMany(
            { createdAt: { $gte: start, $lte: end } },
            { $set: { folderId: folder._id } }
        );

        console.log(`Updated examresults for folder: ${folder.folderName}`);
    }

    await mongoose.disconnect();
    console.log("Done assigning folderIds.");
}

assignFolderIds().catch(console.error);
