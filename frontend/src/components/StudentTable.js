import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentRow from "./StudentRow";
import AddLessonModal from "./AddLessonModal";
import { getStudentsByGroup, getStudentGradesByGroupAndSubject } from "../api/studentApi";
import { deleteLesson, updateLesson } from "../api/lessonApi";
import "../styles/studentTable.css";
import "../styles/global.css";

const getColumnsPerPage = () => {
    const width = window.innerWidth;
    if (width < 600) return 3;
    if (width < 1000) return 5;
    return 7;
};

const StudentTable = ({ refreshTrigger }) => {
    const { groupId, subjectId } = useParams();
    const [students, setStudents] = useState([]);
    const [gradesData, setGradesData] = useState([]);
    const [lessons, setLessons] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [columnsPerPage, setColumnsPerPage] = useState(getColumnsPerPage());
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setColumnsPerPage(getColumnsPerPage());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchData = async () => {
        try {
            const students = await getStudentsByGroup(groupId);
            setStudents(students);

            const grades = await getStudentGradesByGroupAndSubject(groupId, subjectId);
            if (Array.isArray(grades)) {
                setGradesData(grades);

                const lessonMap = {};
                grades.forEach(g => {
                    if (!lessonMap[g.lesson_date]) {
                        lessonMap[g.lesson_date] = g.lesson_id;
                    }
                });
                setLessons(lessonMap);
            }
        } catch (error) {
            console.error("❌ Viga laadimisel:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId, subjectId, refreshTrigger]);

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Kustutada tund?")) return;
        await deleteLesson(lessonId);
        fetchData();
    };

    const handleEditLesson = (lessonId, lessonDate) => {
        setSelectedLesson({ id: lessonId, date: lessonDate });
        setModalOpen(true);
    };

    const allDates = Object.keys(lessons).sort();
    const startIndex = currentPage * columnsPerPage;
    const currentDates = allDates.slice(startIndex, startIndex + columnsPerPage);

    return (
        <div>
            <h2>Õpilaste nimekiri ({subjectId})</h2>

            <div className="pagination">
                <button className="hov" disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)}>⬅️ Eelmised</button>
                <span className="pageCounter">{currentPage + 1} / {Math.ceil(allDates.length / columnsPerPage)}</span>
                <button className="hov" disabled={(startIndex + columnsPerPage) >= allDates.length} onClick={() => setCurrentPage(prev => prev + 1)}>➡️ Järgmised</button>
            </div>

            <table border="1" className="studentTable">
                <thead>
                    <tr>
                        <th className="tableTitle">Nimi</th>
                        {currentDates.map(date => {
                            const d = new Date(date);
                            const formattedDate = d.toLocaleDateString("et-EE", { day: "2-digit", month: "2-digit" });
                            return (
                                <th className="lesson-date-cell"key={date} style={{ backgroundColor: "#add8e6" }}>
                                    <button onClick={() => handleDeleteLesson(lessons[date])} className="deleteBtn hovDel">Kustutada</button>
                                    <div onClick={() => handleEditLesson(lessons[date], date)} style={{ cursor: "pointer" }}>{formattedDate}</div>
                                </th>
                            );
                        })}
                        <th className="tableTitle">Statistika</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <StudentRow
                                key={student.id}
                                student={student}
                                dates={currentDates}
                                allGrades={gradesData}
                                subjectId={subjectId}
                                onViewStats={(studentId) => navigate(`/statistics/${studentId}/${subjectId}`)}
                                onUpdate={fetchData}
                            />
                        ))
                    ) : (
                        <tr><td colSpan={columnsPerPage + 2}>❌ Õpilased puuduvad</td></tr>
                    )}
                </tbody>
            </table>

            {showSuccess && <div className="success-message">Tund oli edukalt loodud ✅</div>}

<AddLessonModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    groupId={groupId}
    subjectId={subjectId}
    teacherId={localStorage.getItem("teacherId")}
    isEdit={true}
    lessonId={selectedLesson?.id}
    lessonDate={selectedLesson?.date}
    onSave={async (lessonData) => {
        await updateLesson(lessonData); 
        setModalOpen(false);
        fetchData();
    }}
/>

        </div>
    );
};

export default StudentTable;
