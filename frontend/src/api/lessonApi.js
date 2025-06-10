import axios from "axios";

// 📌 Uue tunni loomine
export const createLesson = async (lessonData) => {
    try {
        const response = await axios.post("http://localhost:5000/api/lessons/add", lessonData);
        return response.data;
    } catch (error) {
        console.error("❌ Viga tunni saatmisel serverisse:", error);
        throw error;
    }
};

// 📌 Tunni kustutamine
export const deleteLesson = async (lessonId) => {
    try {
        console.log(`📤 Saadame kustutamise päringu tunni ID-ga: ${lessonId}`);
        const response = await axios.post("http://localhost:5000/api/lessons/delete", { lessonId });
        console.log("✅ Tund on kustutatud:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Viga tunni kustutamisel:", error);
        throw error;
    }
};

// 📌 Tunni detailide toomine
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
