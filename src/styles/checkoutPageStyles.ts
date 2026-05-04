export const checkoutPageStyles = `
  .checkout-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0f 0%, #0b0f12 50%, #1a1426 100%);
    padding: 2.5rem 0;
  }

  .checkout-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .breadcrumb-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .breadcrumb-link {
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .breadcrumb-link:hover {
    color: #7c3aed;
  }

  .breadcrumb-active {
    color: #7c3aed;
  }

  .breadcrumb-separator {
    height: 1rem;
    width: 1rem;
    color: #4b5563;
  }

  .checkout-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .checkout-form-wrapper {
      flex-direction: row;
    }
  }

  .checkout-form-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .checkout-form-section {
    border-radius: 1rem;
    border: 1px solid #2d3748;
    background: linear-gradient(135deg, #0f1319 0%, #1a1f2e 100%);
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .section-title-icon {
    height: 1.25rem;
    width: 1.25rem;
    color: #7c3aed;
  }

  .form-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .form-group {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form-group-3col {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .form-group-3col {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .form-group-full {
    display: grid;
    grid-template-columns: 1fr;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #2d3748;
    background: #0a0d14;
    color: #f8fafc;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #4b5563;
  }

  .form-input:focus,
  .form-textarea:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    background: #0f1319;
  }

  .form-input.error,
  .form-textarea.error {
    border-color: #ef4444;
  }

  .form-input.error:focus,
  .form-textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .form-error {
    font-size: 0.75rem;
    color: #ef4444;
  }

  .form-textarea {
    resize: none;
  }

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .payment-method-label {
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: 1rem;
    border-radius: 0.75rem;
    border: 1px solid #2d3748;
    padding: 1rem;
    transition: all 0.2s ease;
    background: transparent;
  }

  .payment-method-label:hover {
    background: rgba(124, 58, 237, 0.05);
  }

  .payment-method-label.active {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.1);
    box-shadow: 0 0 0 1px #7c3aed;
  }

  .payment-method-icon-wrapper {
    display: flex;
    height: 2.5rem;
    width: 2.5rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    background: #0f1319;
    color: #9ca3af;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .payment-method-icon {
    height: 1.25rem;
    width: 1.25rem;
  }

  .payment-method-content {
    flex: 1;
  }

  .payment-method-name {
    font-weight: 700;
    color: #f8fafc;
  }

  .payment-method-desc {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .form-radio {
    height: 1rem;
    width: 1rem;
    accent-color: #7c3aed;
    border: 1px solid #4b5563;
    cursor: pointer;
  }

  .order-summary-container {
    width: 100%;
  }

  @media (min-width: 1024px) {
    .order-summary-container {
      width: 24rem;
    }
  }

  .order-summary-sticky {
    position: sticky;
    top: 6rem;
    border-radius: 1rem;
    border: 1px solid #2d3748;
    background: linear-gradient(135deg, #0f1319 0%, #1a1f2e 100%);
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .order-summary-title {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .order-items-scroll {
    margin-bottom: 1.5rem;
    max-height: 15rem;
    overflow-y: auto;
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .order-items-scroll::-webkit-scrollbar {
    width: 4px;
  }

  .order-items-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .order-items-scroll::-webkit-scrollbar-thumb {
    background: #2d3748;
    border-radius: 2px;
  }

  .order-items-scroll::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }

  .order-item {
    display: flex;
    gap: 0.75rem;
  }

  .order-item-image-wrapper {
    height: 3.5rem;
    width: 3.5rem;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 0.5rem;
    background: #0a0d14;
    border: 1px solid #2d3748;
  }

  .order-item-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .order-item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .order-item-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #f8fafc;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .order-item-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .order-item-price {
    font-weight: 600;
    color: #f8fafc;
  }

  .order-summary-divider {
    border-top: 1px solid #2d3748;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .order-summary-row {
    display: flex;
    justify-content: space-between;
    color: #9ca3af;
  }

  .order-summary-row-amount {
    font-weight: 600;
    color: #f8fafc;
  }

  .order-total {
    margin-top: 1rem;
    border-top: 1px solid #2d3748;
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .submit-button {
    margin-top: 2rem;
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .terms-text {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .terms-link {
    color: #7c3aed;
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  .terms-link:hover {
    color: #a78bfa;
  }

  /* Success State */
  .checkout-success-container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0f 0%, #0b0f12 50%, #1a1426 100%);
    padding: 1rem;
    text-align: center;
  }

  .success-icon-wrapper {
    margin-bottom: 1.5rem;
    border-radius: 9999px;
    background: rgba(34, 197, 94, 0.1);
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.15);
  }

  .success-icon {
    height: 4rem;
    width: 4rem;
    color: #22c55e;
  }

  .success-title {
    margin-bottom: 0.5rem;
    font-size: 1.875rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .success-message {
    margin-bottom: 2rem;
    max-width: 28rem;
    color: #9ca3af;
  }

  .success-order-number {
    font-weight: 700;
    color: #7c3aed;
  }

  .success-buttons {
    display: flex;
    gap: 1rem;
  }

  .success-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .success-button-primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
    color: #fff;
  }

  .success-button-primary:hover {
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .success-button-outline {
    border: 1px solid #2d3748;
    background: transparent;
    color: #f8fafc;
  }

  .success-button-outline:hover {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.05);
  }

  /* Stripe Form Container */
  .stripe-form-container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0f 0%, #0b0f12 50%, #1a1426 100%);
    padding: 1rem;
    text-align: center;
  }

  .stripe-form-title {
    margin-bottom: 0.5rem;
    font-size: 1.875rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .stripe-form-subtitle {
    margin-bottom: 2rem;
    max-width: 28rem;
    color: #9ca3af;
  }

  /* Utility Classes */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media (max-width: 768px) {
    .checkout-page {
      padding: 1.5rem 0;
    }

    .checkout-form-section {
      padding: 1rem;
    }

    .order-summary-sticky {
      position: static;
      margin-top: 1rem;
    }
  }
`;
