import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import '../styles/addLessonModal.css';
import '../styles/global.css';

const ActionButtons = ({ onAddLesson, lastLessonId }) => {
    const [showQR, setShowQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);
    const [lastScannedUser, setLastScannedUser] = useState(null);

    const handleGenerateQR = async () => {
        if (!lastLessonId) {
            alert("Tundi ei ole loodud – QR-koodi ei saa genereerida!");
            return;
        }
    
        // ✅ Проверка существования урока
        try {
            const checkResponse = await fetch(`/api/lessons/${lastLessonId}`);
            if (!checkResponse.ok) {
                alert("Tund on kustutatud – QR-koodi ei saa genereerida!");
                return;
            }
        } catch (error) {
            console.error("❌ Viga tunni kontrollimisel:", error);
            alert("Viga tunni kontrollimisel – QR-koodi ei saa genereerida!");
            return;
        }
    
        const qrCodeText = `${window.location.origin}/lesson/${lastLessonId}`;
        setQrCodeUrl(qrCodeText);
        setShowQR(true);
        fetchAttendance(lastLessonId);
    };
    

    const fetchAttendance = async (lessonId) => {
        try {
            const response = await fetch(`/api/mark/list?lessonId=${lessonId}`);
            const data = await response.json();
            setAttendanceList(data);
            if (data.length > 0) {
                setLastScannedUser(data[0].name);
            }
        } catch (error) {
            console.error("❌ Viga kohaloleku laadimisel:", error);
        }
    };

    useEffect(() => {
        if (!lastLessonId) return;
        fetchAttendance(lastLessonId);
        const interval = setInterval(() => {
            fetchAttendance(lastLessonId);
        }, 1000);
        return () => clearInterval(interval);
    }, [lastLessonId]);

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            setShowQR(false);
        }
    };

    return (
        <div className="buttons-block">
            <button onClick={onAddLesson}>➕ Lisa tund</button>
            <button onClick={handleGenerateQR} style={{ marginLeft: "10px" }}>
                📄 Genereeri QR-kood
            </button>

            {showQR && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span
                            onClick={() => setShowQR(false)}
                            className="close-button"
                            aria-label="Sulge"
                        >
                            ❌
                        </span>

                        <h3>QR-kood tunnile {lastLessonId}</h3>
                        <QRCodeCanvas value={qrCodeUrl} size={256} />
                        <p>{qrCodeUrl}</p>

                        <h4>📌 Kes on skaneerinud:</h4>
                        <ul>
                            {attendanceList.length > 0 ? (
                                attendanceList.map((student, index) => (
                                    <li key={index}>
                                        {student.name} – {student.status} (Hinne: {student.grade})
                                    </li>
                                ))
                            ) : (
                                <p>❌ Keegi pole veel skaneerinud</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionButtons;
