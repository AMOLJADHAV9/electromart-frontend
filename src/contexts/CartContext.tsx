import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { loadRazorpay, processPayment } from "@/lib/razorpay";
import { useAuth } from "@/hooks/useAuth";
import { firebaseAPI, razorpayAPI } from "@/lib/api";

const isDev = import.meta.env.DEV;

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shippingCharges?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (deliveryAddress: any, customerInfo: any) => Promise<any>;
  shippingCharges: number;
  finalTotalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload };
    
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          { ...action.payload, id: Date.now().toString() },
        ];
      }
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }
    
    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }
    
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }
    
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Create a wrapper component that uses useAuth
const CartProviderWithAuth = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { currentUser } = useAuth();

  const addToCart = async (item: Omit<CartItem, "id">) => {
    // Fetch product details to get accurate price with tax and offers
    try {
      const productResponse = await firebaseAPI.getDocument("products", item.productId);
      if (productResponse.success && productResponse.data) {
        const productData = productResponse.data;
        
        // Use the price as is if it already includes tax
        // Otherwise calculate price with tax and offers
        let price = productData.price;
        
        // Only apply offer discount if active
        if (productData.offer?.isActive) {
          price = Math.round(price * (1 - (productData.offer.discountPercentage / 100)));
        }
        
        // Get shipping charges from product data (default to 0 if not set)
        const shippingCharges = productData.shippingCharges || 0;
        
        // Update the item with the calculated price and shipping charges
        // Note: Assuming product prices already include tax, so no additional tax calculation
        const updatedItem = { ...item, price, shippingCharges };
        dispatch({ type: "ADD_TO_CART", payload: updatedItem });
      } else {
        // If product not found, add with original price and no shipping charges
        const updatedItem = { ...item, shippingCharges: 0 };
        dispatch({ type: "ADD_TO_CART", payload: updatedItem });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      // If there's an error, add with original price and no shipping charges
      const updatedItem = { ...item, shippingCharges: 0 };
      dispatch({ type: "ADD_TO_CART", payload: updatedItem });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const checkout = async (deliveryAddress: any, customerInfo: any) => {
    if (state.items.length === 0) return;
    
    // Check if user is authenticated
    if (!currentUser) {
      throw new Error("User must be logged in to place an order");
    }
    
    try {
      if (isDev) {
        console.log("Starting checkout process for user:", currentUser.uid);
      }
      
      // Load Razorpay SDK
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection and try again.");
      }
      
      // The total amount is already calculated correctly in the state
      // Include shipping charges in the total amount
      let totalAmount = state.totalAmount;
      
      // Calculate shipping charges based on products in cart
      let shippingCharges = 0;
      for (const item of state.items) {
        // Add product-specific shipping charges if available, otherwise 0
        shippingCharges += item.shippingCharges || 0;
      }
      
      totalAmount += shippingCharges;
      
      // Convert to paise (smallest currency unit) for Razorpay
      const amountInPaise = Math.round(totalAmount * 100);
      
      // Validate amount before proceeding
      if (amountInPaise <= 0) {
        throw new Error("Order amount must be greater than zero.");
      }
      
      if (isDev) {
        console.log("Creating Razorpay order for amount:", amountInPaise);
      }
      
      // Create Razorpay order via backend API
      let razorpayOrder;
      try {
        razorpayOrder = await razorpayAPI.createOrder(amountInPaise);
        if (isDev) {
          console.log("Razorpay order created:", razorpayOrder);
        }
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new Error("Failed to create Razorpay order. Please try again.");
      }
      
      const orderData = razorpayOrder?.data ?? razorpayOrder?.order ?? razorpayOrder;
      const normalizedOrder = orderData
        ? {
            orderId: orderData.orderId || orderData.id || orderData.order_id,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
          }
        : null;

      if (!razorpayOrder?.success || !normalizedOrder?.orderId) {
        console.error("Invalid Razorpay order response:", razorpayOrder);
        throw new Error("Failed to create Razorpay order. Please try again.");
      }

      if (isDev) {
        console.log("Processing payment with order ID:", normalizedOrder.orderId);
      }
      
      // Process payment
      const paymentResponse = await processPayment(normalizedOrder, {
        name: "ElectroMart",
        description: `Order for ${state.totalItems} items`,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerContact: customerInfo.phone,
      });
      
      if (isDev) {
        console.log("Payment response received:", paymentResponse);
      }
      
      // If payment is successful, create order in Firestore via backend API
      if (paymentResponse) {
        if (isDev) {
          console.log("Payment successful, creating order in Firestore");
        }
        
        // Create order in Firestore with the new structure
        // Save amounts in rupees (not paise)
        const order = {
          userId: currentUser.uid,
          products: state.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || ""
          })),
          totalAmount: totalAmount, // Save in rupees
          shippingCharges: shippingCharges, // Save in rupees
          paymentId: (paymentResponse as any).razorpay_payment_id,
          paymentStatus: "PAID",
          deliveryAddress: deliveryAddress,
          orderStatus: "ORDER_PLACED",
          statusTimeline: [
            { 
              status: "ORDER_PLACED", 
              timestamp: new Date() 
            }
          ],
          createdAt: new Date().toISOString(),
        };
      
        if (isDev) {
          console.log("Order data to be saved:", order);
        }
    
        const orderResponse = await firebaseAPI.addDocument("orders", order);
        if (isDev) {
          console.log("Order created successfully with ID:", orderResponse.data?.id);
        }
    
        // Clear cart after successful checkout
        dispatch({ type: "CLEAR_CART" });
    
        return paymentResponse;
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      // Re-throw the error with a more user-friendly message if needed
      if (error.message && error.message.includes("Failed to create order")) {
        throw new Error("Payment service is currently unavailable. Please try again later or contact support.");
      }
      throw error;
    }
  };

  // Calculate shipping charges based on products in cart
  let shippingCharges = 0;
  for (const item of state.items) {
    // Add product-specific shipping charges if available, otherwise 0
    shippingCharges += item.shippingCharges || 0;
  }
  
  const finalTotalAmount = state.totalAmount + shippingCharges;
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        shippingCharges,
        finalTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export the original CartProvider name for backward compatibility
export const CartProvider = CartProviderWithAuth;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};