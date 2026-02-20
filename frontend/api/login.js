
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://jobs-rsr-backend.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
