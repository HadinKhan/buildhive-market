import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { useAuth } from "../src/context/AuthContext";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500">
            Join BuildHive to source the best construction materials
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2">
              <Icons.AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              aria-label="Full Name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                aria-label="Email Address"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                onChange={handleChange}
                aria-label="Phone Number"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                aria-label="Password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
                aria-label="Confirm Password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              name="accountType"
              onChange={handleChange}
              value={formData.accountType}
              aria-label="Account Type"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="buyer">Buyer / Individual</option>
            </select>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              required
              aria-label="Accept Terms and Conditions"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Creating Account..." : "Get Started"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => onNavigate("signin")}
            className="cursor-pointer font-bold text-primary hover:underline"
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};
