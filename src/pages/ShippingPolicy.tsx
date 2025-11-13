import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

export default function ShippingPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Shipping & Delivery Policy</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  How we deliver your orders safely and on time
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">Shipping & Delivery Policy – ElectroMart</h2>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">1. Overview</h3>
                  <p className="text-gray-300 mb-6">
                    <strong>ElectroMart</strong> provides safe and reliable <strong>home delivery</strong> for all online orders. 
                    We aim to deliver your products as quickly as possible while ensuring they arrive in perfect condition.
                  </p>

                  <hr className="border-gray-700 my-8" />

                  <h3 className="text-2xl font-bold text-white mb-4">2. Shipping Locations</h3>
                  <p className="text-gray-300 mb-6">
                    We currently deliver across <strong>India</strong>, covering most cities and towns through trusted courier partners.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">3. Processing Time</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Orders are processed within <strong>1–2 business days</strong> after payment confirmation.</li>
                    <li>You will receive an email or SMS with your tracking ID once the order is shipped.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">4. Delivery Time</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Standard delivery: <strong>3–7 business days</strong> depending on location.</li>
                    <li>Remote or rural areas may take additional time.</li>
                    <li>Delivery delays may occur due to natural events, holidays, or courier issues.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">5. Shipping Charges</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Shipping fees (if any) are displayed during checkout.</li>
                    <li>Free shipping may be available for select orders or promotions.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">6. Order Tracking</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>You can track your order using the tracking link sent via email/SMS.</li>
                    <li>For any delivery issues, contact us directly.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">7. Damaged or Missing Packages</h3>
                  <p className="text-gray-300 mb-4">
                    If your order arrives damaged or incomplete:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Report it to <a href="mailto:support@electromart.in" className="text-accent hover:underline">support@electromart.in</a> within <strong>48 hours</strong>.</li>
                    <li>Share clear photos of the packaging and item condition.</li>
                    <li>We'll arrange for a replacement or refund after verification.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">8. Contact</h3>
                  <ul className="list-none text-gray-300 mb-6 space-y-2">
                    <li><strong>📧</strong> <a href="mailto:support@electromart.in" className="text-accent hover:underline">support@electromart.in</a></li>
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
                    to="/refund"
                    className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent font-bold py-3 px-8 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
                  >
                    Refund Policy
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