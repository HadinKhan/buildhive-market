import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../src/services/authService";

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const redirectedResult = useMemo(() => {
    const resultStatus = searchParams.get("status")?.trim();
    const verified = searchParams.get("verified")?.trim();

    if (verified === "true") {
      return {
        status: "success" as const,
        message:
          searchParams.get("message")?.trim() ||
          "Email verified successfully.",
      };
    }

    if (resultStatus !== "success" && resultStatus !== "error") {
      return null;
    }

    return {
      status: resultStatus,
      message:
        searchParams.get("message")?.trim() ||
        (resultStatus === "success"
          ? "Email verified successfully."
          : "Verification failed. Please request a new link."),
    };
  }, [searchParams]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Please wait.");
  const navigate = useNavigate();

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    if (redirectedResult) {
      setStatus(redirectedResult.status);
      setMessage(redirectedResult.message);

      if (redirectedResult.status === "success") {
        timer = window.setTimeout(() => navigate("/signin"), 3000);
      }

      return () => {
        cancelled = true;
        if (timer) window.clearTimeout(timer);
      };
    }

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing or invalid.");
      return;
    }

    authService
      .verifyEmail(token)
      .then((apiMessage) => {
        if (cancelled) return;
        setStatus("success");
        setMessage(apiMessage || "Email verified successfully.");
        timer = window.setTimeout(() => navigate("/signin"), 3000);
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          error?.message || "Verification failed. Please request a new link.",
        );
      });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [navigate, redirectedResult, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white px-10 py-12 text-center shadow-sm">
        {status === "loading" && (
          <>
            <div className="mb-4 text-4xl">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h2 className="text-2xl font-semibold text-green-600">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {message} Redirecting to sign in...
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
              {message}
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
