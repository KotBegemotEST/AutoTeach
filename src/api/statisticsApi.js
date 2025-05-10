import axios from "axios";

const API_URL = "http://localhost:5000/api/statistics";

// 📌 Получение средней оценки
export const getAverageGrade = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/average-grade`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения средней оценки:", error);
        throw error;
    }
};

// 📌 Получение посещаемости
export const getAttendanceStats = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/attendance`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения посещаемости:", error);
        throw error;
    }
};

// 📌 Получение максимальной и минимальной оценки
export const getGradeExtremes = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/grades-extremes`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения крайних значений оценки:", error);
        throw error;
    }
};

// 📌 Получение количества уроков
export const getLessonsStats = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/lessons`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения количества уроков:", error);
        throw error;
    }
};

// 📌 Получение пропущенных занятий по месяцам
export const getMissedLessonsByMonth = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/missed-lessons-monthly`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения данных о пропущенных уроках:", error);
        throw error;
    }
};

export const getComparisonWithGroup = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/comparison`);
        console.log("✅ Сравнение с группой загружено:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения сравнения с группой:", error);
        throw error;
    }
};


export const getCorrelationBetweenGradesAndAttendance = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/correlation`);
        console.log("✅ Корреляция загружена:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения корреляции:", error);
        throw error;
    }
};


export const getLastAttendance = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/last-attendance`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения последнего посещения:", error);
        throw error;
    }
};

// 📌 Получение тренда оценок
export const getGradeTrend = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/grade-trend`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения тренда оценок:", error);
        throw error;
    }
};

// 📌 Получение тренда посещаемости
export const getAttendanceTrend = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/attendance-trend`);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка получения тренда посещаемости:", error);
        throw error;
    }
};


export const getAttendanceBreakdown = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/statistics/${studentId}/${subjectId}/attendance-breakdown`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga jaotuse toomisel:", error);
        throw error;
    }
};
