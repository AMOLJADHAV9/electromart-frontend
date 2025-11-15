import Layout from "@/components/Layout";
import {
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Grid,
  Truck,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { firebaseAPI } from "@/lib/api";
import React from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  sales: number;
  image?: string;
  images?: string[]; // Add multiple images support
  specifications?: Record<string, string>; // Add specifications field
  policies?: string[]; // Add policies field
  tax?: number; // Add tax field
  shippingCharges?: number; // Add shipping charges field
  offer?: {
    isActive: boolean;
    discountPercentage: number;
  }; // Add offer field
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleType?: string;
  licenseNumber?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  calculatedOrders?: number; // Actual count from orders
  calculatedTotalSpent?: number; // Actual sum from paid orders
  role?: "user" | "admin" | "delivery"; // Add role property
}

interface DeliveryAddress {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  zipCode?: string;
  state?: string;
  email?: string;
}

interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  deliveryAddress?: DeliveryAddress;
  statusTimeline?: Array<{
    status: string;
    timestamp: any;
  }>;
  createdAt: any;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Admin() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    rating: 4.5,
    sales: 0,
    image: "",
    images: [],
    specifications: {},
    policies: [],
    tax: 0,
    shippingCharges: 0,
    offer: {
      isActive: false,
      discountPercentage: 0,
    },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await firebaseAPI.getCollection("products");
        
        if (productsResponse.success) {
          const productsData = productsResponse.data.map((productData: any) => ({
            id: productData.id,
            name: productData.name,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            rating: productData.rating || 4.5,
            sales: productData.sales || 0,
            image: productData.image,
            images: productData.images,
            specifications: productData.specifications,
            policies: productData.policies,
            tax: productData.tax,
            shippingCharges: productData.shippingCharges,
            offer: productData.offer,
          }));
          
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await firebaseAPI.getCollection("users");
        
        if (usersResponse.success) {
          const usersData = usersResponse.data.map((userData: any) => ({
            id: userData.id,
            name: userData.displayName || userData.name || "Unknown User",
            email: userData.email,
            phone: userData.phone || "",
            vehicleType: userData.vehicleType || "",
            licenseNumber: userData.licenseNumber || "",
            joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A",
            totalOrders: userData.totalOrders || 0,
            totalSpent: userData.totalSpent || 0,
            calculatedOrders: 0, // Will be calculated from orders
            calculatedTotalSpent: 0, // Will be calculated from orders
            role: userData.role || "user"
          }));
          
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate order count and total spent for each customer from actual orders
  useEffect(() => {
    if (users.length > 0 && orders.length > 0) {
      const updatedUsers = users.map(user => {
        // Filter orders for this customer that are paid
        const customerOrders = orders.filter(
          order => order.userId === user.id && order.paymentStatus === "PAID"
        );
        
        // Calculate total spent from paid orders (sum of totalAmount)
        const totalSpent = customerOrders.reduce((sum, order) => {
          return sum + (order.totalAmount || 0);
        }, 0);
        
        // Count of paid orders
        const orderCount = customerOrders.length;
        
        return {
          ...user,
          calculatedOrders: orderCount,
          calculatedTotalSpent: totalSpent,
        };
      });
      
      setUsers(updatedUsers);
    }
  }, [orders, users.length]); // Recalculate when orders change or users are loaded

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await firebaseAPI.getCollection("orders");
        
        if (ordersResponse.success) {
          const ordersData = ordersResponse.data.map((orderData: any) => ({
            id: orderData.id,
            userId: orderData.userId || '',
            products: orderData.products || [],
            totalAmount: orderData.totalAmount || 0,
            paymentStatus: orderData.paymentStatus || 'PENDING',
            orderStatus: orderData.orderStatus || 'ORDER_PLACED',
            deliveryAddress: orderData.deliveryAddress || null,
            statusTimeline: orderData.statusTimeline || [],
            createdAt: orderData.createdAt,
          }));
          
          setOrders(ordersData);
          
          // Generate sales data based on orders
          generateSalesData(ordersData);
          
          // Generate revenue by category data
          generateCategoryData(ordersData);
          
          // Generate monthly revenue data
          generateRevenueData(ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [products]);

  // Generate sales data for the chart - only include paid orders
  const generateSalesData = (ordersData: Order[]) => {
    // Filter only paid orders
    const paidOrders = ordersData.filter(order => order.paymentStatus === "PAID");
    
    // Group orders by date
    const salesByDate: Record<string, { orders: number; revenue: number }> = {};
    
    paidOrders.forEach(order => {
      if (order.createdAt && order.totalAmount) {
        let dateStr: string;
        if (order.createdAt.toDate) {
          dateStr = order.createdAt.toDate().toISOString().split('T')[0];
        } else {
          dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        }
        
        if (!salesByDate[dateStr]) {
          salesByDate[dateStr] = { orders: 0, revenue: 0 };
        }
        
        salesByDate[dateStr].orders += 1;
        salesByDate[dateStr].revenue += order.totalAmount;
      }
    });
    
    // Convert to array format for chart
    const salesChartData = Object.entries(salesByDate)
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: Math.round(data.revenue * 100) / 100 // Round to 2 decimal places
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setSalesData(salesChartData);
  };

  // Generate revenue by category data - only include paid orders
  const generateCategoryData = (ordersData: Order[]) => {
    // Filter only paid orders
    const paidOrders = ordersData.filter(order => order.paymentStatus === "PAID");
    
    // Create a map of product ID to category
    const productCategoryMap: Record<string, string> = {};
    products.forEach(product => {
      productCategoryMap[product.id] = product.category;
    });
    
    // Calculate revenue by category
    const revenueByCategory: Record<string, number> = {};
    
    paidOrders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(product => {
          const category = productCategoryMap[product.productId] || "Unknown";
          
          if (!revenueByCategory[category]) {
            revenueByCategory[category] = 0;
          }
          
          // Use the actual product price and quantity from the order
          revenueByCategory[category] += (product.price * product.quantity);
        });
      }
    });
    
    // Convert to array format for chart
    const categoryChartData = Object.entries(revenueByCategory)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100 // Round to 2 decimal places
      }))
      .filter(item => item.value > 0) // Only show categories with revenue
      .sort((a, b) => b.value - a.value); // Sort by revenue descending
    
    setCategoryData(categoryChartData);
  };

  // Generate monthly revenue data - only include paid orders
  const generateRevenueData = (ordersData: Order[]) => {
    // Filter only paid orders
    const paidOrders = ordersData.filter(order => order.paymentStatus === "PAID");
    
    // Group orders by month
    const revenueByMonth: Record<string, number> = {};
    
    paidOrders.forEach(order => {
      if (order.createdAt && order.totalAmount) {
        let date: Date;
        if (order.createdAt.toDate) {
          date = order.createdAt.toDate();
        } else {
          date = new Date(order.createdAt);
        }
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        
        if (!revenueByMonth[monthKey]) {
          revenueByMonth[monthKey] = 0;
        }
        
        revenueByMonth[monthKey] += order.totalAmount;
      }
    });
    
    // Convert to array format for chart
    const monthlyRevenueData = Object.entries(revenueByMonth)
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          month: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          revenue: Math.round(value * 100) / 100
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
    
    setRevenueData(monthlyRevenueData);
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Get the current order to access its status timeline
      const currentOrder = orders.find(o => o.id === orderId);
      
      // Create status timeline entry with a regular Date object
      const statusTimelineEntry = {
        status: newStatus,
        timestamp: new Date()
      };
      
      // Update the order document
      await firebaseAPI.updateDocument("orders", orderId, {
        orderStatus: newStatus,
        statusTimeline: [...(currentOrder?.statusTimeline || []), statusTimelineEntry]
      });
      
      // Hide the dropdown after updating
      setShowStatusDropdown(null);
      
      // Show success message
      alert(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: "user" | "admin" | "delivery") => {
    try {
      await firebaseAPI.updateDocument("users", userId, {
        role: newRole
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  // Redirect if not admin or not logged in
  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "admin")) {
      navigate("/admin-login");
    }
  }, [currentUser, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  // If not admin, don't render anything (redirect will happen)
  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  // Calculate statistics from database
  // Total Revenue: Sum of all paid orders
  const totalRevenue = orders
    .filter(order => order.paymentStatus === "PAID")
    .reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);
  
  // Total Orders (only paid orders)
  const totalOrders = orders.filter(order => order.paymentStatus === "PAID").length;
  
  // Today's Revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRevenue = orders
    .filter(order => {
      if (order.paymentStatus !== "PAID") return false;
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    })
    .reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);
  
  // This Month's Revenue
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthRevenue = orders
    .filter(order => {
      if (order.paymentStatus !== "PAID") return false;
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= thisMonthStart;
    })
    .reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);
  
  const totalProducts = products.length;
  const totalCustomers = users.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Admin Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Welcome, Admin</span>
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-accent text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                >
                  View Site
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-400 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">From {totalOrders} paid orders</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Today's Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{todayRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Paid orders today</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-400 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">This Month</p>
                  <p className="text-2xl font-bold text-white">₹{thisMonthRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Current month revenue</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Products</p>
                  <p className="text-2xl font-bold text-white">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-white">{totalCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart */}
            {revenueData.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Monthly Revenue Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#888"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#888"
                        label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151',
                          borderRadius: '0.5rem',
                          color: '#fff'
                        }}
                        formatter={(value: any) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Revenue']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        fill="#00C49F"
                        radius={[8, 8, 0, 0]}
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Sales & Revenue Overview</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis 
                      stroke="#888"
                      yAxisId="left"
                      label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                    />
                    <YAxis 
                      stroke="#888"
                      yAxisId="right"
                      orientation="right"
                      label={{ value: 'Revenue (₹)', angle: 90, position: 'insideRight', style: { fill: '#888' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#374151',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') {
                          return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Revenue'];
                        }
                        return [value, 'Orders'];
                      }}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString('en-IN')}`}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Orders"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#00C49F" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Revenue by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#374151',
                        borderRadius: '0.5rem',
                      }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
            <div className="border-b border-gray-700">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "dashboard"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "products"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "orders"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("customers")}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "customers"
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Customers
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "dashboard" && (
                <div>
                  <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-white mb-4">Delivery Management</h3>
                    <p className="text-gray-400 mb-4">Register new delivery boys for your e-commerce platform</p>
                    <Link 
                      to="/admin/register-delivery-boy"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Register New Delivery Boy
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "products" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Product Management</h2>
                    <button
                      onClick={() => {
                        navigate("/admin/add-product");
                      }}
                      className="flex items-center gap-2 bg-accent text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                      Add Product
                    </button>
                  </div>

                  {/* Product List */}
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                      <thead className="bg-gray-700 text-white">
                        <tr>
                          <th className="px-6 py-4 font-bold">Product</th>
                          <th className="px-6 py-4 font-bold">Category</th>
                          <th className="px-6 py-4 font-bold">Price</th>
                          <th className="px-6 py-4 font-bold">Stock</th>
                          <th className="px-6 py-4 font-bold">Rating</th>
                          <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image || "https://placehold.co/40"}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">₹{product.price}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <span>{product.rating}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(product.id);
                                    setFormData(product);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this product?")) {
                                      firebaseAPI.deleteDocument("products", product.id);
                                    }
                                  }}
                                  className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Order Management</h2>
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                      <thead className="bg-gray-700 text-white">
                        <tr>
                          <th className="px-6 py-4 font-bold">Order ID</th>
                          <th className="px-6 py-4 font-bold">Date</th>
                          <th className="px-6 py-4 font-bold">Customer Address</th>
                          <th className="px-6 py-4 font-bold">Amount</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                          <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold">#{order.id.slice(0, 8)}</td>
                            <td className="px-6 py-4">
                              {order.createdAt ? 
                                (order.createdAt.toDate ? 
                                  order.createdAt.toDate().toLocaleDateString() : 
                                  new Date(order.createdAt).toLocaleDateString()) : 
                                'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              {order.deliveryAddress ? (
                                <div className="max-w-xs">
                                  <div className="text-white font-medium mb-1">
                                    {order.deliveryAddress.name || 'N/A'}
                                  </div>
                                  <div className="text-gray-400 text-sm space-y-0.5">
                                    {order.deliveryAddress.phone && (
                                      <div className="flex items-center gap-1">
                                        <span>📞</span>
                                        <span>{order.deliveryAddress.phone}</span>
                                      </div>
                                    )}
                                    {order.deliveryAddress.email && (
                                      <div className="flex items-center gap-1">
                                        <span>✉️</span>
                                        <span className="truncate">{order.deliveryAddress.email}</span>
                                      </div>
                                    )}
                                    {order.deliveryAddress.address && (
                                      <div className="line-clamp-2">{order.deliveryAddress.address}</div>
                                    )}
                                    <div>
                                      {[
                                        order.deliveryAddress.city,
                                        order.deliveryAddress.state,
                                        order.deliveryAddress.pincode || order.deliveryAddress.zipCode
                                      ].filter(Boolean).join(', ')}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500 italic">No address available</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              ₹{order.totalAmount ? order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === "DELIVERED" 
                                  ? "bg-green-900/30 text-green-400"
                                  : order.orderStatus === "PROCESSING"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-blue-900/30 text-blue-400"
                              }`}>
                                {order.orderStatus ? order.orderStatus.replace(/_/g, ' ') : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 relative">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                <div className="relative">
                                  <button
                                    onClick={() => setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id)}
                                    className="px-3 py-2 bg-accent text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors text-sm"
                                  >
                                    Update Status
                                  </button>
                                  
                                  {showStatusDropdown === order.id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                      <div className="py-1">
                                        {["ORDER_PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].map((status) => (
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
                </div>
              )}

              {activeTab === "customers" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Customer Management</h2>
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                      <thead className="bg-gray-700 text-white">
                        <tr>
                          <th className="px-6 py-4 font-bold">Name</th>
                          <th className="px-6 py-4 font-bold">Email</th>
                          <th className="px-6 py-4 font-bold">Join Date</th>
                          <th className="px-6 py-4 font-bold">Orders</th>
                          <th className="px-6 py-4 font-bold">Total Spent</th>
                          <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm">{user.email}</td>
                            <td className="px-6 py-4">{user.joinDate}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-lg">
                                  {user.calculatedOrders !== undefined ? user.calculatedOrders : user.totalOrders}
                                </span>
                                {user.calculatedOrders !== undefined && user.calculatedOrders !== user.totalOrders && (
                                  <span className="text-xs text-gray-500 mt-0.5">
                                    DB shows: {user.totalOrders}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-lg">
                                  ₹{(user.calculatedTotalSpent !== undefined ? user.calculatedTotalSpent : user.totalSpent).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </span>
                                {user.calculatedTotalSpent !== undefined && Math.abs(user.calculatedTotalSpent - user.totalSpent) > 0.01 && (
                                  <span className="text-xs text-gray-500 mt-0.5">
                                    DB shows: ₹{user.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                      <thead className="bg-gray-700 text-white">
                        <tr>
                          <th className="px-6 py-4 font-bold">User ID</th>
                          <th className="px-6 py-4 font-bold">Name</th>
                          <th className="px-6 py-4 font-bold">Email</th>
                          <th className="px-6 py-4 font-bold">Phone</th>
                          <th className="px-6 py-4 font-bold">Join Date</th>
                          <th className="px-6 py-4 font-bold">Orders</th>
                          <th className="px-6 py-4 font-bold">Total Spent</th>
                          <th className="px-6 py-4 font-bold">Role</th>
                          <th className="px-6 py-4 font-bold">Vehicle/License</th>
                          <th className="px-6 py-4 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono text-sm">#{user.id.slice(0, 8)}</td>
                            <td className="px-6 py-4 font-semibold">{user.name}</td>
                            <td className="px-6 py-4 break-all max-w-xs">{user.email}</td>
                            <td className="px-6 py-4">{user.phone || "N/A"}</td>
                            <td className="px-6 py-4">{user.joinDate}</td>
                            <td className="px-6 py-4">{user.calculatedOrders || user.totalOrders}</td>
                            <td className="px-6 py-4">
                              ₹{((user.calculatedTotalSpent || user.totalSpent) / 100).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin" 
                                  ? "bg-purple-900/30 text-purple-400"
                                  : user.role === "delivery"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-green-900/30 text-green-400"
                              }`}>
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {user.role === "delivery" ? (
                                <div>
                                  <div className="text-sm">{user.vehicleType || "N/A"}</div>
                                  <div className="text-xs text-gray-400">{user.licenseNumber || "No License"}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <select
                                  value={user.role || "user"}
                                  onChange={(e) => updateUserRole(user.id, e.target.value as "user" | "admin" | "delivery")}
                                  className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                  <option value="delivery">Delivery</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}