const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Обновление данных студента (оценка и посещаемость)
router.post("/update", async (req, res) => {
    try {
        const { studentId, lessonId, grade, attendance_status, attendance_comment, subjectId } = req.body;

        if (!studentId || !lessonId || !subjectId) {
            return res.status(400).json({ error: "Необходимо передать studentId, lessonId и subjectId" });
        }

        // 🛠 Если `grade` === "NO GRADE", ставим `NULL`
        const gradeValue = grade === "NO GRADE" ? null : grade;

        // ✅ Обновление оценки (если запись уже есть)
        if (grade !== undefined) {
            const [existingGrade] = await db.promise().query(
                `SELECT * FROM grades WHERE studentId = ? AND lessonId = ?`,
                [studentId, lessonId]
            );

            if (existingGrade.length > 0) {
                // Если запись есть — обновляем
                await db.promise().query(
                    `UPDATE grades SET grade = ?, createdAt = NOW() WHERE studentId = ? AND lessonId = ?`,
                    [gradeValue, studentId, lessonId]
                );
            } else {
                // Если записи нет — создаем
                await db.promise().query(
                    `INSERT INTO grades (studentId, lessonId, grade, subjectId, createdAt) VALUES (?, ?, ?, ?, NOW())`,
                    [studentId, lessonId, gradeValue, subjectId]
                );
            }
        }

        // ✅ Обновление посещаемости (если запись уже есть)
        if (attendance_status !== undefined) {
            const [existingAttendance] = await db.promise().query(
                `SELECT * FROM attendance WHERE studentId = ? AND lessonId = ?`,
                [studentId, lessonId]
            );

            if (existingAttendance.length > 0) {
                // Если запись есть — обновляем
                await db.promise().query(
                    `UPDATE attendance SET status = ?, comment = ?, createdAt = NOW() WHERE studentId = ? AND lessonId = ?`,
                    [attendance_status, attendance_comment, studentId, lessonId]
                );
            } else {
                // Если записи нет — создаем
                await db.promise().query(
                    `INSERT INTO attendance (studentId, lessonId, status, comment, createdAt) VALUES (?, ?, ?, ?, NOW())`,
                    [studentId, lessonId, attendance_status, attendance_comment]
                );
            }
        }

        res.json({ message: "✅ Данные обновлены" });
    } catch (error) {
        console.error("❌ Ошибка обновления данных:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;
