import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.css";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
    navigate("/");
  };

  if (!user) return null; // ❌ Не отображать, если пользователь не вошёл

  return (
    <header className="header-wrapper">
      <nav className="navbar">
        <div className={styles.logo}>
          <Link className="nav-item" to="/">📚 Avaleht</Link>
        </div>
        <Link className="nav-item" to="/dashboard">📊 Juhtpaneel</Link>
        <Link className="nav-item" to="/students">❗ Nõuab tähelepanu</Link>
        <Link className="nav-item" to="/lessons">📅 Tunniplaan</Link>
      </nav>

      <div className="user-block">
        <span>{getRoleDisplayName(user.role)}</span>
        <button onClick={handleLogout} className="logout-btn">
          <div className="icon"></div>
          <div className="text">Logi välja</div>
        </button>
      </div>
    </header>
  );
};

const getRoleDisplayName = (role) => {
  switch (role) {
    case "ADMIN":
      return "🔧 Admin";
    case "TEACHER":
      return "👨‍🏫 Õpetaja";
    case "STUDENT":
      return "🎓 Õpilane";
    default:
      return "🆔 Kasutaja";
  }
};

export default Header;
