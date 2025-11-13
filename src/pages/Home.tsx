import { ArrowRight, Zap, Radio, Cpu, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { useState, useEffect } from "react";
import { firebaseAPI } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
  offer?: {
    isActive: boolean;
    discountPercentage: number;
    endDate: string;
    description: string;
  };
  sales?: number; // Add sales field
}

const categoriesData = [
  {
    name: "Arduino Boards",
    icon: "🎛️",
    description: "Uno, Nano, Mega, and more",
    productCount: 24,
    color: "blue" as const,
  },
  {
    name: "Sensors",
    icon: "📡",
    description: "Ultrasonic, IR, DHT11, and more",
    productCount: 45,
    color: "orange" as const,
  },
  {
    name: "Modules",
    icon: "🔌",
    description: "Bluetooth, WiFi, Relay, Motor",
    productCount: 38,
    color: "green" as const,
  },
  {
    name: "Robotics",
    icon: "🤖",
    description: "Kits, Motors, and Wheels",
    productCount: 18,
    color: "purple" as const,
  },
];

const categories = [
  {
    name: "Arduino Boards",
    icon: "🎛️",
    description: "Uno, Nano, Mega, and more",
    productCount: 24,
    color: "blue" as const,
  },
  {
    name: "Sensors",
    icon: "📡",
    description: "Ultrasonic, IR, DHT11, and more",
    productCount: 45,
    color: "orange" as const,
  },
  {
    name: "Modules",
    icon: "🔌",
    description: "Bluetooth, WiFi, Relay, Motor",
    productCount: 38,
    color: "green" as const,
  },
  {
    name: "Robotics",
    icon: "🤖",
    description: "Kits, Motors, and Wheels",
    productCount: 18,
    color: "purple" as const,
  },
];

// Carousel images
const carouselImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    title: "Arduino Boards Collection",
    subtitle: "Premium Quality Development Boards"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
    title: "Electronic Sensors",
    subtitle: "Advanced Sensor Technology"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    title: "Robotics Components",
    subtitle: "Build Your Next Project"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
    title: "IoT Modules & Kits",
    subtitle: "Connect Everything"
  }
];

export default function Home() {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [offerProducts, setOfferProducts] = useState<any[]>([]); // New state for offer products
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]); // New state for trending products

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentCarouselIndex(index);
  };

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await firebaseAPI.getCollection("products");
        
        if (productsResponse.success) {
          const productsData = productsResponse.data.map((productData: any) => ({
            id: productData.id,
            ...productData,
            // Map Firestore fields to ProductCard props
            originalPrice: productData.price * 1.2, // Example: 20% higher original price
            rating: productData.rating || 4.5,
            reviews: productData.reviews || 0,
            sales: productData.sales || 0, // Map sales data
            description: productData.description || "",
            inStock: (productData.stock || 0) > 0,
          }));
          
          setFeaturedProducts(productsData);
          
          // Sort products by sales to get trending products
          const sortedBySales = [...productsData].sort((a, b) => 
            (b.sales || 0) - (a.sales || 0)
          );
          setTrendingProducts(sortedBySales.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch products with active offers
  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const productsResponse = await firebaseAPI.getCollection("products");
        
        if (productsResponse.success) {
          const offerProductsData: any[] = [];
          const today = new Date();
          
          productsResponse.data.forEach((productData: any) => {
            // Check if product has an active offer
            if (productData.offer && productData.offer.isActive) {
              const endDate = new Date(productData.offer.endDate);
              // Check if offer is still valid (not expired)
              if (endDate >= today) {
                offerProductsData.push({
                  id: productData.id,
                  ...productData,
                  // Calculate discounted price
                  discountedPrice: productData.price * (1 - productData.offer.discountPercentage / 100),
                  originalPrice: productData.price,
                  rating: productData.rating || 4.5,
                  reviews: productData.sales || 0,
                  description: productData.description || "",
                  inStock: (productData.stock || 0) > 0,
                });
              }
            }
          });
          
          // If we have offer products, update the state
          if (offerProductsData.length > 0) {
            setOfferProducts(offerProductsData);
          }
        }
      } catch (error) {
        console.error("Error fetching offer products:", error);
      }
    };

    fetchOfferProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Your One-Stop Electronics Store
              </h1>
              <p className="text-lg text-gray-300">
                Explore Arduino, Sensors, Modules & More! Everything you need for your electronics projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-accent hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-accent text-accent hover:bg-accent hover:text-black font-bold py-3 px-8 rounded-lg transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden md:block">
              <img
                src="https://www.innotronixlabs.com/wp-content/uploads/2023/09/closeup-electronic-circuit-board-with-cpu-microchip-electronic-components-background-1024x722.jpg"
                alt="Electronics Store"
                className="w-full rounded-lg shadow-2xl object-cover h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-400 text-lg">
              Explore our wide range of electronic components
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-16 sm:py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Featured Collections
          </h2>

          <div className="relative group">
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              {/* Images Container with Transition */}
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
              >
                {carouselImages.map((item) => (
                  <div key={item.id} className="min-w-full relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 sm:h-96 md:h-[500px] object-cover"
                />

                {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 flex flex-col items-center justify-center text-white text-center px-4">
                      <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 animate-fade-in">
                        {item.title}
                  </h3>
                      <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200">
                        {item.subtitle}
                  </p>
                      <Link
                        to="/products"
                        className="bg-accent hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
                      >
                        Shop Now
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevCarousel}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-300 z-10 shadow-lg hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-300 z-10 shadow-lg hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentCarouselIndex 
                        ? "bg-accent w-8" 
                        : "bg-white/50 w-2 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Trending Products
              </h2>
              <p className="text-gray-400">
                Most popular items this week
              </p>
            </div>
            <Link
              to="/products"
              className="text-accent font-semibold hover:text-yellow-300 flex items-center gap-2 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content / Blog Section */}
      <section className="py-16 sm:py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Learn & Build
            </h2>
            <p className="text-gray-400 text-lg">
              Tutorials, projects, and guides to help you master electronics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Getting Started with Arduino</h3>
              <p className="text-gray-300 mb-4">
                Learn the basics of Arduino programming and build your first LED blinking project.
              </p>
              <span className="text-accent font-medium">Read Tutorial →</span>
            </div>

            {/* Project 2 */}
            <div className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Radio className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IoT Weather Station</h3>
              <p className="text-gray-300 mb-4">
                Build a complete weather monitoring system using sensors and WiFi modules.
              </p>
              <span className="text-accent font-medium">View Project →</span>
            </div>

            {/* Project 3 */}
            <div className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Robotics Workshop</h3>
              <p className="text-gray-300 mb-4">
                Step-by-step guide to building your own line-following robot from scratch.
              </p>
              <span className="text-accent font-medium">Watch Video →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Why Choose ElectroMart?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-400">
                Get your orders delivered within 2-3 business days
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Authentic Products
              </h3>
              <p className="text-gray-400">
                100% genuine electronics from trusted brands
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Expert Support
              </h3>
              <p className="text-gray-400">
                Get technical guidance from our experienced team
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Best Prices
              </h3>
              <p className="text-gray-400">
                Competitive prices with exclusive discounts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 sm:py-20 border-t border-gray-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get exclusive deals, product launches, and tech tips delivered to your inbox
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white font-medium outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </Layout>
  );
}