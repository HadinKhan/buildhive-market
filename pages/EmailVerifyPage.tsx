import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../src/services/authService";

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/signin"), 3000);
      })
      .catch(() => setStatus("error"));
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white px-10 py-12 text-center shadow-sm">
        {status === "loading" && (
          <>
            <div className="mb-4 text-4xl">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-500">Please wait.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h2 className="text-2xl font-semibold text-green-600">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your account is now active. Redirecting to sign in...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mb-4 text-4xl">❌</div>
            <h2 className="text-2xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 mb-6 text-sm text-gray-500">
              Link may be invalid or expired.
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Go to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
