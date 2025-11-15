import Layout from "@/components/Layout";
import { ArrowRight, AlertCircle, CheckCircle, Truck, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth, login, logout } from "@/hooks/useAuth";
import React from "react";

export default function DeliveryBoyLogin() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser && currentUser.role === "delivery" && !loading) {
      navigate("/delivery-boy");
    }
  }, [currentUser, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Use Firebase Authentication
      await login(email, password);
      
      // Wait a bit for auth state to update, then check role
      setSuccess("Login successful! Checking permissions...");
      setTimeout(() => {
        // The useAuth hook will update currentUser, but we need to check it
        // For now, just redirect - the ProtectedRoute will handle role checking
        navigate("/delivery-boy");
      }, 1000);
    } catch (err: any) {
      console.error("Delivery boy login error:", err);
      // Handle Firebase auth errors
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setEmail("");
      setPassword("");
      setError("");
      setSuccess("");
    } catch (err: any) {
      console.error("Logout error:", err);
      setError("Failed to logout. Please try again.");
    }
  };

  // If user is logged in, show logout option
  if (currentUser && currentUser.role === "delivery") {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Welcome Delivery Boy!
              </h2>

              <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4 mb-6">
                <p className="text-green-400 font-medium">
                  Logged in as:
                </p>
                <p className="text-green-300 text-sm break-all">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-900/30 hover:bg-red-800/50 text-red-300 font-bold py-3 rounded-lg transition-all duration-300 border border-red-900/50"
              >
                Logout
              </button>

              <div className="mt-6 text-center">
                <Link
                  to="/delivery-boy"
                  className="inline-flex items-center gap-2 text-accent hover:text-yellow-300 font-semibold transition-colors"
                >
                  Go to Delivery Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Delivery Boy Panel</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Delivery Boy Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="delivery@gmail.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent" disabled={loading} />
                  <span className="text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-accent hover:text-yellow-300">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Delivery Boy Login"}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-accent hover:text-yellow-300 font-semibold transition-colors"
              >
                User Login
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}