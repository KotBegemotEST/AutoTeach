import React, { useState, useRef, useEffect } from "react";
import { updateStudentGrade } from "../api/studentApi";
import "../styles/editableCell.css";

const EditableCell = ({ studentId, lessonId, initialGrade, initialStatus, initialComment, onClose, subjectId }) => {
    const [grade, setGrade] = useState(initialGrade || "");
    const [isLate, setIsLate] = useState(initialStatus === "LATE");
    const [isAbsent, setIsAbsent] = useState(initialStatus === "ABSENT");
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleSave();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [grade, isLate, isAbsent]);

    const handleSave = async () => {
        const newStatus = isAbsent ? "ABSENT" : isLate ? "LATE" : "PRESENT";
        const newComment = isAbsent ? "Puudumine" : isLate ? "Hilinemine" : "Kohal";

        const updatedData = {
            studentId,
            lessonId,
            grade: grade || null,
            subjectId,
            attendance_status: newStatus,
            attendance_comment: newComment,
        };

        try {
            await updateStudentGrade(updatedData);
        } catch (error) {
            console.error("❌ Viga salvestamisel:", error);
        }

        onClose();
    };

    return (
        <div ref={containerRef} className="editable-cell" style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "5px",
            background: "#f4f4f4",
            border: "1px solid #ccc"
        }}>
            <input
                type="number"
                placeholder="Hinne"
                min="1"
                max="5"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={isLate}
                    onChange={() => { setIsLate(!isLate); setIsAbsent(false); }}
                />
                H
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={isAbsent}
                    onChange={() => { setIsAbsent(!isAbsent); setIsLate(false); }}
                />
                P
            </label>
        </div>
    );
};

export default EditableCell;
