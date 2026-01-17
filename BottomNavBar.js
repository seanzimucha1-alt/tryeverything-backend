import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const BottomNavBar = ({ activeScreen, onNavigate, userRole }) => {
  const { theme } = useTheme();
  const tabs = [
    { name: 'feed', label: 'Feed', icon: 'home' },
    { name: 'search', label: 'Shop', icon: 'search' },
    { name: 'cart', label: 'Cart', icon: 'cart' },
    ...((userRole === 'Seller' || userRole === 'Deliverer') ? [{ name: 'dashboard', label: 'Dashboard', icon: 'grid' }] : []),
    { name: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onNavigate(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.icon : `${tab.icon}-outline`}
              size={24}
              color={isActive ? theme.primary : theme.textSecondary}
            />
            <Text style={[styles.label, { color: isActive ? theme.primary : theme.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 20, // Safe area for iPhone X+
    paddingTop: 10,
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavBar;