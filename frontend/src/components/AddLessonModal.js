import { useState, useEffect } from "react";
import { getStudentsByGroup, getStudentGradesByGroupAndSubject } from "../api/studentApi";
import "../styles/addLessonModal.css";
import "../styles/global.css";

const AddLessonModal = ({
    isOpen,
    onClose,
    groupId,
    subjectId,
    teacherId,
    isEdit = false,
    lessonId = null,
    lessonDate = null,
    onSave
}) => {
    const toLocalDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [lessonTopic, setLessonTopic] = useState("");
    const [lessonDescription, setLessonDescription] = useState("");
    const [lessonDuration, setLessonDuration] = useState(45);
    const [date, setDate] = useState(toLocalDateString(new Date()));
    const [students, setStudents] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (isEdit && lessonDate) {
                fetchLessonFromGrades();
            } else {
                resetForm();
            }
        }
    }, [isOpen, isEdit, lessonDate]);

    const resetForm = async () => {
        setLessonTopic("");
        setLessonDescription("");
        setLessonDuration(45);
        setDate(toLocalDateString(new Date()));

        try {
            const studentData = await getStudentsByGroup(groupId);
            const initializedStudents = studentData.map(student => ({
                student_id: student.id,
                student_name: student.name,
                attendance: "ABSENT",
                grade: null
            }));
            setStudents(initializedStudents);
        } catch (error) {
            console.error("❌ Viga õpilaste laadimisel:", error);
            setStudents([]);
        }
    };

    const fetchLessonFromGrades = async () => {
        try {
            const allGrades = await getStudentGradesByGroupAndSubject(groupId, subjectId);
            const lessonGrades = allGrades.filter(g => g.lesson_date?.startsWith(lessonDate));

            if (lessonGrades.length > 0) {
                const first = lessonGrades[0];
                setLessonTopic(first.lesson_topic || "");
                setLessonDescription(first.lesson_description || "");
                setLessonDuration(first.duration || 45);
                setDate(toLocalDateString(first.lesson_date) || toLocalDateString(new Date()));

                const studentsProcessed = lessonGrades.map(s => ({
                    student_id: s.student_id,
                    student_name: s.student_name,
                    grade: s.grade === "NO GRADE" ? null : s.grade || ""
                }));

                setStudents(studentsProcessed);
            }
        } catch (error) {
            console.error("❌ Viga hinnete kaudu andmete laadimisel:", error);
        }
    };

    const handleSave = async () => {
        if (!lessonTopic.trim() || !lessonDuration || !date.trim()) {
            alert("Palun täitke teema, kestus ja kuupäev!");
            return;
        }

        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            alert("Vigane kuupäev! Palun valige korrektne kuupäev.");
            return;
        }

        const lessonData = {
            id: isEdit ? lessonId : undefined,
            topic: lessonTopic,
            description: lessonDescription,
            duration: lessonDuration,
            date: toLocalDateString(formattedDate),
            groupId,
            subjectId,
            teacherId: Number(teacherId),
            students: students.map(s => ({
                ...s,
                grade: s.grade === "" ? null : s.grade,
            }))
        };

        setIsSaving(true);
        await onSave(lessonData); // ✨ Делегируем сохранение родителю
        setIsSaving(false);
    };

    const updateStudentData = (studentId, key, value) => {
        setStudents(prev =>
            prev.map(s =>
                s.student_id === studentId ? { ...s, [key]: value } : s
            )
        );
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span onClick={onClose} className="close-button" aria-label="Sulge">❌</span>
                <div className="lesson-form">
                    <h2>{isEdit ? "Muuda tund" : "Lisa tund"}</h2>

                    <label>Kuupäev:</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />

                    <label>Teema:</label>
                    <input type="text" value={lessonTopic} onChange={e => setLessonTopic(e.target.value)} />

                    <label>Kirjeldus:</label>
                    <textarea value={lessonDescription} onChange={e => setLessonDescription(e.target.value)} />

                    <label>Kestus (min):</label>
                    <input type="number" value={lessonDuration} onChange={e => setLessonDuration(e.target.value)} />

                    {!isEdit && (
                        <>
                            <h3>Kohalolek ja hinded:</h3>
                            {students.map(student => (
                                <div key={student.student_id} className="student-row">
                                    <span>{student.student_name}</span>
                                    <select value={student.attendance} onChange={e => updateStudentData(student.student_id, "attendance", e.target.value)}>
                                        <option value="PRESENT">✅ Kohal</option>
                                        <option value="LATE">⏳ Hilines</option>
                                        <option value="ABSENT">🚫 Puudus</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Hinne"
                                        min="1"
                                        max="5"
                                        value={student.grade || ""}
                                        onChange={e => updateStudentData(student.student_id, "grade", e.target.value)}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    <div className="buttons-block">
                        <button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Salvestan..." : "Salvesta"}
                        </button>
                        <button onClick={onClose}>Tühista</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLessonModal;
