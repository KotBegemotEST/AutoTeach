const db = require("../config/db");

const Group = {
    getAll: (callback) => {
        db.query("SELECT * FROM `Groups` LIMIT 5", (err, results) => {
            if (err) {
                console.error("Ошибка SQL запроса:", err);
                return callback(err, null);
            }
            console.log("Результаты запроса:", results);
            callback(null, results);
        });
    }
};

module.exports = Group;
