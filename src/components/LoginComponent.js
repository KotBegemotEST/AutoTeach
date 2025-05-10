import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import "../styles/login.css";

const LoginComponent = ({ setUser }) => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div className="login-container">
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
      <section className={`form-block form-block--is-${mode}`}>
        <h1>{mode === "login" ? "AutoTeach" : "Registreerimine"}</h1>
        <LoginForm mode={mode} setUser={setUser} />
        <div className="form-block__toggle-block">
          <span>{mode === "login" ? "Sul ei ole kontot?" : "Kas teil on juba konto?"} Vajutage Siia →</span>
          <input id="form-toggler" type="checkbox" onClick={toggleMode} />
          <label htmlFor="form-toggler"></label>
        </div>
      </section>
    </div>
  );
};

export default LoginComponent;
