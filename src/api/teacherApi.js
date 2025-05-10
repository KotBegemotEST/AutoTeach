import axios from "axios";

export const getTeacherGroups = async (teacherId) => {
    try {
        console.log("📢 Запрос на сервер для преподавателя:", teacherId);
        const response = await axios.get(`http://localhost:5000/api/teacher/groups/${teacherId}`);
        console.log("✅ API Данные для преподавателя:", response.data); // Логируем данные
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при загрузке групп преподавателя:", error);
        return [];
    }
};
