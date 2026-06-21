import HomeHeader from "../components/HomeHeader";
import "../assets/Home.css";
import Footer from "./Footer";

function Home() {
  return (
    <>
      <HomeHeader />

      <div className="home-page">

    
        <section className="hero">
          <div className="hero-content">
            <h1>Connect. Inspire. Grow.</h1>

            <p>
              Bringing Alumni and Students together through networking,
              mentorship, career opportunities and memorable events.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">
                Join Community
              </button>

              <button className="btn-secondary">
                Explore Events
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
              alt="Students"
            />
          </div>
        </section>

    
        <section className="features">
          <h2>Why Choose Alumni Portal?</h2>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="icon">🎓</div>
              <h3>Alumni Network</h3>
              <p>
                Connect with alumni from different batches and industries.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">💼</div>
              <h3>Job Opportunities</h3>
              <p>
                Explore internships and job opportunities shared by alumni.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">📅</div>
              <h3>Events</h3>
              <p>
                Stay updated with reunions, workshops and seminars.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">🤝</div>
              <h3>Mentorship</h3>
              <p>
                Learn from experienced professionals and industry experts.
              </p>
            </div>

          </div>
        </section>

    
        <section className="about-section">
          <h2>About Our Portal</h2>

          <p>
            Alumni Portal helps students and graduates stay connected,
            discover opportunities, share knowledge, and build a strong
            professional network across the world.
          </p>
        </section>

        
        <section className="home-stats">

          <div className="home-stat-card">
            <h2>500+</h2>
            <p>Alumni</p>
          </div>

          <div className="home-stat-card">
            <h2>120+</h2>
            <p>Jobs Posted</p>
          </div>

          <div className="home-stat-card">
            <h2>50+</h2>
            <p>Events Conducted</p>
          </div>

          <div className="home-stat-card">
            <h2>1000+</h2>
            <p>Students</p>
          </div>

        </section>

      </div>
      <Footer/>
    </>
  );
}

export default Home;