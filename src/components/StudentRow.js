import React, { useState } from "react";
import EditableCell from "./EditableCell";

const StudentRow = ({ student, dates, subjectId, allGrades, onViewStats, onUpdate }) => {
    const [editingCell, setEditingCell] = useState(null);

    return (
        <tr>
            <td>{student.name}</td>
            {dates.map(date => {
                const formattedDate = new Date(date).toISOString().split("T")[0];
                const records = allGrades.filter(g => g.student_id === student.id && g.lesson_date.split("T")[0] === formattedDate);
                const key = `${student.id}-${formattedDate}`;

                if (records.length === 0) {
                    return <td key={key} onClick={() => setEditingCell(key)}>—</td>;
                }

                return (
                    <td key={key} onClick={() => setEditingCell(key)}>
                        {editingCell === key ? (
                            <EditableCell
                                studentId={student.id}
                                lessonId={records[0].lesson_id}
                                subjectId={records[0].subject_id}
                                initialGrade={records[0].grade}
                                initialStatus={records[0].attendance_status}
                                initialComment={records[0].attendance_comment}
                                onClose={() => {
                                    setEditingCell(null);
                                    onUpdate();
                                }}
                            />
                        ) : (
                            <>
                                {records.map((record, index) => {
                                    const grade = record.grade && record.grade !== "NO GRADE" ? record.grade : "";
                                    const status = record.attendance_status === "ABSENT" ? "P" :
                                                   record.attendance_status === "LATE" ? "H" : "";
                                    const display = grade && status ? `${grade} / ${status}` : grade || status;
                                    return <div key={index}>{display}</div>;
                                })}
                            </>
                        )}
                    </td>
                );
            })}
            <td>
                <button onClick={() => onViewStats(student.id)} className="viewStatsBtn">
                    📊 Vaata statistikat
                </button>
            </td>
        </tr>
    );
};

export default StudentRow;
