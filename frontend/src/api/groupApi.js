import axios from "axios";


export const getGroups = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/groups");
        return response.data;
    } catch (error) {
        console.error("❌ Viga rühmade laadimisel:", error);
        return [];
    }
};


export const getStudentsByGroup = async (groupId) => {
    const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`);
    return response.data;
};
