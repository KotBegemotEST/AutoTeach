import axios from "axios";


export const createLesson = async (lessonData) => {
    try {
        const response = await axios.post("http://localhost:5000/api/lessons/add", lessonData);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при отправке урока на сервер:", error);
        throw error;
    }
};

export const deleteLesson = async (lessonId) => {
    try {
        console.log(`📤 Отправляем запрос на удаление урока ID: ${lessonId}`);
        const response = await axios.post("http://localhost:5000/api/lessons/delete", { lessonId });
        console.log("✅ Урок удален:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при удалении урока:", error);
        throw error;
    }
};

export const getLessonDetails = async (lessonId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/lessons/${lessonId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga tunni andmete toomisel:", error);
        throw error;
    }
};

export const updateLesson = async (lessonData) => {
    try {
        const response = await axios.post("http://localhost:5000/api/lessons/update", lessonData);
        return response.data;
    } catch (error) {
        console.error("❌ Viga tunni uuendamisel:", error);
        throw error;
    }
};
