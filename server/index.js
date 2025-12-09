const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const subjectRoutes = require("./routes/subjectRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");
const resultsRoutes = require("./routes/resultsRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/folders", folderRoutes);

mongoose
    .connect("mongodb://127.0.0.1:27017/entrance_exam")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("DB error:", err));

app.listen(5000, () => console.log("SERVER RUNNING ON PORT 5000"));