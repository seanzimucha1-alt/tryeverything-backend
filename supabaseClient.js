import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// API Base URL: Use Vercel URL in production
// Set VERCEL_URL environment variable in Vercel dashboard after deployment
const getApiBaseUrl = () => {
  // In production (Vercel), use the Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for API URL from environment (set in app.json or .env)
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  // During development, return a placeholder - actual API calls will use mock data
  return 'http://localhost:3000'; // Local development default
};

export const API_BASE_URL = getApiBaseUrl();

const supabaseUrl = 'https://afgnyavcxsvmwpaqxbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ255YXZjeHN2bXdwYXhxYm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjg5ODMsImV4cCI6MjA4Mzk0NDk4M30.172TemagW0zJg8A02whzm1ZdIySwlchXWvBNw2yxfLU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const auth = {
    // Sign up new user
    signUp: async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        return { data, error };
    },

    // Sign in existing user
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Listen to auth state changes
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Database helper functions
export const db = {
    // Products
    getProducts: async () => {
        const { data, error } = await supabase.from('products').select('*');
        return { data, error };
    },

    // Orders
    getUserOrders: async (userId) => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', userId);
        return { data, error };
    },

    createOrder: async (orderData) => {
        const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select();
        return { data, error };
    },

    // Deliveries
    getAvailableDeliveries: async () => {
        const { data, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('status', 'available');
        return { data, error };
    },

    acceptDelivery: async (deliveryId, delivererId) => {
        const { error } = await supabase
            .from('deliveries')
            .update({
                deliverer_id: delivererId,
                status: 'accepted'
            })
            .eq('id', deliveryId);
        return { error };
    }
};

export default supabase;