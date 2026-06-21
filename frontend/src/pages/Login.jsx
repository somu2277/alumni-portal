import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        data
      );

      localStorage.setItem(
        "token",
        res.data.token
      );
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(res.data.message);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="login-image-container">
        <img src="https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=422&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8M
          HxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="alumni-img" className="login-image"/>
      </div>
      <div className="register-card">
        <h1>Alumni Login</h1>
        <p>Welcome Back</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

          <p className="login-text">
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;