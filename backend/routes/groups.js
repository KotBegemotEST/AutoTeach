const db = require("../config/db");
const express = require("express");
const router = express.Router();
const Group = require("../models/groupModel");

router.get("/", (req, res) => {
    Group.getAll((err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "Ошибка получения групп" });
        } else {
            res.json(results);
        }
    });
});

// Получение списка студентов по groupId
router.get("/:groupId/students", (req, res) => {
    const { groupId } = req.params;
    db.query("SELECT * FROM `User` WHERE groupId = ?", [groupId], (err, results) => {
        if (err) {
            console.error("Ошибка получения студентов:", err);
            return res.status(500).json({ message: "Ошибка получения студентов" });
        }
        res.json(results);
    });
});




module.exports = router;
