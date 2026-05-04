export const aboutPageStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .about-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #0a0a0f;
    color: #e2e8f0;
    line-height: 1.6;
    overflow-x: hidden;
  }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeInScale { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
  @keyframes floatDelayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
  @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes buttonGlow { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.9; } }
  @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .reveal { opacity: 0; transform: translateY(30px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal.active { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal-left.active { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal-right.active { opacity: 1; transform: translateX(0); }
  .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal-scale.active { opacity: 1; transform: scale(1); }
  .stagger-1 { transition-delay: 0.1s; }
  .stagger-2 { transition-delay: 0.2s; }
  .stagger-3 { transition-delay: 0.3s; }
  .stagger-4 { transition-delay: 0.4s; }
  .stagger-5 { transition-delay: 0.5s; }
  .stagger-6 { transition-delay: 0.6s; }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 20px 80px;
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 58, 237, 0.15), transparent),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139, 92, 246, 0.08), transparent),
      linear-gradient(to bottom, #0a0a0f, #0f0a1a);
    position: relative;
    overflow: hidden;
  }

  .hero-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
  .hero-orb-1 { width: 500px; height: 500px; background: rgba(124, 58, 237, 0.12); top: -200px; left: -200px; animation: float 8s ease-in-out infinite; }
  .hero-orb-2 { width: 400px; height: 400px; background: rgba(139, 92, 246, 0.08); top: 30%; right: -150px; animation: floatDelayed 10s ease-in-out infinite; }
  .hero-orb-3 { width: 350px; height: 350px; background: rgba(109, 40, 217, 0.1); bottom: 10%; left: 20%; animation: float 7s ease-in-out infinite; }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .hero-content { position: relative; z-index: 2; max-width: 900px; }

  .hero-badge {
    display: inline-block;
    padding: 0 0 5px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    color: #d9ccff;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 32px;
  }

  .hero h1 { font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.05; margin-bottom: 24px; color: #ffffff; letter-spacing: -0.02em; }

  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 6s ease infinite;
  }

  .hero p { font-size: 1.15rem; color: #94a3b8; max-width: 600px; margin: 0 auto 40px; line-height: 1.75; }

  .hero-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  .btn-primary {
    position: relative;
    overflow: hidden;
    min-height: 54px;
    padding: 0 28px;
    background:
      #1a1426;
    color: #f5f3ff;
    border: 1px solid rgba(167, 139, 250, 0.44);
    border-radius: 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 14px 30px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(124, 58, 237, 0.22);
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(196, 181, 253, 0.42), rgba(124, 58, 237, 0.08), rgba(167, 139, 250, 0.26));
    opacity: 0.55;
    pointer-events: none;
    z-index: 0;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 14px;
    background: transparent;
    pointer-events: none;
  }

  .btn-primary svg,
  .btn-secondary svg,
  .btn-label { position: relative; z-index: 1; transition: transform 0.25s ease; }

  .btn-primary:hover {
    transform: translateY(-2px);
    border-color: rgba(196, 181, 253, 0.68);
    background: #211830;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 18px 38px rgba(0, 0, 0, 0.32),
      0 0 0 1px rgba(167, 139, 250, 0.22);
  }

  .btn-primary:hover::before { animation: buttonGlow 1.8s ease infinite; }
  .btn-secondary:hover svg { transform: translateX(3px); }

  .hero-primary-button {
    min-height: 54px;
    padding: 0 28px;
    background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
    color: #f5f3ff;
    border: 1px solid rgba(167, 139, 250, 0.44);
    border-radius: 16px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
  }

  .hero-primary-button::before,
  .hero-primary-button::after {
    display: none;
  }

  .hero-primary-button:hover {
    transform: translateY(-2px);
    border-color: rgba(196, 181, 253, 0.68);
    background: #211830;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
  }

  .btn-secondary {
    position: relative;
    overflow: hidden;
    min-height: 54px;
    padding: 0 28px;
    background: rgba(255, 255, 255, 0.025);
    color: #e9d5ff;
    border: 1px solid rgba(167, 139, 250, 0.28);
    border-radius: 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .btn-secondary::before {
    content: '';
    position: absolute;
    inset: auto 16px 10px 16px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), transparent);
    opacity: 0.7;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.055);
    color: #ffffff;
    transform: translateY(-2px);
    border-color: rgba(167, 139, 250, 0.5);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 16px 34px rgba(0, 0, 0, 0.24);
  }

  .btn-primary:focus-visible,
  .btn-secondary:focus-visible {
    outline: 3px solid rgba(167, 139, 250, 0.24);
    outline-offset: 4px;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    max-width: 800px;
    margin: 70px auto 0;
    padding-top: 50px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .stat-item h3 { font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 6px; font-variant-numeric: tabular-nums; }
  .stat-item p { font-size: 14px; color: #64748b; margin: 0; }

  .section {
    padding: 120px 20px;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .section-header { text-align: center; margin-bottom: 70px; }
  .section-label { display: inline-block; padding: 0 0 5px; background: transparent; border: 0; border-bottom: 2px solid rgba(139, 92, 246, 0.45); color: #d9ccff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .section-title { font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 800; color: white; line-height: 1.15; letter-spacing: -0.02em; }

  .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .story-content h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: white; margin-bottom: 28px; line-height: 1.2; letter-spacing: -0.02em; }
  .story-content h2 span { color: #a78bfa; }
  .story-content p { color: #94a3b8; margin-bottom: 18px; line-height: 1.8; font-size: 1.05rem; text-align: justify; text-justify: inter-word; }

  .story-features { display: flex; gap: 28px; margin-top: 40px; }
  .story-feature { display: flex; align-items: center; gap: 14px; }
  .feature-icon { width: 52px; height: 52px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .feature-icon svg { width: 24px; height: 24px; stroke: #a78bfa; }

  .story-image { position: relative; }
  .story-image img { width: 100%; height: 480px; object-fit: cover; border-radius: 24px; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .story-image:hover img { transform: scale(1.03); }

  .floating-badge {
    position: absolute;
    bottom: -24px;
    left: -24px;
    background: rgba(15, 15, 25, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px;
    animation: float 5s ease-in-out infinite;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .floating-badge-header { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .floating-badge-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #a78bfa, #7c3aed); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .floating-badge-icon svg { width: 24px; height: 24px; stroke: white; }

  .deco-square { position: absolute; width: 100px; height: 100px; border: 2px solid rgba(139, 92, 246, 0.15); border-radius: 20px; top: -20px; right: -20px; z-index: -1; animation: spinSlow 20s linear infinite; }

  .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .mission-card {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 28px;
    padding: 56px;
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .mission-card:hover { transform: translateY(-8px); border-color: rgba(139, 92, 246, 0.2); }
  .mission-card::before { content: ''; position: absolute; top: -150px; right: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%); border-radius: 50%; transition: all 0.5s ease; }
  .mission-card:hover::before { background: radial-gradient(circle, rgba(139, 92, 246, 0.12), transparent 70%); }

  .mission-icon { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 28px; position: relative; z-index: 1; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .mission-card:hover .mission-icon { transform: scale(1.1) rotate(-5deg); }
  .mission-icon svg { width: 32px; height: 32px; stroke: white; stroke-width: 2; }
  .mission-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  .mission-icon.purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }

  .mission-card h3 { font-size: 1.6rem; font-weight: 700; color: white; margin-bottom: 18px; position: relative; z-index: 1; }
  .mission-card p { color: #94a3b8; line-height: 1.8; font-size: 1.05rem; position: relative; z-index: 1; text-align: justify; text-justify: inter-word; }

  .mission-tags { display: flex; gap: 10px; margin-top: 28px; position: relative; z-index: 1; }
  .mission-tag { padding: 8px 18px; background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 50px; font-size: 13px; color: #a78bfa; font-weight: 500; }

  .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .value-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; padding: 48px 28px; text-align: center; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .value-card:hover { transform: translateY(-12px); border-color: rgba(139, 92, 246, 0.2); background: rgba(255, 255, 255, 0.04); box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.12); }
  .value-icon { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .value-card:hover .value-icon { transform: rotate(12deg) scale(1.15); }
  .value-icon svg { width: 32px; height: 32px; stroke: white; stroke-width: 2; }
  .value-icon.cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
  .value-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
  .value-icon.violet { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
  .value-icon.rose { background: linear-gradient(135deg, #f43f5e, #e11d48); }
  .value-card h3 { font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: 14px; }
  .value-card p { color: #64748b; font-size: 15px; line-height: 1.65; }

  .offer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .offer-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; padding: 40px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .offer-card:hover { transform: translateY(-8px); border-color: rgba(139, 92, 246, 0.2); background: rgba(255, 255, 255, 0.04); }
  .offer-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .offer-card:hover .offer-icon { transform: scale(1.15); }
  .offer-icon svg { width: 28px; height: 28px; stroke: white; stroke-width: 2; }
  .offer-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
  .offer-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
  .offer-icon.violet { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
  .offer-icon.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
  .offer-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  .offer-icon.purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }
  .offer-icon.cyan { background: linear-gradient(135deg, #14b8a6, #0f766e); }
  .offer-icon.rose { background: linear-gradient(135deg, #fb7185, #e11d48); }
  .offer-card h3 { font-size: 1.2rem; font-weight: 700; color: white; margin-bottom: 12px; }
  .offer-card p { color: #64748b; font-size: 15px; line-height: 1.65; text-align: justify; text-justify: inter-word; }

  .timeline { position: relative; max-width: 900px; margin: 0 auto; padding: 10px 0; overflow: visible; }
  .timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #7c3aed, #a78bfa, transparent); transform: translateX(-50%); }
  .timeline-item { position: relative; margin-bottom: 60px; display: flex; align-items: flex-start; min-height: 140px; overflow: visible; }
  .timeline-left { justify-content: flex-start; }
  .timeline-right { justify-content: flex-end; }
  /* tighten spacing so content sits adjacent to the center dot */
  .timeline-content { max-width: calc(50% - 48px); width: calc(50% - 48px); background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 20px; padding: 28px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  /* provide small margins so content does not sit under the dot */
  .timeline-left .timeline-content { margin-right: 48px; }
  .timeline-right .timeline-content { margin-left: 48px; }
  .timeline-content:hover { border-color: rgba(139, 92, 246, 0.2); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }
  .timeline-dot { position: absolute; left: 50%; transform: translateX(-50%); width: 72px; height: 72px; background: #7c3aed; border: 4px solid #0a0a0f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 12px; line-height: 1.05; text-align: center; white-space: nowrap; letter-spacing: -0.02em; z-index: 3; transition: all 0.4s ease; }
  .timeline-item:hover .timeline-dot { transform: translateX(-50%) scale(1.15); box-shadow: 0 0 30px rgba(124, 58, 237, 0.4); }
  .timeline-dot.active { background: linear-gradient(135deg, #a78bfa, #7c3aed); animation: pulseGlow 2s infinite; }
  .timeline-date { color: #a78bfa; font-size: 13px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .timeline-content h3 { color: white; font-size: 1.3rem; font-weight: 700; margin-bottom: 10px; }
  .timeline-content p { color: #94a3b8; font-size: 15px; line-height: 1.7; text-align: justify; text-justify: inter-word; }

  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; align-items: stretch; }
  .testimonial-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; padding: 40px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); height: 100%; display: flex; flex-direction: column; }
  .testimonial-card:hover { transform: translateY(-8px); border-color: rgba(139, 92, 246, 0.15); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3); }
  .stars { display: flex; gap: 4px; margin-bottom: 24px; }
  .star { color: #fbbf24; font-size: 18px; }
  .star.empty { color: #475569; }
  .testimonial-text { color: #cbd5e1; line-height: 1.8; margin-bottom: 28px; font-size: 16px; }
  .testimonial-author { display: flex; align-items: center; gap: 16px; margin-top: auto; }
  .author-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 16px; flex-shrink: 0; }
  .author-avatar.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  .author-avatar.green { background: linear-gradient(135deg, #10b981, #059669); }
  .author-avatar.purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }
  .author-info h4 { color: white; font-weight: 600; font-size: 16px; }
  .author-info p { color: #64748b; font-size: 14px; }

  .partners-section { padding: 80px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  .partners-title { display: inline-block; padding-bottom: 12px; border-bottom: 2px solid rgba(139, 92, 246, 0.45); }
  .partners-grid { display: flex; justify-content: center; align-items: center; gap: 70px; flex-wrap: wrap; max-width: 1000px; margin: 0 auto; }
  .partner-item { font-size: 1.6rem; font-weight: 800; color: rgba(255, 255, 255, 0.15); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; letter-spacing: -0.02em; }
  .partner-item:hover { color: rgba(255, 255, 255, 0.9); transform: translateY(-3px); }
  .partner-item span { color: rgba(139, 92, 246, 0.3); transition: color 0.5s ease; }
  .partner-item:hover span { color: #a78bfa; }

  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; max-width: 900px; margin: 0 auto; align-items: stretch; }
  .team-card { text-align: center; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); height: 100%; display: flex; flex-direction: column; align-items: center; }
  .team-card:hover { transform: translateY(-12px); }
  .team-avatar-wrap { position: relative; display: inline-block; margin-bottom: 24px; }
  .team-avatar { width: 130px; height: 130px; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; font-weight: 800; color: white; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
  .team-card:hover .team-avatar { transform: scale(1.08); box-shadow: 0 0 40px rgba(139, 92, 246, 0.3); }
  .team-avatar.purple { background: linear-gradient(135deg, #a78bfa, #7c3aed); }
  .team-avatar.violet { background: linear-gradient(135deg, #c084fc, #a855f7); }
  .team-avatar.blue { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
  .status-dot { position: absolute; bottom: 6px; right: 6px; width: 18px; height: 18px; background: #22c55e; border: 4px solid #0a0a0f; border-radius: 50%; }
  .team-card h3 { color: white; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; }
  .team-role { color: #a78bfa; font-size: 15px; font-weight: 600; margin-bottom: 12px; }
  .team-desc { color: #64748b; font-size: 15px; margin-bottom: 20px; line-height: 1.6; flex: 1; }
  .team-social { display: flex; justify-content: center; gap: 12px; }
  .social-link { width: 40px; height: 40px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; font-size: 14px; font-weight: 600; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .social-link svg { width: 16px; height: 16px; stroke-width: 2; }
  .social-link:hover { background: #7c3aed; color: white; border-color: #7c3aed; transform: translateY(-3px); }

  .cta-section {
    padding: 120px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 58, 237, 0.1), transparent),
      linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.03));
  }

  .cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  .cta-section h2 { font-size: clamp(2.8rem, 6vw, 4.5rem); font-weight: 800; color: white; margin-bottom: 24px; line-height: 1.1; letter-spacing: -0.02em; }
  .cta-section p { color: #94a3b8; font-size: 1.15rem; max-width: 600px; margin: 0 auto 40px; line-height: 1.75; }

  .cta-trust { display: flex; justify-content: center; gap: 40px; margin-top: 50px; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 15px; }
  .trust-check { color: #a78bfa; font-size: 18px; font-weight: 700; }

  @media (max-width: 1024px) {
    .story-grid { gap: 50px; }
    .values-grid { grid-template-columns: repeat(2, 1fr); }
    .offer-grid { grid-template-columns: repeat(2, 1fr); }
    .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-stats { gap: 30px; }
  }

  @media (max-width: 768px) {
    .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .story-grid { grid-template-columns: 1fr; }
    .mission-grid { grid-template-columns: 1fr; }
    .values-grid { grid-template-columns: 1fr; }
    .offer-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr; max-width: 400px; }

    .timeline-line { left: 24px; }
    .timeline-item,
    .timeline-left,
    .timeline-right {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding-left: 70px;
    }

    .timeline-dot {
      left: 24px;
      transform: translateX(-50%);
      width: 52px;
      height: 52px;
      white-space: normal;
    }

    .timeline-item:hover .timeline-dot {
      transform: translateX(-50%) scale(1.1);
    }

    .timeline-content {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      text-align: left;
    }

    .partners-grid { gap: 30px; }
    .story-features { flex-direction: column; }
    .floating-badge { left: 10px; bottom: 10px; padding: 18px; }
    .deco-square { display: none; }
    .section { padding: 80px 20px; }
    .mission-card { padding: 36px; }
  }

  .about-root ::-webkit-scrollbar { width: 8px; }
  .about-root ::-webkit-scrollbar-track { background: #0a0a0f; }
  .about-root ::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 4px; }
  .about-root ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
`;
