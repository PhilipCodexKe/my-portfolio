function Footer({ formData, handleChange, handleSubmit, navigate }) {
  return (
    <footer>
      <div className="connect-cta-wrapper" id="contact">
        <h2>Let's Connect</h2>
        <p>
          Ready to collaborate on outstanding digital projects and custom
          codebases.
        </p>

        <div
          className="contact-section-inner"
          style={{ maxWidth: 1000, margin: "0 auto", textAlign: "left" }}
        >
          <div className="contact-methods">
            <div className="contact-method-item">
              <img
                src="/assets/email.png"
                alt="Email"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Email</h4>
                <a href="mailto:philipwafula97@gmail.com">
                  philipwafula97@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-method-item">
              <img
                src="/assets/phone.png"
                alt="Phone"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Phone</h4>
                <p>+254 794 554 194</p>
              </div>
            </div>
            <div className="contact-method-item">
              <img
                src="/assets/location.png"
                alt="Location"
                className="contact-icon"
              />
              <div className="contact-method-detail">
                <h4>Location</h4>
                <p>Remote — Nairobi, Kenya</p>
              </div>
            </div>
            <div className="contact-method-item">
              <a
                href="https://api.whatsapp.com/send/?phone=254794554194&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  textDecoration: "none",
                }}
              >
                <img
                  src="/assets/whatsapp.png"
                  alt="WhatsApp"
                  className="contact-icon"
                />
                <div className="contact-method-detail">
                  <h4>WhatsApp</h4>
                  <p style={{ color: "#25d366" }}>Chat with me</p>
                </div>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Write your message…"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <button
              className="primary-cta"
              type="submit"
              style={{ cursor: "pointer", border: "1px solid #fff" }}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer-new">
        <div className="footer-content-new">
          <div className="footer-left-new">
            <h2 className="footer-brand-new">Philip Wafula</h2>
            <div className="social-links-new">
              <a
                href="https://www.linkedin.com/in/philip-wafula-1721502b7/"
                aria-label="LinkedIn"
                className="social-link-new"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/philipphilippe452/"
                aria-label="Instagram"
                className="social-link-new"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" aria-label="X" className="social-link-new">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/philip.clinton.714655"
                aria-label="Facebook"
                className="social-link-new"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-right-new">
            <div className="footer-col-new">
              <h3>Pages</h3>
              <ul>
                <li>
                  <a href="#/" onClick={() => navigate("home")}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#/projects" onClick={() => navigate("projects")}>
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#/about" onClick={() => navigate("about")}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#/blog" onClick={() => navigate("blog")}>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col-new">
              <h3>Info.</h3>
              <ul>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Resume</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom-new">
          Created by Philip Wafula © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
