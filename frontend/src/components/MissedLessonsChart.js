import React, { useEffect, useState } from "react";
import { getMissedLessonsByMonth } from "../api/statisticsApi";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const MissedLessonsChart = () => {
    const { studentId, subjectId } = useParams();
    const [missedLessons, setMissedLessons] = useState([]);

    useEffect(() => {
        getMissedLessonsByMonth(studentId, subjectId)
            .then(data => {
                setMissedLessons(data);
            })
            .catch(error => {
                console.error("Viga puudutud tundide laadimisel:", error);
            });
    }, [studentId, subjectId]);

    const chartData = {
        labels: missedLessons.map(entry => entry.month),
        datasets: [
            {
                label: "Puudutud tunnid",
                data: missedLessons.map(entry => entry.missedLessons),
                backgroundColor: "red",
                borderColor: "red",
                borderWidth: 2,
                fill: false,
            }
        ]
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
        <div className="missed-lessons-chart">
            <h2 className="h2Settings"> <span className="absence"></span> Puudumised kuude lõikes</h2>
            {missedLessons.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
            ) : (
                <p> Puudumiste andmed puuduvad.</p>
            )}
        </div>
    );
};

export default MissedLessonsChart;
