import Layout from "@/components/Layout";
import {
  Package,
  Truck,
  Home,
  CheckCircle,
  Clock,
  MapPin,
  User,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, logout } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { firebaseAPI } from "@/lib/api";
import React from "react";

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}

interface StatusTimeline {
  status: string;
  timestamp: any;
}

interface Order {
  id: string;
  userId: string;
  products: Product[];
  totalAmount: number;
  paymentId: string;
  paymentStatus: string;
  deliveryAddress: DeliveryAddress;
  orderStatus: string;
  statusTimeline: StatusTimeline[];
  createdAt: any;
}

// Order status options for delivery boy
const DELIVERY_STATUSES = [
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

// Status display names and icons
const STATUS_CONFIG: Record<string, { displayName: string; icon: React.ElementType; color: string }> = {
  "CONFIRMED": { 
    displayName: "Confirmed", 
    icon: CheckCircle, 
    color: "bg-green-500" 
  },
  "PACKED": { 
    displayName: "Packed", 
    icon: Package, 
    color: "bg-yellow-500" 
  },
  "SHIPPED": { 
    displayName: "Shipped", 
    icon: Truck, 
    color: "bg-purple-500" 
  },
  "OUT_FOR_DELIVERY": { 
    displayName: "Out for Delivery", 
    icon: Home, 
    color: "bg-indigo-500" 
  },
  "DELIVERED": { 
    displayName: "Delivered", 
    icon: CheckCircle, 
    color: "bg-green-500" 
  }
};

export default function DeliveryBoy() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  // Redirect if not delivery boy or not logged in
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== "delivery")) {
      navigate("/delivery-boy-login");
    }
  }, [currentUser, authLoading, navigate]);

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch all orders
        const ordersResponse = await firebaseAPI.getCollection("orders");
        
        if (ordersResponse.success) {
          // Filter orders to only show SHIPPED, OUT_FOR_DELIVERY, and DELIVERED orders
          const deliveryOrders = ordersResponse.data
            .filter((orderData: any) => 
              ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(orderData.orderStatus)
            )
            .map((orderData: any) => ({
              id: orderData.id,
              userId: orderData.userId || '',
              products: orderData.products || [],
              totalAmount: orderData.totalAmount || 0,
              paymentId: orderData.paymentId || '',
              paymentStatus: orderData.paymentStatus || 'PENDING',
              deliveryAddress: orderData.deliveryAddress || null,
              orderStatus: orderData.orderStatus || 'SHIPPED',
              statusTimeline: orderData.statusTimeline || [],
              createdAt: orderData.createdAt,
            }));
          
          setOrders(deliveryOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === "delivery") {
      fetchOrders();
    }
  }, [currentUser]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Get the current order to access its status timeline
      const currentOrder = orders.find(o => o.id === orderId);
      
      if (!currentOrder) {
        throw new Error("Order not found");
      }
      
      // Create status timeline entry
      const statusTimelineEntry = {
        status: newStatus,
        timestamp: new Date()
      };
      
      // Update the order document
      await firebaseAPI.updateDocument("orders", orderId, {
        orderStatus: newStatus,
        statusTimeline: [...(currentOrder.statusTimeline || []), statusTimelineEntry]
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              orderStatus: newStatus,
              statusTimeline: [...(order.statusTimeline || []), statusTimelineEntry]
            } 
          : order
      ));
      
      // Hide the dropdown after updating
      setShowStatusDropdown(null);
      
      // Show success message
      alert(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      alert(`Failed to update order status: ${error.message || "Please try again."}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/delivery-boy-login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  // Format date
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    
    if (date.toDate) {
      return date.toDate().toLocaleDateString() + " " + date.toDate().toLocaleTimeString();
    }
    
    return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  // If not delivery boy, don't render anything (redirect will happen)
  if (!currentUser || currentUser.role !== "delivery") {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Delivery Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Manage your delivery orders and update their status
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Delivery Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Out for Delivery</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {orders.filter(o => o.orderStatus === "OUT_FOR_DELIVERY").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Delivered</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {orders.filter(o => o.orderStatus === "DELIVERED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Delivery Orders</h2>
              <p className="text-gray-400 text-sm mt-1">
                Orders ready for delivery (Shipped, Out for Delivery, Delivered)
              </p>
            </div>
            
            {error ? (
              <div className="p-6">
                <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                  <p className="text-red-300 text-center">{error}</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No delivery orders</h3>
                <p className="text-gray-400">
                  There are currently no orders ready for delivery.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 text-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                      <th className="px-6 py-3 text-left font-semibold">Customer</th>
                      <th className="px-6 py-3 text-left font-semibold">Address</th>
                      <th className="px-6 py-3 text-left font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Date</th>
                      <th className="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-white">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-300" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {order.deliveryAddress?.name || "N/A"}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {order.deliveryAddress?.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm">
                                {order.deliveryAddress?.address || "N/A"}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {order.deliveryAddress?.city || "N/A"}, {order.deliveryAddress?.pincode || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">
                            ₹{(order.totalAmount ).toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === "DELIVERED" 
                              ? "bg-green-900/30 text-green-400"
                              : order.orderStatus === "OUT_FOR_DELIVERY"
                              ? "bg-indigo-900/30 text-indigo-400"
                              : order.orderStatus === "SHIPPED"
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-gray-900/30 text-gray-400"
                          }`}>
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 relative">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <button
                                onClick={() => setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id)}
                                className="px-3 py-2 bg-accent text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors text-sm"
                                disabled={!["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.orderStatus)}
                              >
                                Update Status
                              </button>
                              
                              {showStatusDropdown === order.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                  <div className="py-1">
                                    {["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"]
                                      .filter(status => 
                                        ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.orderStatus) && 
                                        ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].indexOf(status) > ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].indexOf(order.orderStatus)
                                      )
                                      .map((status) => (
                                        <button
                                          key={status}
                                          onClick={() => updateOrderStatus(order.id, status)}
                                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                                            order.orderStatus === status 
                                              ? "text-accent font-medium" 
                                              : "text-gray-300"
                                          }`}
                                        >
                                          {status.replace(/_/g, ' ')}
                                        </button>
                                      ))}
                                    {/* Add a reset option for delivered orders */}
                                    {order.orderStatus === "DELIVERED" && (
                                      <button
                                        onClick={() => updateOrderStatus(order.id, "OUT_FOR_DELIVERY")}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-gray-300"
                                      >
                                        Reset to Out for Delivery
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}