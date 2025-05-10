import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAttendanceBreakdown } from "../api/statisticsApi";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AttendanceBreakdownChart = () => {
    const { studentId, subjectId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAttendanceBreakdown(studentId, subjectId)
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Viga kohaloleku laadimisel:", err);
                setLoading(false);
            });
    }, [studentId, subjectId]);

    if (loading) return <p>⏳ Laadimine...</p>;
    if (!data) return <p> Andmed puuduvad.</p>;

    const chartData = {
        labels: ["Kohal", "Hilines", "Puudus"],
        datasets: [
            {
                label: "Tundide arv",
                data: [data.present || 0, data.late || 0, data.absent || 0],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: "#fff"
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#fff" 
                }
            },
            y: {
                ticks: {
                    color: "#fff"
                }
            }
        }
    };

    return (
        <div style={{ maxWidth: 400 }}>
            <h2 className="h2Settings"> <span className="barChart"></span> Kohaloleku jaotus</h2>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default AttendanceBreakdownChart;
