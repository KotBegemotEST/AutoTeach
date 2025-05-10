import React, { useEffect, useState } from "react";
import { getGroups } from "../api/groupApi";
import { getTeacherGroups } from "../api/teacherApi";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const GroupList = ({ user }) => {
    const [groups, setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(user);
    const navigate = useNavigate();

    const updateUserFromStorage = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        if (!currentUser) return;

        console.log("🔄 Uuendame gruppe kasutaja jaoks:", currentUser);

        if (currentUser.role === "TEACHER") {
            getTeacherGroups(currentUser.id)
                .then(data => {
                    console.log("✅ Saadud grupid:", data);
                    setGroups(data || []);
                })
                .catch(error => console.error("❌ API viga:", error));
        } else if (currentUser.role === "ADMIN") {
            getGroups()
                .then(data => {
                    console.log("✅ Kõik grupid laaditud:", data);
                    setGroups(data || []);
                })
                .catch(error => console.error("❌ API viga:", error));
        }
    }, [currentUser]);

    useEffect(() => {
        window.addEventListener("storage", updateUserFromStorage);
        return () => {
            window.removeEventListener("storage", updateUserFromStorage);
        };
    }, []);

    if (!currentUser) {
        return <p>Laadimine...</p>;
    }

    if (currentUser.role === "STUDENT") {
        return <p>Sul ei ole ligipääsu gruppide nimekirjale.</p>;
    }

    return (
        <div>
            <h2>{currentUser.role === "TEACHER" ? "Minu õppeained ja rühmad" : "Kõikide rühmade nimekiri"}</h2>
            <ul className="subjectList">
                {groups.length === 0 ? (
                    <p>❌ Ühtegi rühma pole saadaval</p>
                ) : (
                    groups.map((group, index) => (
                        <li className="groupItem"
                            key={group.groupId || index}
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            onClick={() =>  navigate(`/group/${group.groupId}/subject/${group.subjectId}`)}
                        >
                            {currentUser.role === "TEACHER" 
                                ? `📚 ${group.subject} - 👥 ${group.groupName}` 
                                : `${group.name} (${group.groupCode}) - ${group.year}`
                            }
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default GroupList;
