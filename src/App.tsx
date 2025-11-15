import "./global.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import DeliveryBoyLogin from "./pages/DeliveryBoyLogin";
import DeliveryBoy from "./pages/DeliveryBoy";
import DeliveryBoyRegister from "./pages/DeliveryBoyRegister";

// Protected Route Components
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: "user" | "admin" | "delivery" }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Redirect to appropriate login page based on required role
    return <Navigate to={requiredRole === "admin" ? "/admin-login" : requiredRole === "delivery" ? "/delivery-boy-login" : "/login"} replace />;
  }

  // If no specific role is required, allow access
  if (!requiredRole) {
    return children;
  }

  // Check if user has the required role
  if (currentUser.role !== requiredRole) {
    // Redirect to appropriate dashboard
    return <Navigate to={requiredRole === "admin" ? "/admin-login" : requiredRole === "delivery" ? "/delivery-boy-login" : "/"} replace />;
  }

  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

const UserRoute = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>
);

const DeliveryBoyRoute = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute requiredRole="delivery">{children}</ProtectedRoute>
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/delivery-boy-login" element={<DeliveryBoyLogin />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/add-product" 
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/register-delivery-boy" 
                element={
                  <AdminRoute>
                    <DeliveryBoyRegister />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/delivery-boy" 
                element={
                  <DeliveryBoyRoute>
                    <DeliveryBoy />
                  </DeliveryBoyRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <UserRoute>
                    <Orders />
                  </UserRoute>
                } 
              />
              <Route 
                path="/orders/:orderId" 
                element={
                  <UserRoute>
                    <OrderDetails />
                  </UserRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}