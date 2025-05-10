const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log("📩 Данные из запроса:", req.body); // Логируем входящие данные

    db.query("SELECT * FROM Users WHERE email = ?", [email.trim()], async (err, results) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" });

        if (results.length === 0) {
            console.log("❌ Email не найден:", email);
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const user = results[0];
        console.log("👤 Найден пользователь:", user);

        // 🔹 Если пароль НЕ захеширован, просто сравниваем строки
        if (!user.password.startsWith("$2b$10$")) {
            if (password !== user.password) {
                console.log("❌ Пароль неверный (не хешированный)");
                return res.status(401).json({ message: "Неверный email или пароль" });
            }
        } 
        // 🔹 Если пароль захеширован, используем bcrypt
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log("❌ Пароль неверный (хешированный)");
                return res.status(401).json({ message: "Неверный email или пароль" });
            }
        }

        console.log("✅ Успешный вход:", user.email);
        res.json({ message: "Успешный вход", user });
    });
});

module.exports = router;
