import React from "react";

const AttendanceSummary = ({ attendance, totalLessons }) => {
    return (
        <div>
            <h2 className="h2Settings"> <span className="calendar"></span>  Tundides osalemine</h2>
            <p>Õpilane osales <b>{attendance}</b> / <b>{totalLessons}</b> tunnis.</p>
        </div>
    );
};

export default AttendanceSummary;
