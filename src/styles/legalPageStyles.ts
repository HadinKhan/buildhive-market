export const legalPageStyles = `
  .legal-root {
    min-height: calc(100vh - 80px);
    background:
      radial-gradient(1200px 600px at 10% -10%, rgba(124, 58, 237, 0.18), transparent 45%),
      radial-gradient(900px 500px at 95% 5%, rgba(167, 139, 250, 0.14), transparent 45%),
      linear-gradient(180deg, #0a0a0f 0%, #0d0d16 100%);
    color: #e2e8f0;
    padding: 48px 16px 72px;
  }

  .legal-shell {
    max-width: 980px;
    margin: 0 auto;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(10, 12, 20, 0.78);
    backdrop-filter: blur(14px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    padding: 34px 28px;
  }

  .legal-badge {
    display: inline-block;
    padding: 0 0 5px;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    color: #d9ccff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .legal-title {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: clamp(30px, 5vw, 46px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-weight: 800;
  }

  .legal-subtitle {
    margin: 0 0 28px;
    color: #94a3b8;
    font-size: 15px;
    line-height: 1.7;
  }

  .legal-sections {
    display: grid;
    gap: 16px;
  }

  .legal-section {
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
    padding: 20px;
  }

  .legal-section h2 {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .legal-section h3 {
    margin: 14px 0 8px;
    color: #c4b5fd;
    font-size: 16px;
    font-weight: 700;
  }

  .legal-section p {
    margin: 0;
    color: #cbd5e1;
    font-size: 15px;
    line-height: 1.8;
    text-align: justify;
    text-justify: inter-word;
  }

  .legal-section p + p {
    margin-top: 10px;
  }

  .legal-section ul {
    margin: 10px 0 0;
    padding-left: 18px;
    color: #cbd5e1;
    display: grid;
    gap: 7px;
  }

  .legal-section li {
    line-height: 1.7;
  }

  .legal-section strong {
    color: #ffffff;
    font-weight: 700;
  }

  .legal-contact {
    margin-top: 12px;
    color: #e2e8f0;
    font-weight: 600;
    line-height: 1.8;
  }

  .legal-updated {
    margin-top: 16px;
    color: #94a3b8;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    .legal-root {
      padding: 30px 12px 50px;
    }

    .legal-shell {
      padding: 22px 16px;
      border-radius: 18px;
    }

    .legal-section {
      padding: 16px;
    }

    .legal-section h2 {
      font-size: 18px;
    }
  }
`;
