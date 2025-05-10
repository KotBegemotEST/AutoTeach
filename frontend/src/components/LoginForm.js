import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";

const LoginForm = ({ mode, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Ошибка входа");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user); // ✅ Устанавливаем пользователя в App
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Ошибка входа:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inner">
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <div className="emailDiv">
            <Input
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="passwordDiv">
            <Input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="login-button  button--primary full-width" type="submit">
          <span>{mode === "login" ? "Log In" : "Sign Up"}</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
