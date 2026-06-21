import { Link } from "react-router-dom";

function HomeHeader() {
  return (
    <header className="header">
      <div className="logo">
        Alumni Portal
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}

export default HomeHeader;