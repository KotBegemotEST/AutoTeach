import React from "react";
import { Line } from "react-chartjs-2";

const GradeTrendChart = ({ grades }) => {
    if (!grades || grades.length === 0) return <p> Pole piisavalt andmeid graafiku jaoks.</p>;

    const labels = grades.map(item => item.lessonDate);
    const dataPoints = grades.map(item => item.grade);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Hinded",
                data: dataPoints,
                borderColor: "blue",
                fill: false,
                tension: 0.2,
                pointBackgroundColor: "blue",
                pointRadius: 5,
                spanGaps: true
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
        <div className="dynamic-chart summary-left box">
            <h2 className="h2Settings"> <span className="gradeTrend"></span> Hinnete dünaamika</h2>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default GradeTrendChart;
