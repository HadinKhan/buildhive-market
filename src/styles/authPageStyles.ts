export const authPageStyles = `
  .auth-root {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 38px 16px;
    background:
      radial-gradient(1000px 500px at 5% -10%, rgba(124, 58, 237, 0.24), transparent 48%),
      radial-gradient(900px 500px at 98% 12%, rgba(167, 139, 250, 0.18), transparent 48%),
      linear-gradient(180deg, #090b10 0%, #0d0d16 100%);
  }

  .auth-card {
    width: 100%;
    border-radius: 26px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(15, 16, 26, 0.84);
    backdrop-filter: blur(14px);
    box-shadow: 0 25px 62px rgba(0, 0, 0, 0.4);
    padding: 30px;
  }

  .auth-card.signin {
    max-width: 460px;
  }

  .auth-card.register {
    max-width: 700px;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .auth-badge {
    display: inline-block;
    padding: 0 0 5px;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    color: #d9ccff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .auth-header h1 {
    margin: 0 0 8px;
    color: #fff;
    font-size: 31px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .auth-header p {
    margin: 0;
    color: #94a3b8;
    font-size: 14px;
  }

  .auth-error {
    margin-bottom: 16px;
    border-radius: 14px;
    background: rgba(239, 68, 68, 0.13);
    border: 1px solid rgba(239, 68, 68, 0.35);
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 9px;
    color: #fecaca;
    font-size: 13px;
  }

  .auth-field,
  .auth-field-grid {
    margin-bottom: 14px;
  }

  .auth-field-grid {
    display: grid;
    gap: 14px;
  }

  .auth-field-grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .auth-label {
    margin: 0 0 8px;
    display: block;
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 600;
  }

  .auth-input-wrap {
    position: relative;
  }

  .auth-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #64748b;
    pointer-events: none;
  }

  .auth-input,
  .auth-select {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.32);
    background: rgba(255, 255, 255, 0.03);
    color: #f8fafc;
    font-size: 14px;
    padding: 11px 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .auth-input.with-left-icon {
    padding-left: 40px;
  }

  .auth-input.with-right-icon {
    padding-right: 40px;
  }

  .auth-input::placeholder {
    color: #64748b;
  }

  .auth-select option {
    color: #0f172a;
  }

  .auth-input:focus,
  .auth-select:focus {
    outline: none;
    border-color: rgba(167, 139, 250, 0.7);
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.15);
    background: rgba(255, 255, 255, 0.04);
  }

  .auth-icon-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .auth-icon-btn:hover {
    color: #e2e8f0;
  }

  .auth-actions {
    margin: 8px 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 13px;
  }

  .auth-check {
    display: inline-flex;
    align-items: flex-start;
    gap: 8px;
    color: #94a3b8;
    cursor: pointer;
    line-height: 1.5;
  }

  .auth-check input {
    margin-top: 2px;
    accent-color: #8b5cf6;
  }

  .auth-link {
    border: 0;
    background: transparent;
    color: #c4b5fd;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    padding: 0;
  }

  .auth-link:hover {
    color: #ddd6fe;
    text-decoration: underline;
  }

  .auth-divider {
    position: relative;
    margin: 20px 0;
    text-align: center;
  }

  .auth-divider::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgba(148, 163, 184, 0.25);
  }

  .auth-divider span {
    position: relative;
    z-index: 1;
    padding: 0 10px;
    background: rgba(15, 16, 26, 0.84);
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
  }

  .auth-social-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .auth-social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(255, 255, 255, 0.02);
    color: #cbd5e1;
    padding: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .auth-social-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(167, 139, 250, 0.45);
    transform: translateY(-1px);
  }

  .auth-bottom {
    margin-top: 18px;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
  }

  .auth-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.66);
    backdrop-filter: blur(4px);
  }

  .auth-modal {
    width: 100%;
    max-width: 480px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #11131d;
    padding: 22px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  }

  .auth-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .auth-modal-header h2 {
    margin: 0;
    color: #fff;
    font-size: 26px;
    font-weight: 800;
  }

  .auth-modal-close {
    border: 0;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
  }

  .auth-modal-close:hover {
    color: #fff;
  }

  .auth-modal p {
    margin: 0 0 16px;
    color: #94a3b8;
    line-height: 1.7;
    font-size: 14px;
  }

  .auth-success {
    text-align: center;
    padding: 8px 0 4px;
  }

  .auth-success-icon {
    margin: 0 auto 14px;
    width: 60px;
    height: 60px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 185, 129, 0.16);
    border: 1px solid rgba(16, 185, 129, 0.34);
    color: #86efac;
  }

  .auth-success h3 {
    margin: 0 0 8px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }

  .auth-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 14px;
  }

  .auth-form-actions .btn-cancel {
    flex: 1;
    min-height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(255, 255, 255, 0.03);
    color: #cbd5e1;
    cursor: pointer;
    font-weight: 700;
  }

  .auth-form-actions .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .auth-form-actions .btn-submit {
    flex: 1;
  }

  @media (max-width: 768px) {
    .auth-card {
      border-radius: 18px;
      padding: 20px 16px;
    }

    .auth-field-grid.two {
      grid-template-columns: 1fr;
    }

    .auth-header h1 {
      font-size: 26px;
    }
  }
`;
