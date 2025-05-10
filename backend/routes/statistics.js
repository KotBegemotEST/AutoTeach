const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 Средняя оценка
router.get("/:studentId/:subjectId/average-grade", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `SELECT AVG(grade) AS averageGrade FROM grades WHERE studentId = ? AND subjectId = ?`;
        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Ошибка получения средней оценки:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Посещаемость
router.get("/:studentId/:subjectId/attendance", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `
            SELECT 
                SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) AS attendedLessons,
                COUNT(*) AS totalLessons
            FROM attendance 
            JOIN lessons ON attendance.lessonId = lessons.id
            WHERE attendance.studentId = ? AND lessons.subjectId = ?
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Ошибка получения посещаемости:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Крайние значения оценок
router.get("/:studentId/:subjectId/grades-extremes", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `
            SELECT 
                MAX(grade) AS highestGrade,
                MIN(grade) AS lowestGrade
            FROM grades
            WHERE studentId = ? AND subjectId = ?
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Ошибка получения крайних значений оценок:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Количество уроков
router.get("/:studentId/:subjectId/lessons", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `SELECT COUNT(DISTINCT id) AS totalLessons FROM lessons WHERE subjectId = ?`;
        const [rows] = await db.promise().query(query, [subjectId]);

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Ошибка получения количества уроков:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// 📌 Пропущенные занятия по месяцам
router.get("/:studentId/:subjectId/missed-lessons-monthly", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `
            SELECT 
                DATE_FORMAT(l.date, '%Y-%m') AS month,
                COUNT(*) AS missedLessons
            FROM attendance a
            JOIN lessons l ON a.lessonId = l.id
            WHERE a.studentId = ? AND l.subjectId = ? AND a.status = 'ABSENT'
            GROUP BY month
            ORDER BY month ASC
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        res.json(rows);
    } catch (error) {
        console.error("❌ Ошибка получения данных по пропущенным урокам:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.get("/:studentId/:subjectId/comparison", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        if (!studentId || !subjectId) {
            return res.status(400).json({ error: "studentId и subjectId обязательны" });
        }

        const query = `
            SELECT 
                (SELECT AVG(grade) FROM grades WHERE studentId = ? AND subjectId = ?) AS studentAverage,
                (SELECT AVG(grade) FROM grades WHERE subjectId = ?) AS groupAverage
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId, subjectId]);

        if (!rows.length || !rows[0].studentAverage) {
            return res.status(404).json({ error: "Данные не найдены" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Ошибка получения сравнения с группой:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


router.get("/:studentId/:subjectId/correlation", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        if (!studentId || !subjectId) {
            return res.status(400).json({ error: "studentId и subjectId обязательны" });
        }

        const query = `
            SELECT 
                g.grade AS grade,
                (CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS attendance
            FROM grades g
            JOIN attendance a ON g.lessonId = a.lessonId AND g.studentId = a.studentId
            JOIN lessons l ON g.lessonId = l.id
            WHERE g.studentId = ? AND g.subjectId = ?
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        if (!rows.length) {
            return res.status(404).json({ error: "Нет данных для корреляции" });
        }

        // 📌 Формируем массив для расчета корреляции
        const grades = rows.map(row => row.grade);
        const attendance = rows.map(row => row.attendance);

        // 📌 Функция вычисления корреляции (Пирсона)
        const calculateCorrelation = (x, y) => {
            const n = x.length;
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
            const sumX2 = x.map(xi => xi ** 2).reduce((a, b) => a + b, 0);
            const sumY2 = y.map(yi => yi ** 2).reduce((a, b) => a + b, 0);

            const numerator = n * sumXY - sumX * sumY;
            const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

            return denominator === 0 ? 0 : numerator / denominator;
        };

        const correlationCoefficient = calculateCorrelation(grades, attendance);

        res.json({
            correlationCoefficient,
            dataPoints: rows.map(row => ({
                attendancePercentage: row.attendance * 100,
                grade: row.grade
            }))
        });
    } catch (error) {
        console.error("❌ Ошибка получения корреляции:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// 📌 Тренд оценок с датами занятий
router.get("/:studentId/:subjectId/grade-trend", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `
            SELECT 
                g.grade, 
                DATE_FORMAT(l.date, '%d.%m.%Y') AS lessonDate
            FROM grades g
            JOIN lessons l ON g.lessonId = l.id
            WHERE g.studentId = ? AND g.subjectId = ?
            ORDER BY l.date ASC
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        // Вернём массив объектов вида: { grade: 5, lessonDate: '01.03.2025' }
        res.json(rows);
    } catch (error) {
        console.error("❌ Ошибка получения тренда оценок:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// 📌 Тренд посещаемости с датами
router.get("/:studentId/:subjectId/attendance-trend", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;
        const query = `
            SELECT 
                (CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS attendance,
                DATE_FORMAT(l.date, '%d.%m.%Y') AS lessonDate
            FROM attendance a
            JOIN lessons l ON a.lessonId = l.id
            WHERE a.studentId = ? AND l.subjectId = ?
            ORDER BY l.date ASC
        `;
        const [rows] = await db.promise().query(query, [studentId, subjectId]);

        res.json(rows); // вернём объекты { attendance, lessonDate }
    } catch (error) {
        console.error("❌ Ошибка получения тренда посещаемости:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Täielik jaotus: kohal, hilines, puudus
router.get("/:studentId/:subjectId/attendance-breakdown", async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;

        const query = `
            SELECT 
                SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present,
                SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) AS late,
                SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent,
                COUNT(*) AS totalLessons
            FROM attendance a
            JOIN lessons l ON a.lessonId = l.id
            WHERE a.studentId = ? AND l.subjectId = ?
        `;

        const [rows] = await db.promise().query(query, [studentId, subjectId]);
        console.log(`📊 Kohaloleku jaotus õpilasele ${studentId} ja ainele ${subjectId}:`, rows[0]);

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Viga kohaloleku jaotuse laadimisel:", error);
        res.status(500).json({ error: "Serveri viga" });
    }
});


module.exports = router;
