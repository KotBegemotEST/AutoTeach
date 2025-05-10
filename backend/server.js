require("dotenv").config();
const express = require("express");
const cors = require("cors");
const groupRoutes = require("./routes/groups");
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth"); // 👈 Добавили
const teacherRoutes = require("./routes/teachers");
const lessonRoutes = require("./routes/lessons"); 
const graderRoutes = require("./routes/grades"); 
const attendanceRoutes = require("./routes/attendance");
const statisticsRoutes = require("./routes/statistics");


const app = express();

app.use(cors());
app.use(express.json()); // Парсинг JSON
app.use("/api/groups", groupRoutes); // Роуты для групп
app.use("/api/students", studentRoutes);
app.use("/api", require("./routes/students"));
app.use("/api/lessons", lessonRoutes); // 👈 Добавляем новый маршрут
app.use("/api", authRoutes); // 👈 Используем роуты аутентификации
app.use("/api/teacher", teacherRoutes);
app.use("/api/grades", graderRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/statistics", statisticsRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});
