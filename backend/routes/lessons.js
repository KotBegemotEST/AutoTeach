const express = require("express");
const router = express.Router();
const db = require("../config/db");

const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    if (isNaN(dateObj.getTime())) return null; // Проверка на валидность

    return dateObj.toISOString().split("T")[0]; // Оставляем только YYYY-MM-DD
};

router.get("/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        console.log(`📌 Получение уроков для группы ID: ${groupId}`);

        const query = `
            SELECT 
                u.id AS student_id, 
                u.name AS student_name,
                a.status AS attendance_status,
                a.comment AS attendance_comment,
                g.grade, 
                g.date AS grade_date, 
                s.name AS subject_name, 
                gr.name AS group_name,
                l.date AS lesson_date,
                l.topic AS lesson_topic,
                l.description AS lesson_description
            FROM users u
            LEFT JOIN attendance a ON u.id = a.studentId
            LEFT JOIN lessons l ON a.lessonId = l.id
            LEFT JOIN grades g ON a.gradeId = g.id
            LEFT JOIN subjects s ON l.subjectId = s.id
            LEFT JOIN \`groups\` gr ON u.groupId = gr.id
            WHERE u.groupId = ?
            ORDER BY l.date ASC;
        `;

        const [rows] = await db.promise().query(query, [groupId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Данные не найдены" });
        }

        res.json(rows);
    } catch (error) {
        console.error("❌ Ошибка при получении уроков:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.post("/add", async (req, res) => {
    console.log("📥 Полученные данные на сервере:", req.body);

    let { topic, description, duration, date, groupId, subjectId, teacherId, createdAt, students } = req.body;

    if (!topic || !groupId || !subjectId || !teacherId || !students || students.length === 0) {
        return res.status(400).json({ error: "Некорректные данные" });
    }

    if (!duration) duration = 1;

    // 🛠 Преобразуем дату урока в формат `YYYY-MM-DD`
    const formatDate = (inputDate) => {
        const dateObj = new Date(inputDate);
        return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split("T")[0];
    };

    const lessonDateFormatted = formatDate(date);
    if (!lessonDateFormatted) {
        return res.status(400).json({ error: "Некорректная дата урока" });
    }

    const createdAtFormatted = formatDate(createdAt) || formatDate(new Date());

    try {
        // ✅ Вставляем урок
        const [lessonResult] = await db.promise().query(
            `INSERT INTO lessons (topic, description, duration, date, groupId, subjectId, teacherId, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [topic, description, duration, lessonDateFormatted, groupId, subjectId, teacherId, createdAtFormatted]
        );

        const lessonId = lessonResult.insertId;
        console.log(`✅ Урок создан: ID ${lessonId}`);

        // ✅ Вставляем посещаемость
        const attendanceValues = students.map(student => [student.student_id, lessonId, student.attendance]);
        await db.promise().query(`INSERT INTO attendance (studentId, lessonId, status) VALUES ?`, [attendanceValues]);

        // ✅ Вставляем оценки (даже если они NULL)
        const gradesValues = students.map(student => [
            student.student_id, lessonId, subjectId, student.grade || null, createdAtFormatted
        ]);

        await db.promise().query(
            `INSERT INTO grades (studentId, lessonId, subjectId, grade, createdAt) VALUES ?`, 
            [gradesValues]
        );

        console.log(`✅ Оценки добавлены (с NULL, если нет) для ${students.length} учеников`);

        res.status(201).json({ message: "Урок успешно создан", lessonId });

    } catch (error) {
        console.error("❌ Ошибка при создании урока:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// ✅ Удаление урока и связанных с ним данных
router.post("/delete", async (req, res) => {
    try {
        const { lessonId } = req.body;

        if (!lessonId) {
            return res.status(400).json({ error: "Необходимо передать lessonId" });
        }

        console.log(`🗑 Удаление урока ID: ${lessonId}`);

        // 🛑 Удаляем оценки, связанные с этим уроком
        await db.promise().query(
            `DELETE FROM grades WHERE lessonId = ?`, 
            [lessonId]
        );

        // 🛑 Удаляем посещаемость, связанную с этим уроком
        await db.promise().query(
            `DELETE FROM attendance WHERE lessonId = ?`, 
            [lessonId]
        );

        // 🛑 Удаляем сам урок
        await db.promise().query(
            `DELETE FROM lessons WHERE id = ?`, 
            [lessonId]
        );

        res.json({ message: "✅ Урок и все связанные данные удалены" });
    } catch (error) {
        console.error("❌ Ошибка при удалении урока:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// 📌 Получение конкретного урока по ID
router.get("/details/:lessonId", async (req, res) => {
    const { lessonId } = req.params;

    try {
        const [rows] = await db.promise().query(
            `SELECT id, topic, description, duration, date 
             FROM lessons 
             WHERE id = ?`,
            [lessonId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Урок не найден" });
        }

        res.json(rows[0]); // Вернём только один объект
    } catch (error) {
        console.error("❌ Ошибка при получении урока по ID:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.post("/update", async (req, res) => {
    const { id, topic, description, duration, date } = req.body;

    if (!id || !topic || !description || !duration || !date) {
        return res.status(400).json({ error: "Puuduvad vajalikud andmed" });
    }

    try {
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ error: "Vigane kuupäev" });
        }

        const dateForSql = formattedDate.toISOString().split("T")[0];

        const [result] = await db.promise().query(
            `UPDATE lessons 
             SET topic = ?, description = ?, duration = ?, date = ?
             WHERE id = ?`,
            [topic, description, duration, dateForSql, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Tund ei leitud" });
        }

        res.json({ message: "✅ Tund edukalt uuendatud" });
    } catch (error) {
        console.error("❌ Viga tunni uuendamisel:", error);
        res.status(500).json({ error: "Serveri viga" });
    }
});



module.exports = router;
