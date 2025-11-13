import Layout from "@/components/Layout";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";
import { useState } from "react";
import React from "react";

const isDev = import.meta.env.DEV;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Using your provided EmailJS configuration
    emailjs.sendForm('service_f4hpxwh', 'template_9rrzj08', e.target as HTMLFormElement, 'GH_fjeGlUVgqKo0yl')
      .then((result) => {
        if (isDev) {
          console.log('Email sent successfully:', result.text);
        }
        setSubmitStatus({ 
          type: 'success', 
          message: 'Message sent successfully! We will get back to you soon.' 
        });
        // Reset form
        (e.target as HTMLFormElement).reset();
      }, (error) => {
        console.error('Email sending failed:', error);
        setSubmitStatus({ 
          type: 'error', 
          message: 'Failed to send message. Please try again later.' 
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have a question? We're here to help. Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-gray-300">codebot2025@gmail.com</p>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
              <p className="text-gray-300">+91 9552678123</p>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Location</h3>
              <p className="text-gray-300">
                Innovation City, Latur, Maharashtra, India, Pin Code - 413527
              </p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {/* Status Message */}
              {submitStatus.type && (
                <div className={`border-l-4 p-4 rounded mb-6 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-900/30 border-green-500 text-green-300' 
                    : 'bg-red-900/30 border-red-500 text-red-300'
                }`}>
                  <p>{submitStatus.message}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={sendEmail}>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-accent text-black font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-300'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Google Map */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15143.749293505549!2d76.56799650297476!3d18.39570348284818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf83bd7132cd29%3A0x83629bac5848da3e!2sLatur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1762804332184!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "500px" }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop Location"
              ></iframe>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-accent text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}