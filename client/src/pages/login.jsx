import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "./Login.css";
import axios from "../axiosConfig";
axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("guest");   // 👈 role select
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
                     const res = await axios.post(
                              "/api/auth/login",
                              {
                                email,
                                password,
                                role: loginRole
                              },
                              {
                                withCredentials: true
                              }
                            );

      if (res.data.success) {
        localStorage.setItem("role", loginRole);
        
        localStorage.setItem("userId", res.data.userId);

        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          if (loginRole === "host") {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setMessage(res.data.msg);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Failed to login");
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleLogin} className="auth-card">
        <h2>Login</h2>
        <p>Welcome back! Please log in to continue.</p>

        {message && <div className="message">{message}</div>}

        <input
          type="email"
          placeholder="Enter your email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* 👇 ROLE SELECT */}
        <select
          className="input-field"
          value={loginRole}
          onChange={(e) => setLoginRole(e.target.value)}
        >
          <option value="guest">Login as Guest</option>
          <option value="host">Login as Host</option>
        </select>

        <button type="submit" className="submit-btn">Login</button>

        <div className="footer-row">
          <a href="/reset-password">Forgot Password?</a>
          <span className="footer-right">
            New User? <a href="/signup">Sign Up</a>
          </span>
        </div>
      </form>
    </div>
  );
}
