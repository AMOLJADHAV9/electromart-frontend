import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  How we collect, use, and protect your personal information
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">Privacy Policy – ElectroMart</h2>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                  <p className="text-gray-300 mb-6">
                    At <strong>ElectroMart</strong>, we respect your privacy and are committed to protecting your personal information. 
                    This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
                  </p>

                  <hr className="border-gray-700 my-8" />

                  <h3 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h3>
                  <p className="text-gray-300 mb-4">
                    We may collect the following details when you use our website:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li><strong>Personal Details:</strong> Name, address, email, phone number, and delivery information.</li>
                    <li><strong>Payment Information:</strong> Transaction details (securely processed by our payment gateway partners — we never store card or UPI details).</li>
                    <li><strong>Usage Data:</strong> Browser type, IP address, device information, and pages visited.</li>
                    <li><strong>Cookies:</strong> To improve website functionality and personalize your experience.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h3>
                  <p className="text-gray-300 mb-4">
                    We use your data to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Process and deliver your orders.</li>
                    <li>Provide customer support.</li>
                    <li>Send order confirmations, invoices, or shipment updates.</li>
                    <li>Improve our website and user experience.</li>
                    <li>Notify you about offers, new products, or policy updates (optional).</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">3. Data Protection</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Your information is stored securely using encryption and access controls.</li>
                    <li>We never sell or rent your personal data to third parties.</li>
                    <li>Only authorized employees or service providers (like courier or payment partners) access data when necessary.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h3>
                  <p className="text-gray-300 mb-6">
                    Our payment processing and delivery are managed by trusted third parties (e.g., Razorpay, courier companies). 
                    Each service follows its own privacy standards, and we encourage you to review their policies.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">5. Cookies</h3>
                  <p className="text-gray-300 mb-6">
                    Cookies help us remember your preferences and analyze site performance. 
                    You can disable cookies in your browser settings if you prefer.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">6. Your Rights</h3>
                  <p className="text-gray-300 mb-4">
                    You can:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Request access to your personal data.</li>
                    <li>Request correction or deletion of incorrect data.</li>
                    <li>Opt-out of promotional emails anytime.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h3>
                  <p className="text-gray-300 mb-6">
                    We may update this Privacy Policy periodically. 
                    All changes will be reflected on this page with the latest update date.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">8. Contact Us</h3>
                  <p className="text-gray-300 mb-6">
                    For privacy-related concerns, contact:
                  </p>
                  <ul className="list-none text-gray-300 mb-6 space-y-2">
                    <li><strong>📧</strong> <a href="mailto:privacy@electromart.in" className="text-accent hover:underline">privacy@electromart.in</a></li>
                    <li><strong>📞</strong> +91-XXXXXXXXXX</li>
                  </ul>

                  <div className="bg-gray-700 p-6 rounded-lg mt-8">
                    <p className="text-gray-300">
                      <strong>📅 Last Updated:</strong> April 5, 2025
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg active:scale-95"
                  >
                    Back to Home
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/terms"
                    className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent font-bold py-3 px-8 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
                  >
                    Terms of Service
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}