import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const EarningsCard = ({ label, amount, theme }) => (
  <View style={[styles.statCard, { backgroundColor: theme.card }]}>
    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.statValue, { color: theme.primary }]}>{amount}</Text>
  </View>
);

const HistoryItem = ({ item, theme }) => (
  <View style={[styles.historyItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <View style={styles.historyLeft}>
      <Text style={[styles.storeName, { color: theme.text }]}>{item.storeName}</Text>
      <Text style={[styles.date, { color: theme.textSecondary }]}>{item.date}</Text>
    </View>
    <Text style={[styles.amount, { color: theme.primary }]}>{item.earnings}</Text>
  </View>
);

const DelivererEarningsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { completedDeliveries } = useData();

  // Calculate totals (mock calculation based on string values)
  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + parseFloat(item.earnings.replace('$', '')), 0).toFixed(2);
  };

  const todayTotal = calculateTotal(completedDeliveries.filter(i => i.date === 'Today'));
  const totalEarnings = calculateTotal(completedDeliveries);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Earnings</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={completedDeliveries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryItem item={item} theme={theme} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            <View style={styles.row}>
              <EarningsCard label="Today" amount={`$${todayTotal}`} theme={theme} />
              <EarningsCard label="This Week" amount={`$${totalEarnings}`} theme={theme} />
            </View>
            <View style={[styles.totalCard, { backgroundColor: theme.primary }]}>
              <Text style={styles.totalLabel}>Total Balance</Text>
              <Text style={styles.totalValue}>${totalEarnings}</Text>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawText}>Cash Out</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
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
  content: { padding: 20 },
  statsContainer: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: 14, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  totalCard: { padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 24 },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  totalValue: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  withdrawButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  withdrawText: { color: '#556B2F', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  historyLeft: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  date: { fontSize: 12 },
  amount: { fontSize: 16, fontWeight: 'bold' },
});

export default DelivererEarningsScreen;