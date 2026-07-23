import { useState } from "react";
import api from "../api";
import "../loginForm.css";

function SignupForm({ onSignupSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/users/signup", { email, password });
      onSignupSuccess();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Email already registered");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Signup error", err);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>
          ×
        </button>
        <h2>Sign Up</h2>

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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
