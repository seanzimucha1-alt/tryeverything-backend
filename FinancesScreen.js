import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return { bg: '#ECFDF5', text: '#10B981' };
    case 'Pending': return { bg: '#FFFBEB', text: '#F59E0B' };
    default: return { bg: '#F3F4F6', text: '#6B7280' };
  }
};

const TransactionItem = ({ item, theme }) => {
  const statusStyle = getStatusColor(item.status);
  const isCredit = item.amount.startsWith('+');
  return (
    <View style={[styles.transactionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={isCredit ? 'arrow-down' : 'arrow-up'} size={20} color={isCredit ? '#10B981' : '#EF4444'} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>{item.date}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isCredit ? '#10B981' : theme.text }]}>{item.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );
};

const FinancesScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { transactions, financialSummary } = useData();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Finances</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionItem item={item} theme={theme} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Revenue</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>{financialSummary.totalRevenue}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Pending Payout</Text>
                <Text style={[styles.summaryValue, { color: theme.primary }]}>{financialSummary.pendingPayout}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.withdrawButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
            </TouchableOpacity>
            <Text style={[styles.listTitle, { color: theme.text }]}>Transaction History</Text>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '48%', padding: 20, borderRadius: 12 },
  summaryLabel: { fontSize: 14, marginBottom: 8 },
  summaryValue: { fontSize: 22, fontWeight: 'bold' },
  withdrawButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  withdrawButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  transactionCard: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
  iconContainer: { marginRight: 12 },
  detailsContainer: { flex: 1 },
  description: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 12, marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '600' },
});

export default FinancesScreen;