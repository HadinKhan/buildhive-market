export const homePageStyles = `
.home-root {
  min-height: 100vh;
  background: #0b0f12;
  color: #e2e8f0;
  overflow-x: hidden;
}

.hero-section {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 84px 24px 64px;
  overflow: hidden;
  background-image: linear-gradient(180deg, rgba(11,15,18,0.30), rgba(11,15,18,0.92)), url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&h=1100&fit=crop");
  background-size: cover;
  background-position: center;
}

.hero-grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(165, 140, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(165, 140, 255, 0.05) 1px, transparent 1px); background-size: 56px 56px; mask-image: linear-gradient(to bottom, black 0%, transparent 88%); }

.hero-content { position: relative; z-index: 2; max-width: 940px; text-align: center; }

.hero-badge { display: inline-block; padding: 0 0 5px; background: transparent; border-bottom: 2px solid rgba(165, 140, 255, 0.45); color: #d9ccff; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 32px; }

.hero-title { font-size: clamp(38px, 6vw, 68px); font-weight: 900; line-height: 1.08; color: white; margin: 0 0 24px; }
.gradient-text { background: linear-gradient(135deg, #d8ccff, #a58cff, #7e6bc7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: clamp(16px, 2vw, 20px); color: #cbd5e1; line-height: 1.7; max-width: 660px; margin: 0 auto 40px; }

.search-btn, .btn-primary, .btn-secondary { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 16px; font-weight: 800; cursor: pointer; transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease; }

.search-btn { padding: 12px 24px; background: #1a1426; color: #f5f3ff; font-size: 14px; border: 1px solid rgba(167, 139, 250, 0.44); white-space: nowrap; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 12px 26px rgba(0, 0, 0, 0.24); }

.search-btn:hover, .btn-primary:hover { transform: translateY(-2px); border-color: rgba(196, 181, 253, 0.68); background: #211830; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22); }

.hero-cta-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
.btn-primary, .btn-secondary { min-height: 54px; padding: 0 30px; font-size: 15px; }
.btn-primary { background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426; color: #f5f3ff; border: 1px solid rgba(167, 139, 250, 0.44); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22); }
.btn-secondary { background: rgba(255, 255, 255, 0.025); color: #e9d5ff; border: 1px solid rgba(167, 139, 250, 0.28); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.055); color: #ffffff; transform: translateY(-2px); border-color: rgba(167, 139, 250, 0.5); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24); }

.hero-stats-bar { display: flex; justify-content: center; gap: 44px; flex-wrap: wrap; padding: 24px; background: rgba(17, 21, 29, 0.72); border: 1px solid rgba(126, 107, 199, 0.18); border-radius: 20px; backdrop-filter: blur(12px); }
.hero-stat { text-align: center; }
.hero-stat-value { font-size: 24px; font-weight: 900; color: white; margin-bottom: 4px; }
.hero-stat-label { font-size: 13px; color: #94a3b8; font-weight: 700; }

.section { padding: 82px 24px; max-width: 1200px; margin: 0 auto; }
.section.alt { max-width: none; background: linear-gradient(180deg, transparent, rgba(126, 107, 199, 0.04), transparent); }
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-label { display: inline-block; padding: 0 0 5px; background: transparent; border: 0; border-bottom: 2px solid rgba(165, 140, 255, 0.45); color: #d9ccff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
.section-title { font-size: clamp(28px, 4vw, 40px); font-weight: 900; color: white; margin: 0 0 12px; }
.section-subtitle { font-size: 16px; color: #94a3b8; max-width: 560px; margin: 0 auto; line-height: 1.6; }

.home-about-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
.home-about-copy h2 { font-size: clamp(30px, 4vw, 48px); line-height: 1.12; font-weight: 900; color: #fff; margin: 0 0 20px; }

`;

export default homePageStyles;
