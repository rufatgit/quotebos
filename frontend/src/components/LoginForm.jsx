import { useState } from "react";
import api from "../api";
import "../loginForm.css";

function LoginForm({ onLoginSuccess, onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //backend login route expects form-encoded data
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/users/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", response.data.access_token);
      onLoginSuccess();
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error", err);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>
          ×
        </button>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="login-switch">
          Don't have an account? <span onClick={onSwitchToSignup}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
