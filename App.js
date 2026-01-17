import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './LoginScreen';
import FeedScreen from './FeedScreen';
import RegisterScreen from './RegisterScreen';
import DashboardScreen from './DashboardScreen';
import ProfileScreen from './ProfileScreen';
import MyOrdersScreen from './MyOrdersScreen';
import SettingsScreen from './SettingsScreen';
import SearchScreen from './SearchScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderDetailsScreen from './OrderDetailsScreen';
import FavoritesScreen from './FavoritesScreen';
import StoreSettingsScreen from './StoreSettingsScreen';
import FinancesScreen from './FinancesScreen';
import ManageTeamScreen from './ManageTeamScreen';
import DelivererEarningsScreen from './DelivererEarningsScreen';
import MyDeliveriesScreen from './MyDeliveriesScreen';
import DelivererDashboardScreen from './DelivererDashboardScreen';
import ChatScreen from './ChatScreen';
import BottomNavBar from './BottomNavBar';
import { ThemeProvider, useTheme } from './ThemeContext';
import { DataProvider } from './DataContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>Pamusika</Text>
      <Text style={styles.subtitle}>Welcome To The Marketplace</Text>
    </View>
  );
};

function MainApp() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('Customer');
  const [authScreen, setAuthScreen] = useState('login'); // 'login' or 'register'
  const [activeScreen, setActiveScreen] = useState('feed'); // 'feed' or 'profile'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAuthSuccess = (role = 'Customer') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegisterScreen 
        onRegisterSuccess={handleAuthSuccess} 
        onSwitchToLogin={() => setAuthScreen('login')}
      />;
    }
    return <LoginScreen 
      onLoginSuccess={handleAuthSuccess} 
      onSwitchToRegister={() => setAuthScreen('register')}
    />;
  }

  const renderContent = () => {
    switch (activeScreen) {
      case 'profile':
        return <ProfileScreen 
          showBack={false}
          onLogout={() => setIsAuthenticated(false)} 
          onNavigateToOrders={() => setActiveScreen('orders')}
          onNavigateToFavorites={() => setActiveScreen('favorites')}
          onNavigateToSettings={() => setActiveScreen('settings')}
          userRole={userRole}
          onSwitchRole={setUserRole}
        />;
      case 'orders':
        return <MyOrdersScreen 
          onBack={() => setActiveScreen('profile')} 
          onNavigateToDetails={(order) => {
            setSelectedOrder(order);
            setActiveScreen('orderDetails');
          }}
        />;
      case 'orderDetails':
        return <OrderDetailsScreen 
          order={selectedOrder} 
          onBack={() => setActiveScreen('orders')} 
          onNavigateToChat={() => setActiveScreen('chat')}
        />;
      case 'chat':
        // In a real app, you'd pass the seller's name dynamically
        return <ChatScreen onBack={() => setActiveScreen('orderDetails')} sellerName="Sneaker World" />;
      case 'favorites':
        return <FavoritesScreen onBack={() => setActiveScreen('profile')} />;
      case 'storeSettings':
        return <StoreSettingsScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'finances':
        return <FinancesScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'manageTeam':
        return <ManageTeamScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setActiveScreen('profile')} />;
      case 'search':
        return <SearchScreen showBack={false} />;
      case 'cart':
        return <CartScreen onCheckout={() => setActiveScreen('checkout')} />;
      case 'checkout':
        return <CheckoutScreen 
          onBack={() => setActiveScreen('cart')} 
          onPlaceOrder={() => setActiveScreen('orders')} 
        />;
      case 'dashboard':
        // Enforce role-based access: Only deliverers see deliverer dashboard
        if (userRole === 'Deliverer') {
          return <DelivererDashboardScreen 
            onLogout={() => setIsAuthenticated(false)} 
            onNavigateToMyDeliveries={() => setActiveScreen('myDeliveries')}
            onNavigateToEarnings={() => setActiveScreen('delivererEarnings')}
          />;
        }
        // Only admin/staff/customers see regular dashboard (not deliverers)
        if (userRole !== 'Deliverer') {
          return <DashboardScreen 
            onLogout={() => setIsAuthenticated(false)} 
            onNavigateToOrderDetails={(order) => {
              setSelectedOrder(order);
              setActiveScreen('orderDetails');
            }}
            onNavigateToStoreSettings={() => setActiveScreen('storeSettings')}
            onNavigateToFinances={() => setActiveScreen('finances')}
            onNavigateToManageTeam={() => setActiveScreen('manageTeam')}
          />;
        }
        // Fallback: redirect deliverers away from customer screens
        return <FeedScreen />;
      case 'myDeliveries':
        // Only deliverers can access this screen
        if (userRole !== 'Deliverer') {
          return <FeedScreen />;
        }
        return <MyDeliveriesScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'delivererEarnings':
        // Only deliverers can access this screen
        if (userRole !== 'Deliverer') {
          return <FeedScreen />;
        }
        return <DelivererEarningsScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'feed':
      default:
        return <FeedScreen />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.status} />
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
      {/* Show BottomNavBar on main tabs */}
      {['feed', 'search', 'cart', 'profile', 'dashboard'].includes(activeScreen) && (
        <BottomNavBar activeScreen={activeScreen} onNavigate={setActiveScreen} userRole={userRole} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  // Splash Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#556B2F', // Primary Brand Olive Green
    letterSpacing: 1.5,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280', // Text Secondary
  },
});
