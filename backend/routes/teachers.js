const express = require("express");
const db = require("../config/db");
const router = express.Router();

// 🔹 Получаем предметы и группы преподавателя
router.get("/groups/:teacherId", (req, res) => {
    const teacherId = req.params.teacherId;

    const sql = `
    SELECT s.name AS subject,
    s.id AS subjectId,  -- ✅ Добавляем ID предмета
    g.name AS groupName, 
    g.id AS groupId
    FROM TeacherSubjects ts
    JOIN Subjects s ON ts.subjectId = s.id
    JOIN \`Groups\` g ON ts.groupId = g.id
    WHERE ts.teacherId = ?
`;


    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("Ошибка получения данных:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        res.json(results);
    });
});

module.exports = router;
