const bcrypt = require("bcrypt");

const generateHash = async () => {
    const password = "admin1"; // Пароль для админа
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Захешированный пароль:", hashedPassword);
};

generateHash();
