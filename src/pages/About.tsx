import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">About ElectroMart</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Your trusted destination for all types of electronic devices and components
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-5xl mx-auto space-y-12">
                {/* Introduction */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Welcome to ElectroMart
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Your trusted destination for all types of electronic devices and components. 
                    We specialize in providing high-quality products ranging from Arduino boards, 
                    Raspberry Pi kits, sensors, motors, and a wide variety of electronic gadgets 
                    for hobbyists, students, and professionals alike.
                  </p>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&h=400&q=80" 
                      alt="Arduino Boards" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-gray-700 p-4">
                      <h3 className="text-white font-bold text-center">Arduino Boards</h3>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1592827570540-f93b8ac4b63b?auto=format&fit=crop&w=600&h=400&q=80" 
                      alt="Raspberry Pi Kits" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-gray-700 p-4">
                      <h3 className="text-white font-bold text-center">Raspberry Pi Kits</h3>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1555404511-5a91586b7113?auto=format&fit=crop&w=600&h=400&q=80" 
                      alt="Electronic Sensors" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-gray-700 p-4">
                      <h3 className="text-white font-bold text-center">Electronic Sensors</h3>
                    </div>
                  </div>
                </div>

                {/* Our Commitment */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Our Commitment
                  </h2>
                  <p className="text-gray-300 mb-6">
                    At ElectroMart, we are committed to delivering reliable products and excellent services to our customers. 
                    Our platform ensures a seamless shopping experience with features like:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-accent mb-3">Home Delivery</h3>
                      <p className="text-gray-300">
                        Get your electronics delivered safely and conveniently to your doorstep.
                      </p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-accent mb-3">24/7 Customer Support</h3>
                      <p className="text-gray-300">
                        Our dedicated team is always ready to assist you with any queries or issues.
                      </p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-accent mb-3">Order Tracking</h3>
                      <p className="text-gray-300">
                        Keep track of your orders in real-time and stay updated on delivery status.
                      </p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-accent mb-3">Order History & Invoice Management</h3>
                      <p className="text-gray-300">
                        Easily access past orders, payment details, and downloadable invoices for your convenience.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Our Mission */}
                <div className="mt-12 bg-gray-700 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Our Mission
                  </h2>
                  <p className="text-gray-300 text-center text-lg">
                    Whether you are a maker, engineer, or tech enthusiast, ElectroMart is your one-stop-shop 
                    for all electronic needs. We pride ourselves on offering trustworthy products, timely delivery, 
                    and outstanding support, helping you bring your ideas to life effortlessly.
                  </p>
                  <div className="text-center mt-6">
                    <blockquote className="text-accent text-xl font-bold italic">
                      "Powering Innovation, One Component at a Time"
                    </blockquote>
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