const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Получение студентов по ID группы
router.get("/", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) {
        return res.status(400).json({ message: "Не указан ID группы" });
    }

    db.query("SELECT * FROM Users WHERE groupId = ?", [groupId], (err, results) => {
        if (err) {
            console.error("Ошибка SQL:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        console.log("📌 Студенты перед отправкой на фронт:", results);
        res.json(results);
    });
});

const checkStudentExists = async (studentId) => {
    try {
        const result = await db.execute("SELECT id FROM Users WHERE id = ? AND role = 'STUDENT'", [studentId]);

        console.log("Результат запроса checkStudentExists:", result); // Выводим, что вернул запрос

        if (!Array.isArray(result) || result.length < 1) {
            return false; // Если результат не массив или пустой — значит, студента нет
        }

        const [rows] = result; // Теперь безопасно берем первую часть результата
        return rows.length > 0;
    } catch (error) {
        console.error("Ошибка при проверке студента:", error);
        return false;
    }
};


// Получение оценок студента по ID
router.get("/:id/grades", async (req, res) => {
    const studentId = req.params.id;

    try {
        const exists = await checkStudentExists(studentId);
        if (!exists) {
            return res.status(404).json({ error: "Студент не найден" });
        }

        const [grades] = await db.execute(
            `SELECT g.grade, g.createdAt AS date, s.name AS subject
             FROM Grades g
             JOIN Subjects s ON g.subjectId = s.id
             WHERE g.studentId = ? ORDER BY g.createdAt ASC`, [studentId]
        );

        res.json(grades);
    } catch (error) {
        console.error("Ошибка при получении оценок:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});



router.get("/:groupId/grades/:subjectId", async (req, res) => {
    try {
        const { groupId, subjectId } = req.params;
        console.log(`📌 Получение уроков для группы ID: ${groupId} и предмета ID: ${subjectId}`);

        const query = `
        WITH UniqueGrades AS (
            SELECT 
                g.*, 
                ROW_NUMBER() OVER (PARTITION BY g.studentId, g.lessonId ORDER BY g.createdAt DESC) AS rn
            FROM grades g
        ),
        UniqueAttendance AS (
            SELECT 
                a.*, 
                ROW_NUMBER() OVER (PARTITION BY a.studentId, a.lessonId ORDER BY a.createdAt DESC) AS rn
            FROM attendance a
        )
        SELECT 
            u.id AS student_id,
            u.name AS student_name,
            COALESCE(ua.status, 'NO ATTENDANCE') AS attendance_status, 
            COALESCE(ua.comment, 'NO COMMENT') AS attendance_comment,
            COALESCE(ug.grade, 'NO GRADE') AS grade,  
            DATE(l.date) AS lesson_date,
            s.name AS subject_name,
            s.id as subject_id,
            gr.name AS group_name,
            l.id AS lesson_id,  
            l.topic AS lesson_topic,
            l.description AS lesson_description
        FROM users u
        JOIN lessons l 
            ON u.groupId = l.groupId 
            AND l.subjectId = ? 
        LEFT JOIN UniqueGrades ug 
            ON ug.studentId = u.id 
            AND ug.lessonId = l.id  
            AND ug.rn = 1  
        LEFT JOIN UniqueAttendance ua 
            ON ua.studentId = u.id 
            AND ua.lessonId = l.id  
            AND ua.rn = 1 
        LEFT JOIN subjects s 
            ON l.subjectId = s.id
        LEFT JOIN \`groups\` gr 
            ON u.groupId = gr.id
        WHERE u.groupId = ? 
        ORDER BY l.date ASC;
        `;

        // ✅ Исполняем SQL-запрос с параметрами
        const [rows] = await db.promise().query(query, [subjectId, groupId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Данные не найдены" });
        }

        res.json(rows);
    } catch (error) {
        console.error("❌ Ошибка при получении уроков:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});




module.exports = router;
