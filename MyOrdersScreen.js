import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered': return { bg: '#ECFDF5', text: '#10B981' }; // Success Green
    case 'Processing': return { bg: '#EFF6FF', text: '#556B2F' }; // Brand Olive Green
    case 'Cancelled': return { bg: '#FEF2F2', text: '#EF4444' }; // Error Red
    default: return { bg: '#F3F4F6', text: '#6B7280' };
  }
};

const OrderItem = ({ item, theme, onPress }) => {
  const statusStyle = getStatusColor(item.status);

  return (
    <View style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.orderId, { color: theme.text }]}>Order #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
      
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      
      <View style={styles.cardFooter}>
        <Text style={[styles.itemsText, { color: theme.textSecondary }]}>{item.items}</Text>
        <Text style={[styles.totalText, { color: theme.text }]}>{item.total}</Text>
      </View>
      
      <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#556B2F" />
      </TouchableOpacity>
    </View>
  );
};

const MyOrdersScreen = ({ onBack, onNavigateToDetails }) => {
  const { theme } = useTheme();
  const { orders } = useData();
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {['All', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              { backgroundColor: theme.border },
              filter === status && { backgroundColor: theme.primary }
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === status ? '#FFFFFF' : theme.textSecondary }
            ]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <OrderItem item={item} theme={theme} onPress={() => onNavigateToDetails(item)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  backButton: { padding: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  filterText: { fontSize: 14, fontWeight: '500' },
  
  // Order Card Styles
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  dateText: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemsText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  detailsButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  detailsButtonText: { fontSize: 14, color: '#556B2F', fontWeight: '600', marginRight: 4 },
});

export default MyOrdersScreen;