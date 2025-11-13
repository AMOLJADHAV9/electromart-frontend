import Layout from "@/components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { firebaseAPI } from "@/lib/api";
import React from "react";

interface FormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  rating: string;
  image: string;
  description: string;
  tax: string;
  shippingCharges: string;
  offer: {
    isActive: boolean;
    discountPercentage: string;
  };
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "4.5",
    image: "",
    description: "",
    tax: "0",
    shippingCharges: "0",
    offer: {
      isActive: false,
      discountPercentage: "0",
    },
  });
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>([{key: "", value: ""}]);
  const [policies, setPolicies] = useState<string[]>([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox" && "checked" in e.target) {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith("offer.")) {
        const offerField = name.split(".")[1];
        setFormData(prev => ({
          ...prev,
          offer: {
            ...prev.offer,
            [offerField]: checked
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        if (parent === "offer") {
          setFormData(prev => ({
            ...prev,
            offer: {
              ...prev.offer,
              [child]: value
            }
          }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSpecificationChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, {key: "", value: ""}]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      const newSpecifications = specifications.filter((_, i) => i !== index);
      setSpecifications(newSpecifications);
    }
  };

  const handlePolicyChange = (index: number, value: string) => {
    const newPolicies = [...policies];
    newPolicies[index] = value;
    setPolicies(newPolicies);
  };

  const addPolicy = () => {
    setPolicies([...policies, ""]);
  };

  const removePolicy = (index: number) => {
    if (policies.length > 1) {
      const newPolicies = policies.filter((_, i) => i !== index);
      setPolicies(newPolicies);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare product data
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        rating: parseFloat(formData.rating) || 4.5,
        image: formData.image,
        description: formData.description,
        tax: parseFloat(formData.tax) || 0,
        shippingCharges: parseFloat(formData.shippingCharges) || 0,
        offer: {
          isActive: formData.offer.isActive,
          discountPercentage: parseFloat(formData.offer.discountPercentage) || 0,
        },
        specifications: specifications.reduce((acc, spec) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {} as Record<string, string>),
        policies: policies.filter(policy => policy.trim() !== ""),
        sales: 0,
        createdAt: new Date(),
      };

      // Add product to Firestore via backend API
      await firebaseAPI.addDocument("products", productData);
      
      // Show success message and navigate back to admin
      alert("Product added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </button>
              <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white"
                    >
                      <option value="" className="bg-gray-700">Select category</option>
                      <option value="Sensors" className="bg-gray-700">Sensors</option>
                      <option value="Microcontrollers" className="bg-gray-700">Microcontrollers</option>
                      <option value="Modules" className="bg-gray-700">Modules</option>
                      <option value="Components" className="bg-gray-700">Components</option>
                      <option value="Tools" className="bg-gray-700">Tools</option>
                      <option value="Kits" className="bg-gray-700">Kits</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white"
                    >
                      <option value="5" className="bg-gray-700">5.0</option>
                      <option value="4.5" className="bg-gray-700">4.5</option>
                      <option value="4" className="bg-gray-700">4.0</option>
                      <option value="3.5" className="bg-gray-700">3.5</option>
                      <option value="3" className="bg-gray-700">3.0</option>
                      <option value="2.5" className="bg-gray-700">2.5</option>
                      <option value="2" className="bg-gray-700">2.0</option>
                      <option value="1.5" className="bg-gray-700">1.5</option>
                      <option value="1" className="bg-gray-700">1.0</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Images</h2>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Main Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Pricing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Tax (%)
                    </label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Shipping Charges (₹)
                    </label>
                    <input
                      type="number"
                      name="shippingCharges"
                      value={formData.shippingCharges}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Offer */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="offer.isActive"
                      checked={formData.offer.isActive}
                      onChange={handleInputChange}
                      className="rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent w-5 h-5"
                    />
                    <label className="text-white font-semibold">
                      Active Offer
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="offer.discountPercentage"
                      value={formData.offer.discountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Specifications</h2>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="flex items-center gap-2 bg-accent text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Specification
                  </button>
                </div>
                
                <div className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                        placeholder="Specification name (e.g., Voltage)"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                        placeholder="Value (e.g., 5V)"
                      />
                      {specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Policies</h2>
                  <button
                    type="button"
                    onClick={addPolicy}
                    className="flex items-center gap-2 bg-accent text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Policy
                  </button>
                </div>
                
                <div className="space-y-4">
                  {policies.map((policy, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={policy}
                        onChange={(e) => handlePolicyChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                        placeholder="Enter policy (e.g., 30-day return policy)"
                      />
                      {policies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePolicy(index)}
                          className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 py-3 px-6 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-accent text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}