import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const ProfileScreen = ({ onBack, onLogout, onNavigateToOrders, onNavigateToSettings, onNavigateToFavorites, userRole, showBack = true }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.border }]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>John Doe</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>john.doe@example.com</Text>
        </View>

        {/* Order Stats */}
        <View style={[styles.statsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>2</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>$450</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Spent</Text>
          </View>
        </View>

        {/* Rewards Card */}
        <View style={styles.rewardsCard}>
          <View>
            <Text style={styles.rewardsLabel}>Pamusika Points</Text>
            <Text style={styles.rewardsValue}>2,450</Text>
          </View>
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>

        {/* Current Role Display */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Current Mode</Text>
          <View style={[styles.roleDisplay, { backgroundColor: theme.border }]}>
            <Text style={[styles.roleDisplayText, { color: theme.primary, fontWeight: 'bold' }]}>
              {userRole}
            </Text>
            <Text style={[styles.roleNote, { color: theme.textSecondary }]}>
              To switch modes, log out and sign in with a different account type
            </Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
          <MenuOption icon="cube-outline" label="My Orders" onPress={onNavigateToOrders} theme={theme} />
          <MenuOption icon="heart-outline" label="My Favorites" onPress={onNavigateToFavorites} theme={theme} />
          <MenuOption icon="location-outline" label="Shipping Addresses" theme={theme} />
          <MenuOption icon="card-outline" label="Payment Methods" theme={theme} />
          <MenuOption icon="settings-outline" label="Settings" onPress={onNavigateToSettings} theme={theme} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const MenuOption = ({ icon, label, onPress, theme }) => (
  <TouchableOpacity style={[styles.menuOption, { borderBottomColor: theme.border }]} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color={theme.textSecondary} />
      <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.border} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  backButton: { padding: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  userInfo: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#556B2F' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  userEmail: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginLeft: 4 },
  roleContainer: { flexDirection: 'row', padding: 4, borderRadius: 12 },
  roleButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  roleText: { fontSize: 14 },
  rewardsCard: { backgroundColor: '#556B2F', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, shadowColor: '#556B2F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  rewardsLabel: { color: '#BFDBFE', fontSize: 14, marginBottom: 4 },
  rewardsValue: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  redeemButton: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  redeemText: { color: '#556B2F', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 8, marginBottom: 30 },
  menuOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontSize: 16, color: '#374151', marginLeft: 12, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});

export default ProfileScreen;