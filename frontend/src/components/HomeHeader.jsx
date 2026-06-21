import { Link } from "react-router-dom";

function HomeHeader() {
  return (
    <header className="header">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/favicon.svg" alt="Logo" style={{ width: '28px', height: '28px' }} />
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