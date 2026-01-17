import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const DeliveryItem = ({ item, theme, onAccept }) => (
  <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={[styles.storeName, { color: theme.text }]}>{item.storeName}</Text>
        <Text style={[styles.orderId, { color: theme.textSecondary }]}>Order #{item.orderId}</Text>
      </View>
      <Text style={[styles.earnings, { color: theme.primary }]}>{item.earnings}</Text>
    </View>

    <View style={styles.routeContainer}>
      <View style={styles.routeRow}>
        <Ionicons name="storefront-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>{item.pickupAddress}</Text>
      </View>
      <View style={[styles.routeLine, { backgroundColor: theme.border }]} />
      <View style={styles.routeRow}>
        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>{item.dropoffAddress}</Text>
      </View>
    </View>

    <View style={styles.metaContainer}>
      <View style={styles.metaItem}>
        <Ionicons name="navigate-outline" size={14} color={theme.textSecondary} />
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.distance}</Text>
      </View>
      <View style={styles.metaItem}>
        <Ionicons name="cube-outline" size={14} color={theme.textSecondary} />
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.itemsCount} Items</Text>
      </View>
    </View>

    <TouchableOpacity style={[styles.acceptButton, { backgroundColor: theme.primary }]} onPress={() => onAccept(item.id)}>
      <Text style={styles.acceptButtonText}>Accept Delivery</Text>
    </TouchableOpacity>
  </View>
);

const DelivererDashboardScreen = ({ onLogout, onNavigateToMyDeliveries, onNavigateToEarnings }) => {
  const { theme } = useTheme();
  const { availableDeliveries, acceptDelivery, simulateNewDelivery } = useData();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Available Orders</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pick up and deliver</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 15 }}>
            <TouchableOpacity onPress={onNavigateToMyDeliveries}>
              <Text style={{ color: theme.primary, fontWeight: '600' }}>My Deliveries</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateToEarnings}>
              <Text style={{ color: theme.primary, fontWeight: '600' }}>Earnings</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* View Toggle */}
        <View style={[styles.viewToggle, { backgroundColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && { backgroundColor: theme.primary }]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#FFFFFF' : theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && { backgroundColor: theme.primary }]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={20} color={viewMode === 'map' ? '#FFFFFF' : theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Test Button for Notifications */}
      <TouchableOpacity style={[styles.testButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={simulateNewDelivery}>
        <Ionicons name="notifications-outline" size={16} color={theme.text} />
        <Text style={[styles.testButtonText, { color: theme.text }]}>Simulate New Order</Text>
      </TouchableOpacity>

      {viewMode === 'list' ? (
        <FlatList
          data={availableDeliveries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DeliveryItem item={item} theme={theme} onAccept={acceptDelivery} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bicycle-outline" size={64} color={theme.border} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No orders available right now.</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -17.8252,
              longitude: 31.0335,
              latitudeDelta: 0.12,
              longitudeDelta: 0.12,
            }}
          >
            {availableDeliveries.map(delivery => (
              <React.Fragment key={delivery.id}>
                <Marker coordinate={delivery.pickup} title={delivery.storeName} description="Pickup" pinColor="green" />
                <Marker coordinate={delivery.dropoff} title={`Order #${delivery.orderId}`} description="Dropoff" pinColor="red" />
                <Polyline 
                  coordinates={[delivery.pickup, delivery.dropoff]} 
                  strokeColor={theme.primary} 
                  strokeWidth={2} 
                  lineDashPattern={[5, 5]} 
                />
              </React.Fragment>
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14 },
  logoutButton: { padding: 8 },
  listContent: { padding: 20 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  storeName: { fontSize: 16, fontWeight: 'bold' },
  orderId: { fontSize: 12 },
  earnings: { fontSize: 18, fontWeight: 'bold' },
  routeContainer: { marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  address: { marginLeft: 8, fontSize: 14, flex: 1 },
  routeLine: { width: 2, height: 10, marginLeft: 7, marginVertical: 2 },
  metaContainer: { flexDirection: 'row', marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  metaText: { marginLeft: 4, fontSize: 12 },
  acceptButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16 },
  viewToggle: { flexDirection: 'row', borderRadius: 8, padding: 2, marginHorizontal: 10 },
  toggleButton: { padding: 8, borderRadius: 6 },
  mapContainer: { flex: 1, margin: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  map: { width: '100%', height: '100%' },
  testButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 10, padding: 10, borderRadius: 8, borderWidth: 1 },
  testButtonText: { marginLeft: 8, fontSize: 12, fontWeight: '600' },
});

export default DelivererDashboardScreen;