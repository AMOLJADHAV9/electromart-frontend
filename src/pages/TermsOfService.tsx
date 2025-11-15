import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Please read these terms carefully before using ElectroMart services
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">Terms of Service – ElectroMart</h2>
                  
                  <p className="text-gray-300 text-lg">
                    Welcome to <strong>ElectroMart</strong>, your trusted online electronics store. These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and services. By visiting our site, creating an account, or placing an order, you agree to be bound by these Terms. Please read them carefully before using our services.
                  </p>

                  <hr className="border-gray-700 my-8" />

                  <h3 className="text-2xl font-bold text-white mb-4">1. Overview</h3>
                  <p className="text-gray-300 mb-6">
                    ElectroMart provides an online platform that allows customers to browse, purchase, and receive electronic products through secure online transactions. Our goal is to deliver genuine, high-quality products with fast and reliable home delivery services.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">2. Account Registration</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>To make a purchase, you may need to create an account with accurate personal and contact details.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>ElectroMart is not liable for any unauthorized access caused by your negligence in handling login information.</li>
                    <li>Users must be at least 18 years of age to make purchases.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">3. Product Information</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>We strive to display product details, descriptions, and prices accurately.</li>
                    <li>However, minor variations may occur due to color differences or display settings.</li>
                    <li>Prices are subject to change at any time without prior notice.</li>
                    <li>All products are subject to availability; ElectroMart reserves the right to cancel or limit orders if items are out of stock.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">4. Orders and Payments</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Orders are confirmed only after full payment through our secure payment gateways such as <strong>Razorpay, UPI, debit/credit card, or net banking</strong>.</li>
                    <li>Once your order is placed, you will receive a confirmation email or message.</li>
                    <li>ElectroMart reserves the right to cancel an order in case of suspected fraud, invalid payment, or unavailability of stock.</li>
                    <li>In such cases, the full payment will be refunded to your original payment method.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">5. Shipping and Delivery</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>We provide <strong>home delivery services</strong> across our operational regions.</li>
                    <li>Shipping charges and estimated delivery times are displayed at checkout.</li>
                    <li>Orders are shipped within <strong>2–5 business days</strong>, depending on product availability and location.</li>
                    <li>Customers will receive a tracking ID to monitor delivery status.</li>
                    <li>ElectroMart is not responsible for delays caused by courier partners or unforeseen events (like weather conditions or strikes).</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">6. Returns, Replacement, and Refund Policy</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Returns are accepted only for <strong>defective, damaged, or incorrect items</strong> received.</li>
                    <li>Customers must report issues within <strong>7 days</strong> of product delivery.</li>
                    <li>To request a return or replacement, contact our support team with your order ID and product details.</li>
                    <li>Refunds will be initiated once the product is inspected and verified by our team.</li>
                    <li>Refunds will be processed to the original payment method within <strong>5–10 working days</strong>.</li>
                    <li>Products damaged due to customer mishandling are not eligible for return or refund.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">7. Warranty Policy</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Many products sold on ElectroMart come with a <strong>manufacturer's warranty</strong>.</li>
                    <li>Customers are required to contact the respective brand or authorized service center for warranty claims.</li>
                    <li>ElectroMart does not directly provide product servicing or repair.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">8. User Responsibilities</h3>
                  <p className="text-gray-300 mb-4">By using our website, you agree to:</p>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>Provide accurate and up-to-date information.</li>
                    <li>Use the platform for lawful purposes only.</li>
                    <li>Not attempt to breach or misuse the website, payment system, or any data stored on our servers.</li>
                    <li>Refrain from using false identities or engaging in fraudulent transactions.</li>
                  </ul>
                  <p className="text-gray-300 mb-6">
                    ElectroMart reserves the right to suspend or terminate accounts found violating these terms.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">9. Privacy and Data Protection</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>We are committed to protecting your privacy.</li>
                    <li>Your personal data (such as name, address, contact number, and payment details) is collected only to process your orders efficiently.</li>
                    <li>We never share your personal data with third parties except for delivery or payment processing partners.</li>
                    <li>All transactions are secured using encryption and comply with standard data protection practices.</li>
                    <li>For more details, please read our <strong>Privacy Policy</strong>.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>ElectroMart is not responsible for any indirect, incidental, or consequential damages arising from product misuse, delay in delivery, or website errors.</li>
                    <li>Our liability is limited to the total value of the product purchased.</li>
                    <li>We make no guarantees about continuous, uninterrupted, or error-free website operation.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">11. Modification of Terms</h3>
                  <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                    <li>ElectroMart reserves the right to update, modify, or replace any part of these Terms at any time.</li>
                    <li>Updated Terms will be posted on this page with the "Last Updated" date.</li>
                    <li>Continued use of the website after any changes means you accept those modifications.</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-white mb-4">12. Governing Law</h3>
                  <p className="text-gray-300 mb-6">
                    These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes will be subject to the jurisdiction of the courts located in <strong>[Your City/State]</strong>.
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">13. Contact Us</h3>
                  <p className="text-gray-300 mb-6">
                    If you have any questions or concerns regarding these Terms or your order, please contact us at:
                  </p>
                  <ul className="list-none text-gray-300 mb-6 space-y-2">
                    <li><strong>📧</strong> <a href="mailto:support@electromart.in" className="text-accent hover:underline">support@electromart.in</a></li>
                    <li><strong>📞</strong> +91-9552678123</li>
                  </ul>

                  <div className="bg-gray-700 p-6 rounded-lg mt-8">
                    <p className="text-gray-300">
                      <strong>✅ Last Updated:</strong> April 5, 2025
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
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent font-bold py-3 px-8 rounded-lg hover:bg-accent hover:text-black transition-all duration-300"
                  >
                    Shop Now
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