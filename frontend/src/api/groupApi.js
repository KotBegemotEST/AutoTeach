import axios from "axios";

export const getGroups = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/groups");
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке групп:", error);
        return [];
    }
};
export const getStudentsByGroup = async (groupId) => {
    const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`);
    return response.data;
};