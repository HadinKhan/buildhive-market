import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../src/context/AuthContext";
import { signInPageData } from "../src/data/signInPageData";
import { authPageStyles } from "../src/styles/authPageStyles";

interface SignInPageProps {
  onNavigate: (page: string) => void;
  onLogin: (name: string, email: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onLogin,
}) => {
  const { login } = useAuth();
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
      // Success - Context will update, user will see logged in state
      onNavigate("home");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
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
          "Failed to send reset email"
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
            <label className="auth-label">{signInPageData.form.emailLabel}</label>
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
            <label className="auth-label">{signInPageData.form.passwordLabel}</label>
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
              <input
                type="checkbox"
              />
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
            {loading ? signInPageData.form.submitLoading : signInPageData.form.submitIdle}
          </Button>
        </form>

        <div className="auth-divider">
          <span>{signInPageData.dividerText}</span>
        </div>

        <div className="auth-social-grid">
          <button className="auth-social-btn">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {signInPageData.providers[0]}
          </button>
          <button className="auth-social-btn">
            <Icons.Facebook className="h-5 w-5 text-blue-500" />
            {signInPageData.providers[1]}
          </button>
        </div>

        <div className="auth-bottom">
          {signInPageData.bottomText.prefix}{" "}
          <span
            onClick={() => onNavigate("get-started")}
            className="auth-link"
          >
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
                    <label className="auth-label">{signInPageData.form.emailLabel}</label>
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
                    <button type="button" onClick={closeForgotPasswordModal} className="btn-cancel">
                      {signInPageData.forgotPassword.cancel}
                    </button>
                    <Button
                      type="submit"
                      className="btn-submit"
                      disabled={resetLoading}
                    >
                      {resetLoading ? signInPageData.forgotPassword.submitLoading : signInPageData.forgotPassword.submitIdle}
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
