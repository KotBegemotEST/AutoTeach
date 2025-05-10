import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const AttendanceTrendChart = ({ attendance }) => {
    if (!attendance || attendance.length === 0) {
        return <p>Pole piisavalt andmeid kohaloleku trendi kuvamiseks.</p>;
    }

    const labels = attendance.map(item => item.lessonDate);
    const dataPoints = attendance.map(item => item.attendance * 100);

    const data = {
        labels,
        datasets: [
            {
                label: "Kohalolek (%)",
                data: dataPoints,
                fill: false,
                borderColor: "green",
                tension: 0.2,
                pointBackgroundColor: attendance.map(item => item.attendance ? "green" : "red"),
                pointRadius: 5,
            },
        ],
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
        <div className="attendance-trend-chart summary-right box">
            <h2 className="h2Settings"> <span className="attendenceTrend"></span>  Kohaloleku trend</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default AttendanceTrendChart;
