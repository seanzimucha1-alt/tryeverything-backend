import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const MOCK_ADDRESSES = [
  { id: '1', label: 'Home', address: '123 Main St, Harare, Zimbabwe' },
  { id: '2', label: 'Work', address: '456 Office Park, Harare, Zimbabwe' },
];

const MOCK_PAYMENT_METHODS = [
  { id: '1', type: 'Credit Card', last4: '4242', icon: 'card' },
  { id: '2', type: 'Mobile Money', provider: 'EcoCash', icon: 'phone-portrait' },
];

const CheckoutScreen = ({ onBack, onPlaceOrder }) => {
  const { theme } = useTheme();
  const { placeOrder, cart } = useData();
  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0].id);
  const [selectedPayment, setSelectedPayment] = useState(MOCK_PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    // Validate address selection
    const selectedAddr = MOCK_ADDRESSES.find(a => a.id === selectedAddress);
    if (!selectedAddr || !selectedAddr.address) {
      Alert.alert('Error', 'Please select a valid delivery address');
      return;
    }

    // Validate address format
    if (!selectedAddr.address.trim()) {
      Alert.alert('Error', 'Delivery address cannot be empty');
      return;
    }

    setIsProcessing(true);
    
    // Prepare delivery details with address
    const deliveryDetails = {
      address: selectedAddr.address,
      label: selectedAddr.label,
      paymentMethod: MOCK_PAYMENT_METHODS.find(p => p.id === selectedPayment)?.type || 'Credit Card',
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      setIsProcessing(false);
      placeOrder(deliveryDetails);
      Alert.alert('Order Placed', 'Your order has been placed successfully!', [
        { text: 'OK', onPress: onPlaceOrder }
      ]);
    }, 2000);
  };

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$','')) * item.quantity), 0);
  const finalTotal = total + 5.00; // Assuming delivery fee

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Shipping Address */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Shipping Address</Text>
        {MOCK_ADDRESSES.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            style={[
              styles.optionCard,
              { backgroundColor: theme.card, borderColor: selectedAddress === addr.id ? theme.primary : theme.border }
            ]}
            onPress={() => setSelectedAddress(addr.id)}
          >
            <View style={styles.optionHeader}>
              <Text style={[styles.optionLabel, { color: theme.text }]}>{addr.label}</Text>
              {selectedAddress === addr.id && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
            </View>
            <Text style={[styles.optionText, { color: theme.textSecondary }]}>{addr.address}</Text>
          </TouchableOpacity>
        ))}

        {/* Payment Method */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Payment Method</Text>
        {MOCK_PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.optionCard,
              { backgroundColor: theme.card, borderColor: selectedPayment === method.id ? theme.primary : theme.border }
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <View style={styles.optionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={method.icon} size={20} color={theme.text} style={{ marginRight: 8 }} />
                <Text style={[styles.optionLabel, { color: theme.text }]}>{method.type}</Text>
              </View>
              {selectedPayment === method.id && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
            </View>
            <Text style={[styles.optionText, { color: theme.textSecondary }]}>
              {method.last4 ? `**** **** **** ${method.last4}` : method.provider}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Total Summary */}
        <View style={[styles.summaryContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.summaryRow}>
                <Text style={[styles.summaryText, { color: theme.textSecondary }]}>Total Amount</Text>
                <Text style={[styles.totalAmount, { color: theme.primary }]}>${finalTotal.toFixed(2)}</Text>
            </View>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
            style={[styles.placeOrderButton, { backgroundColor: theme.primary }]} 
            onPress={handlePlaceOrder}
            disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  optionCard: { padding: 16, borderRadius: 12, borderWidth: 2, marginBottom: 12 },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  optionLabel: { fontSize: 16, fontWeight: '600' },
  optionText: { fontSize: 14 },
  summaryContainer: { marginTop: 30, padding: 20, borderRadius: 12, borderWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { fontSize: 16 },
  totalAmount: { fontSize: 24, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  placeOrderButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  placeOrderText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CheckoutScreen;