const db = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
    getAllStudents: (callback) => {
        db.query("SELECT * FROM users WHERE role='STUDENT'", callback);
    },
    create: async (name, email, password, role, groupId, callback) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (name, email, password, role, groupId) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, role, groupId], callback);
    }
};

module.exports = User;
