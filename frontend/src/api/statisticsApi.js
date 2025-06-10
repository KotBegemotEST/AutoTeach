import axios from "axios";

const API_URL = "http://localhost:5000/api/statistics";


export const getAverageGrade = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/average-grade`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga keskmise hinde toomisel:", error);
        throw error;
    }
};

export const getAttendanceStats = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/attendance`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga kohalolekustatistika toomisel:", error);
        throw error;
    }
};

// 📌 Maksimaalse ja minimaalse hinde toomine
export const getGradeExtremes = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/grades-extremes`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga äärmushinnete toomisel:", error);
        throw error;
    }
};

// 📌 Tundide arvu toomine
export const getLessonsStats = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/lessons`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga tundide arvu toomisel:", error);
        throw error;
    }
};

// 📌 Kuupõhine puudumiste statistika
export const getMissedLessonsByMonth = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/missed-lessons-monthly`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga kuupõhiste puudumiste toomisel:", error);
        throw error;
    }
};

// 📌 Võrdlus grupiga
export const getComparisonWithGroup = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/comparison`);
        console.log("✅ Võrdlus grupiga laaditud:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Viga võrdluse toomisel grupiga:", error);
        throw error;
    }
};

// 📌 Hinnete ja kohaloleku korrelatsiooni toomine
export const getCorrelationBetweenGradesAndAttendance = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/correlation`);
        console.log("✅ Korrelatsioon laaditud:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Viga korrelatsiooni toomisel:", error);
        throw error;
    }
};

// 📌 Viimase kohaloleku toomine
export const getLastAttendance = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/last-attendance`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga viimase kohaloleku toomisel:", error);
        throw error;
    }
};

// 📌 Hinnete trendi toomine
export const getGradeTrend = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/grade-trend`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga hinnete trendi toomisel:", error);
        throw error;
    }
};

// 📌 Kohaloleku trendi toomine
export const getAttendanceTrend = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/attendance-trend`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga kohaloleku trendi toomisel:", error);
        throw error;
    }
};

// 📌 Kohaloleku jaotus (nt puudumised, hilinemised jne)
export const getAttendanceBreakdown = async (studentId, subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}/${subjectId}/attendance-breakdown`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga jaotuse toomisel:", error);
        throw error;
    }
};
