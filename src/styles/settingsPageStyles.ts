export const settingsPageStyles = `
  /* ===== SHARED STYLES FROM BLOG PAGE ===== */
  /* Reused: base dark theme, hero-orbs, hero-grid, gradient-text, animations, buttons, cta-section */

  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    33% { transform: translateY(-20px) translateX(10px); }
    66% { transform: translateY(-10px) translateX(-10px); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .settings-root {
    background: #0a0a0f;
    color: #e2e8f0;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  /* ===== HERO ORBS ===== */
  .hero-orb {
    position: absolute;
    border-radius: 50%;
    opacity: 0.4;
    animation: float 20s infinite;
    filter: blur(60px);
  }

  .hero-orb-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    top: -100px;
    left: -150px;
    animation-delay: 0s;
  }

  .hero-orb-2 {
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #a78bfa, #c084fc);
    bottom: -80px;
    right: -120px;
    animation-delay: 5s;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.5;
  }

  /* ===== GRADIENT TEXT ===== */
  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ===== HERO SECTION ===== */
  .settings-root .hero {
    position: relative;
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 60px;
    overflow: hidden;
  }

  .settings-root .hero-content {
    position: relative;
    z-index: 2;
    max-width: 700px;
    text-align: center;
  }

  .settings-root .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 0 5px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    font-size: 13px;
    font-weight: 700;
    color: #d9ccff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
  }

  .settings-root .hero h1 {
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
    color: #f8fafc;
  }

  .settings-root .hero > .hero-content > p {
    font-size: 17px;
    color: #94a3b8;
    line-height: 1.7;
    max-width: 500px;
    margin: 0 auto;
  }

  /* ===== REVEAL ANIMATIONS ===== */
  .reveal, .reveal-left, .reveal-right, .reveal-scale {
    opacity: 0;
  }

  .reveal.active {
    animation: revealFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .reveal-left.active {
    animation: revealLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .reveal-right.active {
    animation: revealRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .reveal-scale.active {
    animation: revealScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes revealFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes revealLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes revealRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes revealScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* ===== STAGGER DELAYS ===== */
  .stagger-1.active { animation-delay: 0.1s; }
  .stagger-2.active { animation-delay: 0.2s; }
  .stagger-3.active { animation-delay: 0.3s; }
  .stagger-4.active { animation-delay: 0.4s; }
  .stagger-5.active { animation-delay: 0.5s; }
  .stagger-6.active { animation-delay: 0.6s; }

  /* ===== BUTTONS ===== */
  .btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
  }

  .btn-secondary {
    background: rgba(139, 92, 246, 0.1);
    color: #a78bfa;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .btn-secondary:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
  }

  .hero-primary-button {
    min-height: 54px;
    padding: 0 32px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.25);
  }

  .btn-label {
    display: inline-block;
  }

  /* ===== CTA SECTION ===== */
  .cta-section {
    position: relative;
    text-align: center;
    padding: 80px 24px;
    overflow: hidden;
  }

  .cta-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(139, 92, 246, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px);
    background-size: 100px 100px;
  }

  .cta-section h2 {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 16px;
  }

  .cta-section p {
    font-size: 16px;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  /* ===== SETTINGS CONTAINER ===== */
  .settings-root .settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ===== SETTINGS CARD ===== */
  .settings-root .settings-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.4s ease;
  }

  .settings-root .settings-card:hover {
    border-color: rgba(139, 92, 246, 0.15);
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.06);
  }

  /* Card header */
  .settings-root .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .settings-root .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .settings-root .card-icon svg {
    width: 22px;
    height: 22px;
    color: white;
  }

  .settings-root .card-icon.purple { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .settings-root .card-icon.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .settings-root .card-icon.green { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .settings-root .card-icon.orange { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .settings-root .card-title-wrap {
    flex: 1;
    min-width: 0;
  }

  .settings-root .card-title-wrap h2 {
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 4px;
  }

  .settings-root .card-title-wrap p {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
  }

  /* Unsaved / Saved badges */
  .settings-root .unsaved-badge {
    padding: 4px 10px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.25);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    color: #f59e0b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .settings-root .saved-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    color: #10b981;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  /* Card body */
  .settings-root .card-body {
    padding: 8px 0;
  }

  /* ===== SETTING ROW ===== */
  .settings-root .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 28px;
    transition: background 0.2s;
  }

  .settings-root .setting-row:hover {
    background: rgba(139, 92, 246, 0.03);
  }

  .settings-root .setting-row + .setting-row {
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  .settings-root .setting-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .settings-root .setting-label {
    font-size: 15px;
    font-weight: 600;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-root .setting-desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
    max-width: 400px;
  }

  /* Danger row */
  .settings-root .danger-row {
    background: rgba(239, 68, 68, 0.03);
  }

  .settings-root .danger-row:hover {
    background: rgba(239, 68, 68, 0.05);
  }

  .settings-root .danger-label {
    color: #f87171;
  }

  /* ===== TOGGLE SWITCH ===== */
  .settings-root .toggle-switch {
    width: 48px;
    height: 28px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    padding: 0;
  }

  .settings-root .toggle-switch:hover {
    border-color: rgba(139, 92, 246, 0.3);
  }

  .settings-root .toggle-switch.active {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border-color: transparent;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.15);
  }

  .settings-root .toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: #e2e8f0;
    border-radius: 50%;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .settings-root .toggle-switch.active .toggle-knob {
    transform: translateX(20px);
    background: white;
  }

  /* ===== SELECT DROPDOWN ===== */
  .settings-root .select-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .settings-root .setting-select {
    appearance: none;
    -webkit-appearance: none;
    padding: 10px 36px 10px 14px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #e2e8f0;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.3s;
    min-width: 160px;
  }

  .settings-root .setting-select:hover,
  .settings-root .setting-select:focus {
    border-color: rgba(139, 92, 246, 0.4);
  }

  .settings-root .setting-select option {
    background: #0f172a;
    color: #e2e8f0;
  }

  .settings-root .select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #64748b;
    pointer-events: none;
  }

  /* ===== CARD FOOTER ===== */
  .settings-root .card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .settings-root .card-footer .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ===== DANGER BUTTON ===== */
  .settings-root .btn-danger-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 12px;
    color: #f87171;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .settings-root .btn-danger-outline:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .settings-root .hero {
      min-height: auto;
      padding: 100px 20px 40px;
    }
    .settings-root .settings-container {
      padding: 24px 16px 60px;
    }
    .settings-root .card-header {
      padding: 20px;
      flex-wrap: wrap;
    }
    .settings-root .setting-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
    }
    .settings-root .setting-desc {
      max-width: 100%;
    }
    .settings-root .card-footer {
      padding: 16px 20px;
    }
    .settings-root .card-footer .btn-secondary,
    .settings-root .card-footer .btn-primary {
      flex: 1;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .settings-root .card-header {
      gap: 12px;
    }
    .settings-root .card-icon {
      width: 40px;
      height: 40px;
    }
    .settings-root .card-title-wrap h2 {
      font-size: 16px;
    }
    .settings-root .setting-label {
      font-size: 14px;
    }
    .settings-root .setting-desc {
      font-size: 12px;
    }
  }
`;
