import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../src/services/authService";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { authPageStyles } from "../src/styles/authPageStyles";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword({ token, newPassword: password });
      setDone(true);
    } catch {
      setError("Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{authPageStyles}</style>

      <div className="auth-card signin">
        <div className="auth-header">
          <span className="auth-badge">Security Access</span>
          <h1>Reset Password</h1>
          <p>Choose a new secure password below</p>
        </div>

        {done ? (
          <div className="auth-success" style={{ padding: "20px 0" }}>
            <div className="auth-success-icon">
              <Icons.Check className="h-8 w-8" />
            </div>
            <h3>Password updated</h3>
            <p>Your password has been reset successfully. You can now use your new password to sign in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <Icons.AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="auth-field">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrap">
                <Icons.Lock className="auth-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input with-left-icon with-right-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
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
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <Icons.Lock className="auth-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="auth-input with-left-icon with-right-icon"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-icon-btn"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <Icons.EyeOff className="h-5 w-5" />
                  ) : (
                    <Icons.Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
