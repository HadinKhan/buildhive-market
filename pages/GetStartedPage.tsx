import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../src/context/AuthContext";
import { getStartedPageData } from "../src/data/getStartedPageData";
import { authPageStyles } from "../src/styles/authPageStyles";

interface GetStartedPageProps {
  onNavigate: (page: string) => void;
  onRegister: (name: string, email: string) => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({
  onNavigate,
  onRegister,
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "buyer",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: formData.phone || undefined,
        role: formData.accountType as "buyer" | "contractor" | "supplier",
        termsAccepted: formData.termsAccepted,
      });
      // Success - User is now logged in
      onNavigate("home");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-root">
      <style>{authPageStyles}</style>

      <div className="auth-card register">
        <div className="auth-header">
          <span className="auth-badge">{getStartedPageData.badge}</span>
          <h1>{getStartedPageData.title}</h1>
          <p>{getStartedPageData.subtitle}</p>
        </div>

        {error && (
          <div className="auth-error">
            <Icons.AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">
              {getStartedPageData.form.nameLabel}
            </label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              aria-label="Full Name"
              className="auth-input"
            />
          </div>

          <div className="auth-field-grid two">
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.emailLabel}
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                aria-label="Email Address"
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.phoneLabel}
              </label>
              <input
                name="phone"
                type="tel"
                onChange={handleChange}
                aria-label="Phone Number"
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field-grid two">
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.passwordLabel}
              </label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                aria-label="Password"
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.confirmPasswordLabel}
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
                aria-label="Confirm Password"
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">
              {getStartedPageData.form.accountTypeLabel}
            </label>
            <select
              name="accountType"
              onChange={handleChange}
              value={formData.accountType}
              aria-label="Account Type"
              className="auth-select"
            >
              {getStartedPageData.form.accountTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="auth-actions"
            style={{ justifyContent: "flex-start" }}
          >
            <input
              name="termsAccepted"
              type="checkbox"
              required
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData({ ...formData, termsAccepted: e.target.checked })
              }
              aria-label="Accept Terms and Conditions"
            />
            <span className="auth-check" style={{ cursor: "default" }}>
              <span>
                {getStartedPageData.form.termsPrefix}{" "}
                <a href="#" className="auth-link">
                  {getStartedPageData.form.termsLink}
                </a>{" "}
                and{" "}
                <a href="#" className="auth-link">
                  {getStartedPageData.form.privacyLink}
                </a>
              </span>
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? getStartedPageData.form.submitLoading
              : getStartedPageData.form.submitIdle}
          </Button>
        </form>

        <div className="auth-bottom">
          {getStartedPageData.bottomText.prefix}{" "}
          <span onClick={() => onNavigate("signin")} className="auth-link">
            {getStartedPageData.bottomText.action}
          </span>
        </div>
      </div>
    </div>
  );
};
