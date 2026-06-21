import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNo: "",
    department: "",
    graduationYear: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/register",
        formData
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="register-page">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900" alt="alumni-portal" className="register-image"/>
      </div>
      <div className="register-form-card">
        <h1>Alumni Registration</h1>
        <p>Create your alumni account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
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
            Register
          </button>

          <p className="login-text">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;