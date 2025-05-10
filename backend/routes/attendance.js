const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Записываем посещаемость и оценку в разные таблицы
// ✅ Записываем посещаемость и оценку
router.post("/mark", async (req, res) => {
    try {
        let { studentId, lessonId, status, grade } = req.body;

        if (!studentId || !lessonId) {
            return res.status(400).json({ error: "Некорректные данные" });
        }

        // ✅ Если статус не передан, ставим "PRESENT" по умолчанию
        if (!status) status = "PRESENT";

        // 🟢 **Обновляем посещаемость и фиксируем время последнего сканирования**
        await db.promise().query(
            `INSERT INTO attendance (studentId, lessonId, status, last_scanned_at) 
             VALUES (?, ?, ?, NOW()) 
             ON DUPLICATE KEY UPDATE status=?, last_scanned_at=NOW()`,
            [studentId, lessonId, status, status]
        );

        // ✅ Если `grade` не передано, ставим `NULL`
        if (grade === undefined) {
            grade = null;
        }

        await db.promise().query(
            `INSERT INTO grades (studentId, lessonId, subjectId, grade, createdAt) 
             VALUES (?, ?, (SELECT subjectId FROM lessons WHERE id = ?), ?, NOW()) 
             ON DUPLICATE KEY UPDATE grade = IF(grades.grade IS NULL, VALUES(grade), grades.grade)`,
            [studentId, lessonId, lessonId, grade]
        );
        
        

        // 🟢 **Определяем, кто последний сканировал**
        const [[lastScanned]] = await db.promise().query(
            `SELECT u.name, a.last_scanned_at 
             FROM attendance a
             JOIN users u ON a.studentId = u.id
             WHERE a.lessonId = ?
             ORDER BY a.last_scanned_at DESC
             LIMIT 1`,
            [lessonId]
        );

        res.json({
            message: "✅ Посещение отмечено!",
            last_scanned: lastScanned || null // Кто последний сканировал
        });

    } catch (error) {
        console.error("❌ Ошибка:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// ✅ Получаем список студентов, кто отсканировал QR, включая оценки
router.get("/list", async (req, res) => {
    try {
        const { lessonId } = req.query;
        if (!lessonId) return res.status(400).json({ error: "Не передан lessonId" });

        console.log(`📌 Получаем список отсканировавших для урока ${lessonId}`);

        const [rows] = await db.promise().query(
            `SELECT u.name, a.status, g.grade 
             FROM attendance a
             JOIN users u ON a.studentId = u.id
             LEFT JOIN grades g ON a.studentId = g.studentId AND a.lessonId = g.lessonId
             WHERE a.lessonId = ?`, 
            [lessonId]
        );

        console.log("✅ Результаты запроса:", rows); // Логируем, что возвращается

        res.json(rows);
    } catch (error) {
        console.error("❌ Ошибка:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});



module.exports = router;
