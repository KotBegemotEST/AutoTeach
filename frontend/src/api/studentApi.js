import axios from "axios";

export const getStudentsByGroup = async (groupId) => {
    const response = await axios.get(`http://localhost:5000/api/students?groupId=${groupId}`);
    console.log("📌 Saadud õpilased:", response.data);

    return response.data;
};

export const getStudentGrades = async (studentId) => {
    const response = await axios.get(`http://localhost:5000/api/students/${studentId}/grades`);
    return response.data;
};

export const getStudentGradesByGroupAndSubject = async (groupId, subjectId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/students/${groupId}/grades/${subjectId}`);
        console.log("✅ Hinded on laetud:", response.data);

        return response.data;
    } catch (error) {
        console.error("Viga hinnete toomisel:", error);
        return null;
    }
};

export const updateStudentGrade = async (updatedData) => {
    console.log("📤 Saadame uuendatud andmed:", updatedData); // Lisatud

    try {
        const response = await axios.post("http://localhost:5000/api/grades/update", updatedData, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("✅ Andmed on edukalt uuendatud!");
        return response.data;
    } catch (error) {
        console.error("❌ Viga andmete uuendamisel:", error.response?.data || error);
        throw error;
    }
};

export const markAttendance = async ({ studentId, lessonId, grade }) => {
    console.log("📡 Saadame andmed serverisse:", { studentId, lessonId, grade });

    const payload = {
        studentId,
        lessonId,
        status: "PRESENT"
    };

    if (grade !== undefined) {
        payload.grade = grade;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/attendance/mark", payload);
        console.log("✅ Server vastas:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Viga kohaloleku märkimisel:", error);
        throw error;
    }
};

export const getLessonAttendanceAndGrades = async (lessonId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/lessons/${lessonId}/students`);
        return response.data;
    } catch (error) {
        console.error("❌ Viga kohaloleku ja hinnete toomisel:", error);
        throw error;
    }
};
