import { API_BASE_URL } from "./api";

// Razorpay service for handling payments
declare global {
  interface Window {
    Razorpay: any;
  }
}

const isDev = import.meta.env.DEV;
const debugLog = (...args: unknown[]) => {
  if (isDev) {
    console.log("[Razorpay]", ...args);
  }
};

// Load Razorpay SDK
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order by calling backend API
export const createRazorpayOrder = async (amount: number, currency: string = "INR") => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || "Failed to create order"}`);
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to create order");
    }

    return data.data ?? data.order ?? data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

// Verify payment by calling backend API
export const verifyPayment = async (paymentData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Process payment
export const processPayment = async (
  order: any,
  paymentOptions: {
    name: string;
    description: string;
    customerName: string;
    customerEmail: string;
    customerContact: string;
  }
) => {
  return new Promise((resolve, reject) => {
    debugLog("Starting payment process for order:", order?.orderId);

    if (!order?.orderId) {
      reject(new Error("Missing order ID in order object"));
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      reject(new Error("Razorpay key is not configured. Please set VITE_RAZORPAY_KEY_ID."));
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: paymentOptions.name,
      description: paymentOptions.description,
      order_id: order.orderId,
      handler: async function (response: any) {
        try {
          if (!response) {
            reject(new Error("Empty response from Razorpay"));
            return;
          }

          const razorpay_order_id = response.razorpay_order_id || response.order_id || order.orderId;
          const razorpay_payment_id = response.razorpay_payment_id || response.payment_id;
          const razorpay_signature = response.razorpay_signature || response.signature;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            reject(new Error("Missing required fields for payment verification"));
            return;
          }

          debugLog("Verifying payment for:", { razorpay_order_id, razorpay_payment_id });

          const verification = await verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

          if (verification.success) {
            resolve(response);
          } else {
            reject(new Error(verification.message || "Payment verification failed"));
          }
        } catch (error) {
          reject(error);
        }
      },
      prefill: {
        name: paymentOptions.customerName,
        email: paymentOptions.customerEmail,
        contact: paymentOptions.customerContact,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      reject(new Error(response.error?.description || "Payment failed"));
    });
    rzp.open();
  });
};
