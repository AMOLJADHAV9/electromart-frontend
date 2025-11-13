// API service for handling all backend communications
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

// Generic fetch helper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Firebase API functions
export const firebaseAPI = {
  // Get a document by ID
  getDocument: async (collectionName: string, docId: string) => {
    return apiFetch(`/firebase/${collectionName}/${docId}`);
  },

  // Get all documents in a collection
  getCollection: async (collectionName: string, queryParams?: Record<string, string>) => {
    // Build query string if queryParams are provided
    const queryString = queryParams
      ? `?${new URLSearchParams(queryParams).toString()}`
      : '';
    return apiFetch(`/firebase/${collectionName}${queryString}`);
  },

  // Add a new document to a collection
  addDocument: async (collectionName: string, data: any) => {
    return apiFetch(`/firebase/${collectionName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a document
  updateDocument: async (collectionName: string, docId: string, data: any) => {
    return apiFetch(`/firebase/${collectionName}/${docId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a document
  deleteDocument: async (collectionName: string, docId: string) => {
    return apiFetch(`/firebase/${collectionName}/${docId}`, {
      method: 'DELETE',
    });
  },
};

// Cloudinary API functions
export const cloudinaryAPI = {
  // Upload an image
  uploadImage: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  },

  // Delete an image
  deleteImage: async (publicId: string) => {
    return apiFetch(`/cloudinary/delete/${publicId}`, {
      method: 'DELETE',
    });
  },

  // Get image details
  getImageDetails: async (publicId: string) => {
    return apiFetch(`/cloudinary/details/${publicId}`);
  },
};

// Razorpay API functions
export const razorpayAPI = {
  // Create a new order
  createOrder: async (amount: number, currency: string = 'INR', receipt?: string) => {
    return apiFetch(`/payment/create-order`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency, receipt }),
    });
  },

  // Verify payment
  verifyPayment: async (paymentData: any) => {
    return apiFetch(`/payment/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Get order details
  getOrderDetails: async (orderId: string) => {
    return apiFetch(`/payment/order/${orderId}`);
  },

  // Get payment details
  getPaymentDetails: async (paymentId: string) => {
    return apiFetch(`/payment/payment/${paymentId}`);
  },
};