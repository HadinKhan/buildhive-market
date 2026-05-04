export const contactPageStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }

.contact-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #e2e8f0; line-height: 1.6; overflow-x: hidden; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
@keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
@keyframes floatReverse { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-2deg); } }
@keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes meshMove { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -30px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.95); } 100% { transform: translate(0, 0) scale(1); } }
@keyframes meshMove2 { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-40px, 20px) scale(1.05); } 66% { transform: translate(20px, -40px) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
@keyframes diagonalSlide { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
@keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
@keyframes wave { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-5px); } 75% { transform: translateY(5px); } }
@keyframes borderGlow { 0%, 100% { border-color: rgba(139, 92, 246, 0.3); } 50% { border-color: rgba(139, 92, 246, 0.8); } }

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

.hero { min-height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 140px 20px 100px; background: linear-gradient(135deg, #0a0a0f 0%, #0f0818 50%, #0a0a0f 100%); position: relative; overflow: hidden; }
.mesh-blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.4; }
.mesh-blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%); top: -200px; right: -100px; animation: meshMove 12s ease-in-out infinite; }
.mesh-blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%); bottom: -150px; left: -100px; animation: meshMove2 15s ease-in-out infinite; }
.mesh-blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%); top: 40%; left: 50%; transform: translateX(-50%); animation: meshMove 18s ease-in-out infinite reverse; }

.hero-content { position: relative; z-index: 2; max-width: 800px; }
.hero-badge { display: inline-block; padding: 0 0 5px; background: transparent; border: 0; border-bottom: 2px solid rgba(139, 92, 246, 0.45); color: #d9ccff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 32px; }

.contact-pills { display: flex; gap: 12px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
.contact-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 50px; color: #94a3b8; font-size: 14px; font-weight: 500; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); text-decoration: none; }
.contact-pill:hover { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); color: #a78bfa; transform: translateY(-3px); }

.contact-section { padding: 100px 20px; max-width: 1200px; margin: 0 auto; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: start; }
.contact-info h2 { font-size: 2.2rem; font-weight: 800; color: white; margin-bottom: 16px; letter-spacing: -0.02em; }

.info-cards { display: flex; flex-direction: column; gap: 20px; }
.info-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 20px; padding: 28px; display: flex; align-items: flex-start; gap: 20px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.info-card:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(139, 92, 246, 0.25); transform: translateX(8px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }

.form-container { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 28px; padding: 48px; position: relative; overflow: hidden; }
.form-container::before { content: ''; position: absolute; top: -200px; right: -200px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%); border-radius: 50%; pointer-events: none; }

.form-header h2 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 8px; }
.form-group { margin-bottom: 24px; position: relative; z-index: 1; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-label { display: block; color: #cbd5e1; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.form-input, .form-textarea, .form-select { width: 100%; padding: 14px 18px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; color: white; font-size: 15px; font-family: inherit; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); outline: none; }
.form-input::placeholder, .form-textarea::placeholder { color: #475569; }
.form-input:focus, .form-textarea:focus, .form-select:focus { border-color: rgba(139, 92, 246, 0.5); background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }

.submit-btn { position: relative; overflow: hidden; width: 100%; min-height: 54px; padding: 0 28px; background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426; color: #f5f3ff; border: 1px solid rgba(167, 139, 250, 0.44); border-radius: 16px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22); }
.submit-btn:hover { transform: translateY(-3px); border-color: rgba(196, 181, 253, 0.68); background: #211830; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22); }

.feedback { border-radius: 12px; padding: 12px 14px; font-size: 14px; margin-bottom: 18px; }
.feedback.success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; }
.feedback.error { background: rgba(239, 68, 68, 0.14); border: 1px solid rgba(239, 68, 68, 0.35); color: #fca5a5; }

.faq-section { padding: 100px 20px; max-width: 900px; margin: 0 auto; }
.faq-section .section-header { text-align: center; margin-bottom: 60px; }

.section-label { display: inline-block; padding: 0 0 5px; background: transparent; border: 0; border-bottom: 2px solid rgba(139, 92, 246, 0.45); color: #d9ccff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
.section-title { font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 800; color: white; line-height: 1.15; letter-spacing: -0.02em; }

.faq-list { display: flex; flex-direction: column; gap: 16px; }
.faq-item { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 20px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.faq-item:hover { border-color: rgba(139, 92, 246, 0.15); }
.faq-item.expanded { border-color: rgba(139, 92, 246, 0.25); background: rgba(255, 255, 255, 0.03); }

.faq-question { padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.faq-question h3 { color: white; font-size: 1.05rem; font-weight: 600; padding-right: 20px; }
.faq-item.expanded .faq-question h3 { color: #a78bfa; }

.faq-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); color: #a78bfa; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.faq-item.expanded .faq-icon { background: #7c3aed; border-color: #7c3aed; color: white; transform: rotate(180deg); }

`;

export default contactPageStyles;
