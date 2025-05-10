import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
    getAverageGrade, 
    getAttendanceStats, 
    getGradeExtremes, 
    getLessonsStats,
    getGradeTrend,  
    getAttendanceTrend  
} from "../api/statisticsApi";

import AttendanceSummary from "../components/AttendanceSummary";
import MissedLessonsChart from "../components/MissedLessonsChart";
import ComparisonWithGroup from "../components/ComparisonWithGroup";
import AttendanceBreakdownChart from "../components/AttendanceBreakdownChart";
import GradeTrendChart from "../components/GradeTrendChart";
import AttendanceTrendChart from "../components/AttendanceTrendChart";  
import '../styles/global.css'
import '../styles/statistic.css'


const StatisticsPage = () => {
    const { studentId, subjectId } = useParams();
    const [averageGrade, setAverageGrade] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [gradeExtremes, setGradeExtremes] = useState(null);
    const [lessons, setLessons] = useState(null);
    const [gradeTrend, setGradeTrend] = useState([]);  
    const [attendanceTrend, setAttendanceTrend] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(10);  // ✅ Kuvatavate andmete arv

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const avgGrade = await getAverageGrade(studentId, subjectId);
                const attendanceData = await getAttendanceStats(studentId, subjectId);
                const gradeData = await getGradeExtremes(studentId, subjectId);
                const lessonsData = await getLessonsStats(studentId, subjectId);
                const gradeTrendData = await getGradeTrend(studentId, subjectId); 
                const attendanceTrendData = await getAttendanceTrend(studentId, subjectId); 

                setAverageGrade(avgGrade);
                setAttendance(attendanceData);
                setGradeExtremes(gradeData);
                setLessons(lessonsData);
                setGradeTrend(gradeTrendData);  
                setAttendanceTrend(attendanceTrendData);  
                setLoading(false);
            } catch (error) {
                console.error("Statistika laadimisel tekkis viga:", error);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [studentId, subjectId]);

    if (loading) return <p>Laadimine...</p>;


    const displayedGrades = gradeTrend.slice(-displayCount);
    const displayedAttendance = attendanceTrend.slice(-displayCount);

    return (
        <div className="statistic-container">
            <h2 className="h2Settings"> <span className="statisticImg"></span> Statistika üliõpilase kohta</h2>
            <div className="statistic-summary">
                <div className="summary-left box">
                {averageGrade && <p>Keskmine hinne: <b>{averageGrade.averageGrade}</b></p>}
                {attendance && (
                    <AttendanceSummary attendance={attendance.attendedLessons} totalLessons={attendance.totalLessons} />
                )}
                {gradeExtremes && (
                    <p>Hinded: max <b>{gradeExtremes.highestGrade}</b>, min <b>{gradeExtremes.lowestGrade}</b></p>
                )}
                </div>
                <div className="summary-right box">
                    
                    {lessons && <p>Kokku tunde: <b>{lessons.totalLessons}</b></p>}
                    <AttendanceBreakdownChart/>

                </div>
            </div>



            <div className="statisticTrend-container">

                <div className="trend-controls h2Settings ">
                    <label>Andmete arv: </label>
                    <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                        <option value="5">Viimased 5</option>
                        <option value="10">Viimased 10</option>
                        <option value={gradeTrend.length}>Kogu ajalugu</option>
                    </select>
                </div>

                <div className="chart-wrapper" style={{ minWidth: "600px" }}>
                    {gradeTrend.length > 0 && <GradeTrendChart grades={displayedGrades} />}
                    {attendanceTrend.length > 0 && <AttendanceTrendChart attendance={displayedAttendance} />}
                </div>
            </div>




            <div className="second-statistic-summary">
                <div className="summary-left box">
                    <MissedLessonsChart />
                </div>
                <div className="summary-right box">
                    <ComparisonWithGroup />
                </div>
                
            </div>


            <button className="styleBtn" onClick={() => window.history.back()} style={{ marginTop: "10px" }}>
                Tagasi
            </button>
        </div>
    );
};

export default StatisticsPage;
