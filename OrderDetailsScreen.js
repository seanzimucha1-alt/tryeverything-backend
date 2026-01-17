import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const OrderDetailsScreen = ({ order, onBack, onNavigateToChat }) => {
  const { theme } = useTheme();

  // Mock extended details since simple mock data doesn't have everything
  const orderDetails = {
    ...order,
    address: '123 Main St, Harare, Zimbabwe',
    paymentMethod: 'EcoCash (**** 1234)',
    timeline: [
      { status: 'Order Placed', date: 'Oct 24, 10:00 AM', completed: true },
      { status: 'Processing', date: 'Oct 24, 2:00 PM', completed: true },
      { status: 'Shipped', date: 'Oct 25, 09:00 AM', completed: order.status === 'Delivered' },
      { status: 'Delivered', date: 'Oct 26, 4:00 PM', completed: order.status === 'Delivered' },
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Order #{order.id}</Text>
        <TouchableOpacity onPress={onNavigateToChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Banner */}
        <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Status</Text>
            <Text style={[styles.statusValue, { color: theme.primary }]}>{order.status}</Text>
        </View>

        {/* Items */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Items</Text>
            <View style={styles.itemRow}>
                <Ionicons name="cube-outline" size={24} color={theme.textSecondary} />
                <View style={{marginLeft: 12}}>
                    <Text style={[styles.itemText, { color: theme.text }]}>{order.items}</Text>
                    <Text style={[styles.itemSubText, { color: theme.textSecondary }]}>Qty: 1</Text>
                </View>
                <Text style={[styles.itemPrice, { color: theme.text }]}>{order.total}</Text>
            </View>
        </View>

        {/* Delivery Address */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Address</Text>
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.text }]}>{orderDetails.address}</Text>
            </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
            <View style={styles.infoRow}>
                <Ionicons name="card-outline" size={20} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.text }]}>{orderDetails.paymentMethod}</Text>
            </View>
        </View>

        {/* Timeline */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Timeline</Text>
            {orderDetails.timeline.map((step, index) => (
                <View key={index} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                        <View style={[styles.dot, { backgroundColor: step.completed ? theme.primary : theme.border }]} />
                        {index < orderDetails.timeline.length - 1 && (
                            <View style={[styles.line, { backgroundColor: theme.border }]} />
                        )}
                    </View>
                    <View style={styles.timelineRight}>
                        <Text style={[styles.timelineStatus, { color: step.completed ? theme.text : theme.textSecondary }]}>{step.status}</Text>
                        <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>{step.date}</Text>
                    </View>
                </View>
            ))}
        </View>
      </ScrollView>

      {/* Message Button */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity style={[styles.messageButton, { backgroundColor: theme.primary }]} onPress={onNavigateToChat}>
              <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
              <Text style={styles.messageButtonText}>Message Seller</Text>
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
  statusCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { fontSize: 14 },
  statusValue: { fontSize: 16, fontWeight: 'bold' },
  section: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 16, fontWeight: '500' },
  itemSubText: { fontSize: 12, marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', marginLeft: 'auto' },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 14, marginLeft: 12 },
  timelineRow: { flexDirection: 'row', minHeight: 60 },
  timelineLeft: { alignItems: 'center', width: 30 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  line: { width: 2, flex: 1, position: 'absolute', top: 12, bottom: -12 },
  timelineRight: { flex: 1, paddingBottom: 20 },
  timelineStatus: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  timelineDate: { fontSize: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  messageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12 },
  messageButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default OrderDetailsScreen;