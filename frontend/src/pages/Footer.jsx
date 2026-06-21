import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>Alumni Portal</h3>
          <p>
            Connecting alumni, students,
            mentors, and opportunities.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Directory</li>
            <li>Events</li>
            <li>Jobs</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>📧 alumni@gprec.ac.in</p>
          <p>📞 +91 9876543210</p>
          <p>📍 GPREC, Kurnool</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Alumni Portal | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;