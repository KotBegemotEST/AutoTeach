import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComparisonWithGroup } from "../api/statisticsApi";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ComparisonWithGroup = () => {
    const { studentId, subjectId } = useParams();
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getComparisonWithGroup(studentId, subjectId)
            .then(data => {
                setComparisonData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Viga rühma võrdluse laadimisel:", error);
                setLoading(false);
            });
    }, [studentId, subjectId]);

    if (loading) return <p>⏳ Laadimine...</p>;
    if (!comparisonData) return <p>Võrdlusandmed puuduvad.</p>;

    const chartData = {
        labels: ["Õpilase keskmine hinne", "Rühma keskmine hinne"],
        datasets: [
            {
                label: "Võrdlus",
                data: [comparisonData.studentAverage, comparisonData.groupAverage],
                backgroundColor: ["blue", "gray"],
                borderColor: ["blue", "gray"],
                borderWidth: 1
            }
        ]
    };

    const options = {
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
        <div className="comparison-chart">
            <h2 className="h2Settings"> <span className="compression"></span> Võrdlus rühmaga</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default ComparisonWithGroup;
