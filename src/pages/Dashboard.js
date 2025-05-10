import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupList from "../components/GroupList";
import QRScanner from "../components/QRscanner";
import '../styles/dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            navigate("/login");
        }

        setLoading(false);
    }, [navigate]);

    if (loading) return <p>Laadimine...</p>;
    if (!user) return <p>Ümbersuunamine...</p>;

    return (
        <div className="dashboard-container">
            <h1>Tere tulemast, {user.name}!</h1>

            <GroupList user={user} />

            {user.role === "STUDENT" && (
                <div style={{ marginTop: "20px" }}>
                    <button
                        onClick={() => setShowScanner(true)}
                        style={{
                            padding: "10px 15px",
                            fontSize: "16px",
                            cursor: "pointer",
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    >
                        📷 Skaneeri QR-kood
                    </button>

                    <QRScanner
                        studentId={user.id}
                        isOpen={showScanner}
                        onClose={() => setShowScanner(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
