import axios from "axios";

export const getTeacherGroups = async (teacherId) => {
    try {
        console.log("Serveri taotlus õpetajale:", teacherId);
        const response = await axios.get(`http://localhost:5000/api/teacher/groups/${teacherId}`);
        console.log("Õpetaja API andmed:", response.data);
        return response.data;
    } catch (error) {
        console.error("Viga õpetajagruppide laadimisel:", error);
        return [];
    }
};
