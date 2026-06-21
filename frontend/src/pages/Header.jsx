import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        Alumni Portal
      </div>

      <nav>
        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        <Link to="/directory">
          Directory
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;