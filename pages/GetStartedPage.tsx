import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../src/context/AuthContext";
import { getStartedPageData } from "../src/data/getStartedPageData";
import { authPageStyles } from "../src/styles/authPageStyles";
import { toast } from "react-toastify";

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
    businessName: "",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const needsBusinessName = false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const phone = formData.phone ? formData.phone.trim() : "";
    if (phone) {
      const phoneRegex = /^03[0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError("Phone number must start with 03 and be 11 digits (e.g. 03001234567)");
        return;
      }
    }

    if (needsBusinessName && !formData.businessName.trim()) {
      setError("Business name is required for Seller and Contractor accounts");
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phone: phone || undefined,
        role: "buyer",
        termsAccepted: formData.termsAccepted,
      } as any);
      toast.success("Account created! Check your email to verify before logging in.");
      onRegister(formData.name, formData.email);
      onNavigate("signin");
    } catch (err: any) {
      // Parse human-readable message from backend response
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
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
          <img src="/Build-Hive-Logo.png" alt="BuildHive Logo" className="mx-auto h-12 w-auto mb-4 object-contain" />
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
                placeholder="03XXXXXXXXX"
                onChange={(e) => {
                  handleChange(e);
                  if (phoneError) setPhoneError(null);
                }}
                aria-label="Phone Number"
                className="auth-input"
              />
              {phoneError && (
                <div style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>
                  {phoneError}
                </div>
              )}
            </div>
          </div>

          <div className="auth-field-grid two">
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.passwordLabel}
              </label>
              <div className="auth-input-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  aria-label="Password"
                  className="auth-input with-right-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-icon-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icons.EyeOff className="h-5 w-5" />
                  ) : (
                    <Icons.Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">
                {getStartedPageData.form.confirmPasswordLabel}
              </label>
              <div className="auth-input-wrap">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  aria-label="Confirm Password"
                  className="auth-input with-right-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-icon-btn"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <Icons.EyeOff className="h-5 w-5" />
                  ) : (
                    <Icons.Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
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
