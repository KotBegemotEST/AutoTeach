import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { markAttendance } from "../api/studentApi";
import "../styles/addLessonModal.css";

const QRScanner = ({ studentId, isOpen, onClose }) => {
    const [scanStatus, setScanStatus] = useState("Skaneerimine...");
    const [scanResult, setScanResult] = useState(null);
    const [scannedLessons, setScannedLessons] = useState(new Set());
    const scannerRef = useRef(null);
    const scannerId = "reader";

    useEffect(() => {
        if (!isOpen) return;

        const initScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode(scannerId);
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 5, qrbox: { width: 250, height: 250 } },
                    (decodedText) => decodedText && handleScan(decodedText),
                    (error) => {
                        console.warn("Viga skaneerimisel:", error);
                        setScanStatus("Ei õnnestunud tuvastada. Proovi uuesti.");
                    }
                );
            } catch (err) {
                console.error("Skanneri käivitamise viga:", err);
            }
        };

        initScanner();

        return () => stopScannerSafely();
    }, [isOpen]);

    const stopScannerSafely = async () => {
        const scanner = scannerRef.current;
        if (!scanner) return;

        try {
            const state = await scanner.getState();
            if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
                await scanner.stop();
                await scanner.clear();
            }
        } catch (err) {
            console.warn("Viga peatamisel:", err);
        }
    };

    const handleScan = async (lessonUrl) => {
        try {
            const url = new URL(lessonUrl);
            const lessonId = url.pathname.split("/").pop();

            if (!lessonId || isNaN(lessonId)) throw new Error("Vigane lessonId");
            if (scannedLessons.has(lessonId)) {
                setScanStatus("Sa juba skaneerisid selle koodi!");
                return;
            }

            await markAttendance({ studentId, lessonId });
            setScanStatus("Kohalolek edukalt märgitud!");
            setScanResult(lessonUrl);
            setScannedLessons(prev => new Set(prev).add(lessonId));

            await stopScannerSafely();
        } catch (error) {
            console.error("Märkimise viga:", error);
            setScanStatus("Viga kohaloleku märkimisel.");
        }
    };
    const handleRestart = async () => {
        setScanStatus("Skaneerimine...");
        setScanResult(null);
        await stopScannerSafely();

        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 5, qrbox: { width: 250, height: 250 } },
                (decodedText) => decodedText && handleScan(decodedText),
                (error) => {
                    console.warn("Viga skaneerimisel:", error);
                    setScanStatus("Ei õnnestunud tuvastada. Proovi uuesti.");
                }
            );
        } catch (error) {
            console.error("Taaskäivitamise viga:", error);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            closeScanner();
        }
    };

    const closeScanner = async () => {
        await stopScannerSafely();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
                <button 
                    onClick={closeScanner}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "15px",
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer"
                    }}
                    aria-label="Sulge"
                    className="hov"
                >
                    ❌
                </button>

                <h3>QR-koodi skaneerimine</h3>
                <div id={scannerId} style={{ marginTop: "10px" }}></div>

                {scanStatus && (
                    <p style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        color: scanStatus.includes("✅") ? "green" : scanStatus.includes("❌") ? "red" : "black"
                    }}>
                        {scanStatus}
                    </p>
                )}

                {scanResult && <p>🔍 Skaneeritud: {scanResult}</p>}

                {scanResult && (
                    <button 
                        className="hov"
                        onClick={handleRestart}
                        style={{
                            marginTop: "10px",
                            padding: "8px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        🔄 Taaskäivita skanner
                    </button>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
