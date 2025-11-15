import Layout from "@/components/Layout";
import { ArrowRight, AlertCircle, CheckCircle, Truck, Phone, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, register } from "@/hooks/useAuth";
import { firebaseAPI } from "@/lib/api";
import React from "react";

export default function DeliveryBoyRegister() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not admin or not logged in
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/admin-login");
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validation
      if (!name || !email || !phone || !password || !confirmPassword) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        setError("Please enter a valid 10-digit phone number");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Use Firebase Authentication to create delivery boy user
      const userCredential = await register(email, password, "delivery");
      
      // Update the user's additional information in Firestore
      if (userCredential.user) {
        await firebaseAPI.updateDocument("users", userCredential.user.uid, {
          name: name,
          phone: phone,
          vehicleType: vehicleType,
          licenseNumber: licenseNumber,
          role: "delivery"
        });
      }
      
      setSuccess("Delivery boy account created successfully!");
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setVehicleType("");
      setLicenseNumber("");
    } catch (err: any) {
      console.error("Delivery boy registration error:", err);
      // Handle Firebase auth errors
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/password accounts are not enabled. Please contact support.");
      } else {
        setError(err.message || "Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Delivery Boy Registration</span>
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

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="delivery@example.com"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    disabled={loading}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Password <span className="text-red-400">*</span>
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
                
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">
                    License Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="DL-1234567890123"
                      className="w-full pl-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  className="rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent mt-1" 
                  disabled={loading} 
                  required 
                />
                <span className="text-gray-300 text-sm">
                  I confirm this person is authorized to be a delivery boy and has provided accurate information
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Delivery Boy Account"}
                </button>
                
                <Link
                  to="/admin"
                  className="flex-1 text-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  Back to Admin Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}