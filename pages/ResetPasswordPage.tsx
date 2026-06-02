import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../src/services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
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
      setTimeout(() => navigate("/signin"), 2000);
    } catch {
      setError("Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Reset Password
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Enter your new password below.
        </p>
        {done ? (
          <div className="rounded-lg bg-green-50 px-3 py-3 text-center text-sm text-green-600">
            Password reset successful! Redirecting to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />
            </div>
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-3 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
