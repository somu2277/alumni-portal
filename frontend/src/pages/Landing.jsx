import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Users, Briefcase, Calendar, Award, Network, MessageSquare, ArrowRight, CheckCircle, ChevronRight, Menu, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    jobOpportunities: 0,
    upcomingEvents: 0
  });
  const [testimonials, setTestimonials] = useState([]);
  const [events, setEvents] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, testRes, eventsRes] = await Promise.all([
        api.get("/dashboard/stats").catch(() => null),
        api.get("/testimonials").catch(() => null),
        api.get("/events").catch(() => null)
      ]);
      
      if (statsRes?.data) {
        setStats({
          totalAlumni: statsRes.data.totalAlumni || 0,
          jobOpportunities: statsRes.data.jobOpportunities || 0,
          upcomingEvents: statsRes.data.upcomingEvents || 0
        });
      }

      if (testRes?.data) {
        setTestimonials(testRes.data.testimonials || []);
      }

      if (eventsRes?.data) {
        setEvents(eventsRes.data.events || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const features = [
    { icon: <Users size={28} />, title: "Alumni Directory", desc: "Find, filter, and connect with fellow alumni worldwide." },
    { icon: <Briefcase size={28} />, title: "Jobs & Internships", desc: "Explore exclusive career opportunities posted by the community." },
    { icon: <Calendar size={28} />, title: "Events & Meetups", desc: "Join webinars, reunions, and localized tech talks." },
    { icon: <Award size={28} />, title: "Mentorship Programs", desc: "Get guided by industry leaders from your college." },
    { icon: <Network size={28} />, title: "Networking", desc: "Build meaningful, lifelong professional relationships." },
    { icon: <MessageSquare size={28} />, title: "Career Guidance", desc: "Read success stories and get interview preparation tips." }
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up securely using your college roll number." },
    { num: "02", title: "Build Profile", desc: "Add your experiences, skills, and resume." },
    { num: "03", title: "Connect with Alumni", desc: "Network with seniors and batchmates globally." },
    { num: "04", title: "Apply for Opportunities", desc: "Apply for jobs and attend exclusive events." }
  ];

  const companies = [
    "Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Meta", "Netflix"
  ];

  return (
    <div className="saas-landing">
      {/* Sticky Header */}
      <header className="saas-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-box">
              <Network size={28} className="text-indigo" />
              <span className="logo-text">AlumniHub</span>
            </div>
          </div>
          
          <nav className="header-center hidden-mobile">
            <a href="#home">Home</a>
            <a href="#directory">Alumni Directory</a>
            <a href="#events">Events</a>
            <a href="#jobs">Jobs</a>
            <a href="#success">Success Stories</a>
          </nav>

          <div className="header-right hidden-mobile">
            <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/register")}>Get Started</button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#directory" onClick={() => setIsMobileMenuOpen(false)}>Alumni Directory</a>
            <a href="#events" onClick={() => setIsMobileMenuOpen(false)}>Events</a>
            <a href="#jobs" onClick={() => setIsMobileMenuOpen(false)}>Jobs</a>
            <a href="#success" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</a>
            <div className="mobile-menu-actions">
              <button className="btn-outline-full" onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary-full" onClick={() => navigate("/register")}>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-grid">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="chip">✨ New Platform Update Live</div>
            <h1 className="hero-title">Connect. Learn. <br/><span className="text-gradient">Grow Together.</span></h1>
            <p className="hero-desc">
              Join thousands of alumni and students building careers, finding opportunities, and creating lifelong professional connections.
            </p>
            <div className="hero-actions">
              <button className="btn-primary btn-large" onClick={() => navigate("/register")}>
                Get Started <ArrowRight size={18} />
              </button>
              <button className="btn-secondary btn-large" onClick={() => navigate("/login")}>
                Explore Alumni
              </button>
            </div>
            <div className="trust-indicators">
              <span><CheckCircle size={16} /> Verified Alumni</span>
              <span><CheckCircle size={16} /> Job Opportunities</span>
              <span><CheckCircle size={16} /> Mentorship Programs</span>
              <span><CheckCircle size={16} /> Industry Experts</span>
            </div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="illustration-wrapper">
              {/* Modern SaaS abstract illustration */}
              <div className="abstract-glow glow-1"></div>
              <div className="abstract-glow glow-2"></div>
              <div className="ui-card card-top-right">
                <div className="avatar-group">
                  <div className="avatar bg-blue">A</div>
                  <div className="avatar bg-indigo">S</div>
                  <div className="avatar bg-purple">M</div>
                </div>
                <p>300+ New Connections</p>
              </div>
              <div className="ui-card card-bottom-left">
                <Briefcase size={24} className="text-indigo" />
                <div>
                  <strong>Software Engineer</strong>
                  <p>Google • San Francisco</p>
                </div>
              </div>
              <div className="main-illustration">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Networking" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Hiring Companies */}
      <section className="companies-section">
        <p className="companies-title">ALUMNI WORKING AT TOP COMPANIES</p>
        <div className="companies-marquee">
          <div className="marquee-track">
            {companies.map((company, idx) => (
              <span key={idx} className="company-logo-text">{company}</span>
            ))}
            {/* Duplicate for infinite effect */}
            {companies.map((company, idx) => (
              <span key={`dup-${idx}`} className="company-logo-text">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="live-stats-section">
        <div className="stats-grid">
          <div className="stat-box">
            <h3 className="stat-number">{stats.totalAlumni}+</h3>
            <p className="stat-label">Total Alumni</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">{stats.jobOpportunities}+</h3>
            <p className="stat-label">Jobs Posted</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">{stats.upcomingEvents}+</h3>
            <p className="stat-label">Events Conducted</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Companies Hiring</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="directory" className="features-section">
        <div className="section-head">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle">Powerful tools designed specifically for our alumni network to foster growth and connections.</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div 
              className="feat-card" 
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="feat-icon-box">{feature.icon}</div>
              <h3 className="feat-title">{feature.title}</h3>
              <p className="feat-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="jobs-section">
        <div className="section-head">
            <h2 className="section-title">Job Opportunities</h2>
            <p className="section-subtitle">
              Explore internships and jobs shared by alumni.
            </p>
        </div>

        <div className="features-grid">
          <div className="feat-card">
            <h3>Software Engineer</h3>
            <p>Google • Full Time</p>
          </div>

          <div className="feat-card">
            <h3>Frontend Developer</h3>
            <p>Microsoft • Internship</p>
          </div>

          <div className="feat-card">
            <h3>Backend Developer</h3>
            <p>Amazon • Full Time</p>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section className="timeline-section">
        <div className="section-head">
          <h2 className="section-title">Your Journey Starts Here</h2>
          <p className="section-subtitle">Four simple steps to unlock the full potential of your alumni network.</p>
        </div>
        <div className="steps-container">
          {steps.map((step, idx) => (
            <div className="step-card" key={idx}>
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section id="events" className="events-preview-section">
          <div className="section-head flex-between">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on exclusive alumni gatherings.</p>
            </div>
            <button className="btn-text" onClick={() => navigate("/login")}>View All <ChevronRight size={16} /></button>
          </div>
          <div className="events-carousel">
            {events.slice(0, 3).map((ev, idx) => (
              <div className="event-preview-card" key={idx}>
                <div className="event-date-badge">
                  <span className="month">{new Date(ev.eventDate).toLocaleString('default', { month: 'short' })}</span>
                  <span className="day">{new Date(ev.eventDate).getDate()}</span>
                </div>
                <div className="event-details">
                  <h3>{ev.title}</h3>
                  <p>{ev.location}</p>
                  <button className="btn-outline btn-small" onClick={() => navigate("/login")}>Register</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Success Stories / Testimonials */}
      <section id="success" className="testimonials-section">
        <div className="section-head">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">Hear from alumni who have accelerated their careers.</p>
        </div>
        <div className="test-carousel">
          {testimonials.length > 0 ? testimonials.map((test, idx) => (
            <div className="test-card glass-panel" key={idx}>
              <div className="stars">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
              </div>
              <p className="test-quote">"{test.feedback}"</p>
              <div className="test-profile">
                <div className="test-img">
                  {test.name.charAt(0)}
                </div>
                <div className="test-info">
                  <h4>{test.name}</h4>
                  <span>{test.company}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="test-card glass-panel">
              <div className="stars">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
              </div>
              <p className="test-quote">"This platform helped me find my co-founder and secure our first seed round. The network here is incredibly powerful!"</p>
              <div className="test-profile">
                <div className="test-img">S</div>
                <div className="test-info">
                  <h4>Sarah Jenkins</h4>
                  <span>CEO at TechFlow</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Large CTA Banner */}
      <section className="cta-banner-section">
        <div className="cta-box">
          <h2>Ready to Join the Network?</h2>
          <p>Create your profile today and start exploring endless career opportunities.</p>
          <div className="cta-actions">
            <button className="btn-primary btn-large btn-white" onClick={() => navigate("/register")}>Join Now</button>
            <button className="btn-outline btn-large btn-outline-white" onClick={() => navigate("/login")}>Explore Community</button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="modern-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-box">
              <Network size={24} className="text-white" />
              <span className="logo-text text-white">AlumniHub</span>
            </div>
            <p className="footer-desc">Empowering alumni to connect, collaborate, and succeed globally.</p>
          </div>
          <div className="footer-links">
            <h4>About</h4>
            <a href="#">Our Story</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">Directory</a>
            <a href="#">Events</a>
            <a href="#">Jobs</a>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <a href="#">Support</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Alumni Management Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
