import axios from "axios";

export const getStudentsByGroup = async (groupId) => {
    const response = await axios.get(`http://localhost:5000/api/students?groupId=${groupId}`);
    console.log("📌 Полученные студенты:", response.data);

    return response.data;
};

export const getStudentGrades = async (studentId) => {
    const response = await axios.get(`http://localhost:5000/api/students/${studentId}/grades`);
    return response.data;
};

export const getStudentGradesByGroupAndSubject = async (groupId, subjectId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/students/${groupId}/grades/${subjectId}`);
        console.log("✅ Оценки загружены:", response.data);

        return response.data;
    } catch (error) {
        console.error("Ошибка при получении оценок:", error);
        return null;
    }
};


export const updateStudentGrade = async (updatedData) => {
    console.log("📤 Отправляем обновленные данные:", updatedData); // Добавили

    try {
        const response = await axios.post("http://localhost:5000/api/grades/update", updatedData, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("✅ Данные успешно обновлены!");
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при обновлении данных:", error.response?.data || error);
        throw error;
    }
};


export const markAttendance = async ({ studentId, lessonId, grade }) => {
    console.log("📡 Отправляем данные на сервер:", { studentId, lessonId, grade });

    const payload = {
        studentId,
        lessonId,
        status: "PRESENT"
    };

    // ❗ Добавляем grade только если он явно передан
    if (grade !== undefined) {
        payload.grade = grade;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/attendance/mark", payload);
        console.log("✅ Сервер ответил:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при отметке посещаемости:", error);
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
