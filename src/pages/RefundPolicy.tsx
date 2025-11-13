import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Refund & Return Policy</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Our policy on returns, replacements, and refunds
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">Refund & Return Policy – ElectroMart</h2>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">1. Overview</h3>
                  <p className="text-gray-300 mb-6">
                    At <strong>ElectroMart</strong>, customer satisfaction is our top priority. 
                    If you are not fully satisfied with your purchase, we offer return, replacement, or refund services under the conditions below.
                  </p>

                  <hr className="border-gray-700 my-8" />

                  <h3 className="text-2xl font-bold text-white mb-4">2. Eligibility for Returns</h3>
                  <p className="text-gray-300 mb-4">
                    You can request a return or replacement if:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>You received a <strong>damaged, defective, or incorrect product</strong>.</li>
                    <li>The issue is reported within <strong>7 days</strong> of delivery.</li>
                    <li>The item is unused and in its original packaging.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">3. Non-Returnable Items</h3>
                  <p className="text-gray-300 mb-4">
                    Certain items are not eligible for return, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Products damaged due to customer mishandling.</li>
                    <li>Items without original packaging or invoice.</li>
                    <li>Software, downloads, or consumable electronic accessories.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">4. Return Process</h3>
                  <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
                    <li>Contact our support team at <a href="mailto:support@electromart.in" className="text-accent hover:underline">support@electromart.in</a> with your <strong>order ID</strong> and issue details.</li>
                    <li>Our team will arrange a <strong>pickup</strong> or request you to ship the product back.</li>
                    <li>Once verified, we'll process the <strong>replacement or refund</strong> within <strong>5–10 business days</strong>.</li>
                  </ol>

                  <h3 className="text-2xl font-bold text-white mb-4">5. Refund Process</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Refunds are issued to the original payment method only (Razorpay/UPI/Card).</li>
                    <li>Shipping charges are non-refundable unless the return is due to our error.</li>
                    <li>Refund time may vary based on your bank or payment provider.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">6. Cancellation Policy</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Orders can be canceled before they are shipped.</li>
                    <li>Once dispatched, cancellations are not accepted.</li>
                    <li>A full refund will be issued for successfully canceled orders.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">7. Contact</h3>
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
                    to="/shipping"
                    className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent font-bold py-3 px-8 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
                  >
                    Shipping Policy
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