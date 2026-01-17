import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const AcceptedDeliveryItem = ({ item, theme, onComplete }) => (
  <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={styles.cardHeader}>
      <Text style={[styles.storeName, { color: theme.text }]}>{item.storeName}</Text>
      <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
        <Text style={[styles.statusText, { color: theme.primary }]}>In Progress</Text>
      </View>
    </View>

    <View style={styles.routeContainer}>
      <View style={styles.routeRow}>
        <Ionicons name="storefront" size={16} color={theme.primary} />
        <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>{item.pickupAddress}</Text>
      </View>
      <View style={[styles.routeLine, { backgroundColor: theme.border }]} />
      <View style={styles.routeRow}>
        <Ionicons name="location" size={16} color="#EF4444" />
        <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>{item.dropoffAddress}</Text>
      </View>
    </View>

    <TouchableOpacity style={[styles.completeButton, { backgroundColor: '#10B981' }]} onPress={() => onComplete(item.id)}>
      <Text style={styles.completeButtonText}>Mark as Delivered</Text>
    </TouchableOpacity>
  </View>
);

const MyDeliveriesScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { acceptedDeliveries, completeDelivery, optimizeRoute } = useData();

  const handleOptimize = () => {
    optimizeRoute();
    Alert.alert('Route Optimized', 'Your deliveries have been reordered for the most efficient route.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>My Deliveries</Text>
        <TouchableOpacity onPress={handleOptimize} style={styles.optimizeButton}>
          <Ionicons name="git-network-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={acceptedDeliveries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AcceptedDeliveryItem item={item} theme={theme} onComplete={completeDelivery} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No active deliveries.</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Accept orders from the dashboard.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  backButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: 'bold' },
  optimizeButton: { padding: 4 },
  listContent: { padding: 20 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  storeName: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  routeContainer: { marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  address: { marginLeft: 8, fontSize: 14, flex: 1 },
  routeLine: { width: 2, height: 10, marginLeft: 7, marginVertical: 2 },
  completeButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  completeButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600' },
  emptySubText: { marginTop: 8, fontSize: 14 },
});

export default MyDeliveriesScreen;