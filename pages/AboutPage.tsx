import React, { useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { aboutPageStyles } from "../src/styles/aboutPageStyles";
import { aboutPageData } from "../src/data/aboutPageData";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  // Refactored: modular styles and data architecture
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const animateCounters = (container: Element) => {
      const counters = container.querySelectorAll<HTMLElement>(".counter");
      counters.forEach((counter) => {
        if (counter.dataset.animated === "true") return;

        counter.dataset.animated = "true";
        const target = Number(counter.dataset.target || 0);
        const suffix = counter.dataset.suffix || "";
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = `${Math.floor(current).toLocaleString()}${suffix}`;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${target.toLocaleString()}${suffix}`;
          }
        };

        updateCounter();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
          if (entry.target.querySelector(".counter")) {
            animateCounters(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(".hero .reveal");
    const timers: number[] = [];
    heroReveals.forEach((el, index) => {
      const id = window.setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 150);
      timers.push(id);
    });

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div ref={rootRef}>
      <style>{aboutPageStyles}</style>

      <div className="about-root">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>

          <div className="hero-content">
            <div className="hero-badge reveal">
              About BuildHive
            </div>

            <h1 className="reveal stagger-1">
              Revolutionizing
              <br />
              <span className="gradient-text">Construction</span>
            </h1>

            <p className="reveal stagger-2">
              BuildHive is Pakistan's premier digital marketplace connecting
              builders, contractors, suppliers, and homeowners with quality
              construction resources through innovation and trust.
            </p>

            <div className="hero-buttons reveal stagger-3">
              <button className="btn-primary hero-primary-button" onClick={() => onNavigate("products")}>
                <span className="btn-label">Browse Products</span>
                <Icons.ArrowRight className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="hero-stats reveal stagger-4">
              {aboutPageData.stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <h3 className="counter" data-target={stat.target} data-suffix={stat.suffix || ""}>
                    0
                  </h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Our Story Section */}
        <section id="story" className="section">
          <div className="story-grid">
            <div className="story-content reveal-left">
              <span className="section-label">Our Story</span>
              <h2>
                Building the Future of <span>Pakistan's Construction</span>
              </h2>
              <p>
                Founded in 2024, BuildHive emerged from a clear market need.
                Pakistan's construction industry is booming with a market value
                of $16 billion in 2023, yet professionals struggle with
                fragmented supply chains, inefficient resource management, and
                lack of digital solutions.
              </p>
              <p>
                We bridge this gap by creating a transparent, user-friendly
                ecosystem that empowers architects, engineers, contractors, and
                interior designers to buy, sell, and collaborate on
                construction projects with confidence and ease.
              </p>
              <p>
                Today, BuildHive is more than a marketplace. It's a movement to
                modernize Pakistan's construction landscape through technology,
                trust, and innovation - featuring AI-driven recommendations,
                cost estimation, real-time chatbot assistance, and professional
                collaboration tools.
              </p>

              <div className="story-features">
                <div className="story-feature">
                  <div className="feature-icon">
                    <Icons.MapPin />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 600 }}>
                      Nationwide
                    </div>
                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                      Serving construction professionals across Pakistan
                    </div>
                  </div>
                </div>
                <div className="story-feature">
                  <div className="feature-icon">
                    <Icons.Shield />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 600 }}>
                      Verified
                    </div>
                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                      Quality-first supplier verification system
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-image reveal-right">
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "24px" }}>
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"
                  alt="Construction Site"
                />
              </div>
              <div className="deco-square"></div>

              <div className="floating-badge">
                <div className="floating-badge-header">
                  <div className="floating-badge-icon">
                    <Icons.Award />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 600, fontSize: "15px" }}>
                      Top Rated
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                      Marketplace 2024
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                  <span style={{ color: "#fbbf24", fontSize: "16px" }}>
                    ★★★★★
                  </span>
                  <span style={{ color: "#64748b", fontSize: "13px", marginLeft: "6px" }}>
                    4.9/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">What Drives Us</span>
            <h2 className="section-title">Mission & Vision</h2>
          </div>

          <div className="mission-grid">
            <div className="mission-card reveal-left stagger-1">
              <div className="mission-icon blue">
                <Icons.Target />
              </div>
              <h3>Our Mission</h3>
              <p>
                To connect construction professionals with quality materials
                and services through a transparent, reliable, and
                technologically advanced platform that reduces costs,
                minimizes waste, and accelerates project timelines.
              </p>
              <div className="mission-tags">
                <span className="mission-tag">Transparency</span>
                <span className="mission-tag">Reliability</span>
              </div>
            </div>

            <div className="mission-card reveal-right stagger-2">
              <div className="mission-icon purple">
                <Icons.Eye />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become Pakistan's #1 digital construction marketplace,
                setting the industry standard for quality, innovation, and
                sustainability while empowering professionals to build smarter
                and more efficiently.
              </p>
              <div className="mission-tags">
                <span className="mission-tag">Innovation</span>
                <span className="mission-tag">Excellence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>

          <div className="values-grid">
            {aboutPageData.values.map((value, index) => {
              const IconComp = value.icon;
              return (
                <div key={value.title} className={`value-card reveal-scale stagger-${index + 1}`}>
                  <div className={`value-icon ${value.tone}`}>
                    <IconComp />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Our Services</span>
            <h2 className="section-title">What We Offer</h2>
          </div>

          <div className="offer-grid">
            {aboutPageData.offers.map((offer, index) => {
              const IconComp = offer.icon;
              return (
                <div key={offer.title} className={`offer-card reveal stagger-${index + 1}`}>
                  <div className={`offer-icon ${offer.tone}`}>
                    <IconComp />
                  </div>
                  <h3>{offer.title}</h3>
                  <p>{offer.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Our Journey</span>
            <h2 className="section-title">Road to Success</h2>
          </div>

          <div className="timeline">
            <div className="timeline-line"></div>

            {aboutPageData.timeline.map((item, index) => (
              <div
                key={item.step}
                className={`timeline-item ${index % 2 === 0 ? "timeline-left" : "timeline-right"}`}
              >
                <div className={`timeline-dot ${item.active ? "active" : ""}`}>
                  {item.step}
                </div>
                <div
                  className="timeline-content"
                  style={item.active ? { borderColor: "rgba(139, 92, 246, 0.25)" } : {}}
                >
                  <div className="timeline-date">{item.date}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>

          <div className="testimonials-grid">
            {aboutPageData.testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className={`testimonial-card reveal stagger-${index + 1}`}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={`${testimonial.name}-star-${starIndex}`}
                      className={`star ${starIndex >= testimonial.stars ? "empty" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className={`author-avatar ${testimonial.tone}`}>
                    {testimonial.initials}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section className="partners-section">
          <div className="section-header reveal" style={{ marginBottom: "40px" }}>
            <span className="section-label partners-title">Trusted by industry leaders</span>
          </div>
          <div className="partners-grid">
            {aboutPageData.partners.map((partner, index) => (
              <div key={partner.left + partner.right} className={`partner-item reveal-scale stagger-${index + 1}`}>
                {partner.right ? (
                  <>
                    {partner.left}
                    <span>{partner.right}</span>
                  </>
                ) : (
                  partner.left
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="section">
          <div className="section-header reveal">
            <span className="section-label">The People</span>
            <h2 className="section-title">Meet Our Team</h2>
            <p style={{ color: "#64748b", marginTop: "16px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              Passionate professionals dedicated to transforming Pakistan's
              construction industry.
            </p>
          </div>

          <div className="team-grid">
            {aboutPageData.team.map((member, index) => (
              <div key={member.name} className={`team-card reveal-scale stagger-${index + 1}`}>
                <div className="team-avatar-wrap">
                  <div className={`team-avatar ${member.tone}`}>
                    {member.initials}
                  </div>
                  <div className="status-dot"></div>
                </div>
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-desc">{member.desc}</p>
                <div className="team-social">
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <Icons.Linkedin />
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <Icons.Instagram />
                  </a>
                  <a href="#" className="social-link" aria-label="Email">
                    <Icons.Mail />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-grid"></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="reveal">
              Ready to Build
              <br />
              with Us?
            </h2>
            <p className="reveal stagger-1">
              Join thousands of builders, contractors, and suppliers who are
              already transforming Pakistan's construction industry with
              BuildHive.
            </p>

            <div
              className="reveal stagger-2"
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button className="btn-primary hero-primary-button" onClick={() => onNavigate("products") }>
                <span className="btn-label">Get Started Now</span>
                <Icons.ArrowRight className="h-[18px] w-[18px]" />
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate("contact")}
              >
                <span className="btn-label">Contact Sales</span>
                <Icons.Mail className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="cta-trust reveal stagger-3">
              <div className="trust-item">
                <span className="trust-check">✓</span>
                <span>Free Registration</span>
              </div>
              <div className="trust-item">
                <span className="trust-check">✓</span>
                <span>24/7 Support</span>
              </div>
              <div className="trust-item">
                <span className="trust-check">✓</span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
