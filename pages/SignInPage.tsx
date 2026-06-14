import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../src/context/AuthContext";
import { signInPageData } from "../src/data/signInPageData";
import { authPageStyles } from "../src/styles/authPageStyles";
import { useNavigate } from "react-router-dom";

interface SignInPageProps {
  onNavigate: (page: string) => void;
  onLogin: (name: string, email: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onLogin,
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      // Success - Context will update and persist token to localStorage
      const returnUrl = new URLSearchParams(window.location.search).get(
        "returnUrl",
      );
      navigate(returnUrl || "/");
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error;
      if (status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (status === 403) {
        setError(
          serverMsg?.toLowerCase().includes("verif")
            ? "Account not verified. Please check your email and verify your account before logging in."
            : serverMsg?.toLowerCase().includes("inactive") || serverMsg?.toLowerCase().includes("pending")
            ? "Your account is pending approval. Please contact support."
            : "Access denied. Please check your credentials."
        );
      } else if (serverMsg) {
        setError(serverMsg);
      } else {
        setError("Unable to sign in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    try {
      const { authService } = await import("../src/services/authService");
      await authService.forgotPassword({ email: resetEmail });
      setResetSuccess(true);
      setResetEmail("");
    } catch (err: any) {
      setResetError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to send reset email",
      );
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetSuccess(false);
    setResetError(null);
  };

  return (
    <div className="auth-root">
      <style>{authPageStyles}</style>

      <div className="auth-card signin">
        <div className="auth-header">
          <span className="auth-badge">{signInPageData.badge}</span>
          <h1>{signInPageData.title}</h1>
          <p>{signInPageData.subtitle}</p>
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
              {signInPageData.form.emailLabel}
            </label>
            <div className="auth-input-wrap">
              <Icons.Mail className="auth-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={signInPageData.form.emailPlaceholder}
                className="auth-input with-left-icon"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">
              {signInPageData.form.passwordLabel}
            </label>
            <div className="auth-input-wrap">
              <Icons.Lock className="auth-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={signInPageData.form.passwordPlaceholder}
                className="auth-input with-left-icon with-right-icon"
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

          <div className="auth-actions">
            <label className="auth-check">
              <input type="checkbox" />
              <span>{signInPageData.form.rememberMe}</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="auth-link"
            >
              {signInPageData.form.forgotPassword}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? signInPageData.form.submitLoading
              : signInPageData.form.submitIdle}
          </Button>
        </form>

        <div className="auth-divider">
          <span>Are you a Seller / Contractor?</span>
        </div>
        <a
          href="http://localhost:5000"
          target="_blank"
          rel="noreferrer"
          className="auth-social-btn w-full"
          style={{ display: "flex", textDecoration: "none", width: "100%", boxSizing: "border-box", textAlign: "center", marginBottom: "15px" }}
        >
          Join as Seller / Contractor
        </a>

        <div className="auth-bottom">
          {signInPageData.bottomText.prefix}{" "}
          <span onClick={() => onNavigate("get-started")} className="auth-link">
            {signInPageData.bottomText.action}
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="auth-modal-backdrop">
          <div className="auth-modal">
            <div className="auth-modal-header">
              <h2>{signInPageData.forgotPassword.title}</h2>
              <button
                onClick={closeForgotPasswordModal}
                className="auth-modal-close"
                aria-label="Close modal"
              >
                <Icons.Close className="h-6 w-6" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="auth-success">
                <div className="auth-success-icon">
                  <Icons.Check className="h-8 w-8" />
                </div>
                <h3>{signInPageData.forgotPassword.successTitle}</h3>
                <p>{signInPageData.forgotPassword.successDescription}</p>
                <Button onClick={closeForgotPasswordModal} className="w-full">
                  {signInPageData.forgotPassword.back}
                </Button>
              </div>
            ) : (
              <>
                <p>{signInPageData.forgotPassword.description}</p>

                {resetError && (
                  <div className="auth-error">
                    <Icons.AlertCircle className="h-5 w-5" />
                    <span>{resetError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword}>
                  <div className="auth-field">
                    <label className="auth-label">
                      {signInPageData.form.emailLabel}
                    </label>
                    <div className="auth-input-wrap">
                      <Icons.Mail className="auth-icon" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder={signInPageData.form.emailPlaceholder}
                        className="auth-input with-left-icon"
                      />
                    </div>
                  </div>

                  <div className="auth-form-actions">
                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="btn-cancel"
                    >
                      {signInPageData.forgotPassword.cancel}
                    </button>
                    <Button
                      type="submit"
                      className="btn-submit"
                      disabled={resetLoading}
                    >
                      {resetLoading
                        ? signInPageData.forgotPassword.submitLoading
                        : signInPageData.forgotPassword.submitIdle}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
