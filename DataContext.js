import React, { createContext, useState, useContext } from 'react';
import { MOCK_PRODUCTS, MOCK_VIDEOS, MOCK_ORDERS, MOCK_TRANSACTIONS, MOCK_FINANCIAL_SUMMARY } from './mockData';
import * as Notifications from 'expo-notifications';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Initialize with mock data, but now it's mutable state
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [favorites, setFavorites] = useState(['101']); // Start with one favorite for demo
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [financialSummary, setFinancialSummary] = useState(MOCK_FINANCIAL_SUMMARY);
  const [storeDetails, setStoreDetails] = useState({ 
    isOpen: true,
    name: 'Sneaker World',
    address: '123 Samora Machel Ave',
    city: 'Harare'
  });
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Staff' },
  ]);
  // Simulate the currently logged-in user for permission checking
  const [loggedInUser, setLoggedInUser] = useState({
    id: '1', 
    name: 'John Doe', 
    role: 'Admin' // Can be changed to 'Staff' or 'Viewer' to test permissions
  });
  const [availableDeliveries, setAvailableDeliveries] = useState([
    { 
      id: 'd1', 
      orderId: '1005', 
      storeName: 'Sneaker World', 
      pickupAddress: '123 Samora Machel Ave', 
      dropoffAddress: '45 Borrowdale Rd', 
      earnings: '$8.50', 
      distance: '5.2 km', 
      itemsCount: 2,
      pickup: { latitude: -17.8216, longitude: 31.0492 },
      dropoff: { latitude: -17.7840, longitude: 31.0900 }
    },
    { 
      id: 'd2', 
      orderId: '1006', 
      storeName: 'Tech Zone', 
      pickupAddress: 'Shop 4, Westgate Mall', 
      dropoffAddress: '12 Jason Moyo Ave', 
      earnings: '$12.00', 
      distance: '8.1 km', 
      itemsCount: 1,
      pickup: { latitude: -17.7850, longitude: 30.9900 },
      dropoff: { latitude: -17.8300, longitude: 31.0500 }
    },
    { 
      id: 'd3', 
      orderId: '1007', 
      storeName: 'Fashion Hub', 
      pickupAddress: 'Avondale Shopping Ctr', 
      dropoffAddress: '88 Swan Dr', 
      earnings: '$6.00', 
      distance: '3.5 km', 
      itemsCount: 3,
      pickup: { latitude: -17.8050, longitude: 31.0330 },
      dropoff: { latitude: -17.7900, longitude: 31.0600 }
    },
  ]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([
    { id: 'h1', storeName: 'Pizza Place', earnings: '$5.50', date: 'Today', status: 'Completed' },
    { id: 'h2', storeName: 'Burger Joint', earnings: '$7.00', date: 'Yesterday', status: 'Completed' },
    { id: 'h3', storeName: 'Flower Shop', earnings: '$12.00', date: 'Oct 25', status: 'Completed' },
  ]);

  const addProduct = (product) => {
    const newProduct = { 
      ...product, 
      id: Date.now().toString(), 
      reviews: [] 
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const addToCart = (product, size = 'M') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
     setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateCartQuantity = (productId, size, change) => {
    setCart(prev => prev.map(item => {
        if (item.id === productId && item.size === size) {
            return { ...item, quantity: Math.max(1, item.quantity + change) };
        }
        return item;
    }));
  };

  const placeOrder = (deliveryDetails) => {
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$','')) * item.quantity), 0);
    const newOrder = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: `$${total.toFixed(2)}`,
        status: 'Processing',
        items: cart.map(i => i.name).join(', '),
        details: { ...deliveryDetails, items: [...cart] }
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const updateStoreDetails = (details) => {
    setStoreDetails(prev => ({ ...prev, ...details }));
  };

  const inviteMember = (member) => {
    setTeamMembers(prev => [...prev, { ...member, id: Date.now().toString() }]);
  };

  const acceptDelivery = (id) => {
    const delivery = availableDeliveries.find(item => item.id === id);
    if (delivery) {
      setAvailableDeliveries(prev => prev.filter(item => item.id !== id));
      setAcceptedDeliveries(prev => [...prev, { ...delivery, status: 'Accepted' }]);
    }
  };

  const completeDelivery = (id) => {
    const delivery = acceptedDeliveries.find(item => item.id === id);
    if (delivery) {
      setAcceptedDeliveries(prev => prev.filter(item => item.id !== id));
      setCompletedDeliveries(prev => [{ ...delivery, status: 'Completed', date: 'Today' }, ...prev]);
    }
  };

  const optimizeRoute = () => {
    // Mock current location (Harare Center)
    const currentLoc = { latitude: -17.8252, longitude: 31.0335 };
    
    const sorted = [...acceptedDeliveries].sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.pickup.latitude - currentLoc.latitude, 2) + Math.pow(a.pickup.longitude - currentLoc.longitude, 2));
      const distB = Math.sqrt(Math.pow(b.pickup.latitude - currentLoc.latitude, 2) + Math.pow(b.pickup.longitude - currentLoc.longitude, 2));
      return distA - distB;
    });
    
    setAcceptedDeliveries(sorted);
  };

  const simulateNewDelivery = async () => {
    const newOrder = {
      id: `d${Date.now()}`,
      orderId: `${Math.floor(Math.random() * 10000)}`,
      storeName: 'New Store Alert',
      pickupAddress: '55 Kwame Nkrumah Ave',
      dropoffAddress: '101 Second St',
      earnings: '$9.50',
      distance: '2.0 km',
      itemsCount: 1,
      pickup: { latitude: -17.8250, longitude: 31.0500 },
      dropoff: { latitude: -17.8350, longitude: 31.0600 }
    };
    
    setAvailableDeliveries(prev => [newOrder, ...prev]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Delivery Available! 📦",
        body: `Earn ${newOrder.earnings} • ${newOrder.distance} away`,
        data: { orderId: newOrder.id },
        sound: true,
      },
      trigger: null, // Immediate
    });
  };

  return (
    <DataContext.Provider value={{ 
      products, videos, cart, orders, favorites, storeDetails, teamMembers, transactions, financialSummary, loggedInUser, availableDeliveries, acceptedDeliveries, completedDeliveries,
      addProduct, addToCart, removeFromCart, updateCartQuantity, placeOrder, toggleFavorite, 
      updateStoreDetails, inviteMember, acceptDelivery, completeDelivery, optimizeRoute, simulateNewDelivery
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);