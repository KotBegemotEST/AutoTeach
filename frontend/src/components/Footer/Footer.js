import React from "react";
import "./style.css";

const Footer = () => {
    return (
        <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} Auto-Teach. </p>
        </footer>
    );
};

export default Footer;
