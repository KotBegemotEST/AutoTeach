import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import ActionButtons from "../components/ActionButtons";
import AddLessonModal from "../components/AddLessonModal";
import { getStudentGradesByGroupAndSubject } from "../api/studentApi";
import { createLesson } from "../api/lessonApi"; // добавлен
import '../styles/global.css';

const SubjDiary = ({ user }) => {
    const { groupId, subjectId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [lastLessonId, setLastLessonId] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const teacherId = user?.role === "TEACHER" ? user.id : null;

    const fetchData = async () => {
        try {
            const data = await getStudentGradesByGroupAndSubject(groupId, subjectId);
            if (!Array.isArray(data)) return;

            if (data.length > 0) {
                setGroupName(data[0].group_name);
                setSubjectName(data[0].subject_name);
            }

            setStudents(data);
            const uniqueLessons = [...new Set(data.map(item => item.lesson_id))].sort();
            setLessons(uniqueLessons);
            if (uniqueLessons.length > 0) {
                setLastLessonId(uniqueLessons[uniqueLessons.length - 1]);
            }
        } catch (error) {
            console.error("❌ Andmete laadimisel tekkis viga:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId, subjectId]);

    const handleSaveLesson = async (lessonData) => {
        try {
            setLoading(true);
            const oldLastLessonId = lastLessonId;

            await createLesson(lessonData);

            console.log("✅ Uus tund saadetud serverisse, kontrollime uuendusi...");
            let retries = 10;
            let updated = false;

            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const data = await getStudentGradesByGroupAndSubject(groupId, subjectId);

                const lessonIds = [...new Set(data.map(item => item.lesson_id))].sort();
                const newLastId = lessonIds[lessonIds.length - 1];
                if (newLastId && newLastId !== oldLastLessonId) {
                    updated = true;
                    break;
                }

                retries--;
            }

            if (updated) {
                await fetchData();
                setRefreshTrigger(prev => prev + 1);
                setIsModalOpen(false);
            } else {
                alert("❗ Uus tund ei ilmunud kohe tabelisse. Proovi käsitsi uuendada.");
            }
        } catch (error) {
            console.error("❌ Viga tunni salvestamisel:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Laen andmeid...</div>;

    return (
        <div>
            <ActionButtons 
                groupId={groupId} 
                subjectId={subjectId} 
                onAddLesson={() => setIsModalOpen(true)} 
                lastLessonId={lastLessonId}
            />

            <h1>📖 Päevik grupile {groupName}, aine {subjectName}</h1>
            {loading && <p style={{ color: "orange" }}>⏳ Ootan serveri kinnitust...</p>}

            <AddLessonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLesson}
                groupId={groupId}
                subjectId={subjectId}
                teacherId={teacherId}
            />

            <StudentTable refreshTrigger={refreshTrigger} />
        </div>
    );
};

export default SubjDiary;
