import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const CartScreen = ({ onCheckout }) => {
  const { theme } = useTheme();
  const { cart, updateCartQuantity, removeFromCart } = useData();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = deliveryMethod === 'delivery' ? 5.00 : 0.00;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.itemImagePlaceholder, { backgroundColor: theme.border, overflow: 'hidden' }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Ionicons name="cube-outline" size={32} color={theme.textSecondary} />
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: theme.primary }]}>{item.price}</Text>
        <Text style={[styles.itemVariant, { color: theme.textSecondary }]}>Size: {item.size}</Text>
      </View>
      <View style={styles.actions}>
        <View style={[styles.quantityControl, { backgroundColor: theme.border }]}>
          <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.size, -1)} style={styles.qtyButton}>
            <Ionicons name="remove" size={16} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.size, 1)} style={styles.qtyButton}>
            <Ionicons name="add" size={16} color={theme.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id, item.size)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
        <Text style={[styles.itemCount, { color: theme.textSecondary }]}>{cart.length} Items</Text>
      </View>

      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}-${item.size}`}
        contentContainerStyle={[styles.listContent, { paddingBottom: 200 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your cart is empty</Text>
          </View>
        }
        ListFooterComponent={cart.length > 0 && (
          <View style={styles.footerContent}>
            {/* Delivery Method Toggle */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Method</Text>
            <View style={[styles.deliveryToggle, { backgroundColor: theme.border }]}>
              <TouchableOpacity 
                style={[styles.toggleOption, deliveryMethod === 'delivery' && { backgroundColor: theme.card, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }]}
                onPress={() => setDeliveryMethod('delivery')}
              >
                <Text style={[styles.toggleText, { color: deliveryMethod === 'delivery' ? theme.primary : theme.textSecondary, fontWeight: deliveryMethod === 'delivery' ? 'bold' : 'normal' }]}>Delivery ($5.00)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleOption, deliveryMethod === 'pickup' && { backgroundColor: theme.card, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }]}
                onPress={() => setDeliveryMethod('pickup')}
              >
                <Text style={[styles.toggleText, { color: deliveryMethod === 'pickup' ? theme.primary : theme.textSecondary, fontWeight: deliveryMethod === 'pickup' ? 'bold' : 'normal' }]}>Pickup (Free)</Text>
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Order Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Delivery Fee</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>${deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
                <Text style={[styles.totalAmount, { color: theme.primary }]}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  itemCount: { fontSize: 14, color: '#6B7280' },
  listContent: { paddingHorizontal: 20 },
  cartItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  itemImagePlaceholder: { width: 80, height: 80, backgroundColor: '#F9FAFB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#556B2F', marginBottom: 4 },
  itemVariant: { fontSize: 12, color: '#6B7280' },
  actions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4 },
  qtyButton: { padding: 4 },
  qtyText: { marginHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#111827' },
  removeButton: { padding: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 40 },
  checkoutButton: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  checkoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  footerContent: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  deliveryToggle: { flexDirection: 'row', padding: 4, borderRadius: 12, backgroundColor: '#F3F4F6' },
  toggleOption: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  toggleText: { fontSize: 14 },
  summaryCard: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#556B2F' },
});

export default CartScreen;