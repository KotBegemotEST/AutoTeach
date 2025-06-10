const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log("📩 Päringust saadud andmed:", req.body); // Logime sisendandmed

    db.query("SELECT * FROM Users WHERE email = ?", [email.trim()], async (err, results) => {
        if (err) return res.status(500).json({ message: "Serveri viga" });

        if (results.length === 0) {
            console.log("❌ E-posti ei leitud:", email);
            return res.status(401).json({ message: "Vale e-post või parool" });
        }

        const user = results[0];
        console.log("👤 Leitud kasutaja:", user);

        // 🔹 Kui parool EI OLE räsi, võrdleme otse
        if (!user.password.startsWith("$2b$10$")) {
            if (password !== user.password) {
                console.log("❌ Vale parool (pole räsitud)");
                return res.status(401).json({ message: "Vale e-post või parool" });
            }
        } 
        // 🔹 Kui parool on räsi, kasutame bcrypt
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log("❌ Vale parool (räsitud)");
                return res.status(401).json({ message: "Vale e-post või parool" });
            }
        }

        console.log("✅ Sisselogimine õnnestus:", user.email);
        res.json({ message: "Sisselogimine õnnestus", user });
    });
});

module.exports = router;
