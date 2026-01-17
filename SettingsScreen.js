import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { supabase } from './supabaseClient';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Temporarily disabled

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sn', name: 'Shona' },
  { code: 'nd', name: 'Ndebele' },
  { code: 'fr', name: 'French' },
  { code: 'sw', name: 'Swahili' },
];

const SettingsScreen = ({ onBack }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [languageCode, setLanguageCode] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Load language preference on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        // Try to get from profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('language')
            .eq('id', user.id)
            .single();

          if (profile?.language) {
            const lang = LANGUAGES.find(l => l.code === profile.language);
            if (lang) {
              setSelectedLanguage(lang.name);
              setLanguageCode(lang.code);
            }
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };
    loadLanguagePreference();
  }, []);

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language.name);
    setLanguageCode(language.code);
    setLanguageModalVisible(false);

    try {
      // Update profile in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ language: language.code })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating language in profile:', error);
        }
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
        <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
          {/* Dark Mode Toggle */}
          <View style={[styles.menuOption, { borderBottomWidth: 0, borderBottomColor: theme.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="moon-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
        <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
          {/* Notifications Toggle */}
          <View style={[styles.menuOption, { borderBottomColor: theme.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.menuLabel, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          {/* Language Selection */}
          <TouchableOpacity 
            style={[styles.menuOption, { borderBottomWidth: 0 }]}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.menuLabel, { color: theme.text }]}>Language</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={[styles.menuValue, { color: theme.textSecondary }]}>{selectedLanguage}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.border} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    { borderBottomColor: theme.border },
                    languageCode === item.code && { backgroundColor: theme.border }
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={[styles.languageText, { color: theme.text }]}>{item.name}</Text>
                  {languageCode === item.code && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginTop: 20 },
  menuContainer: { borderRadius: 16, padding: 8, marginBottom: 20 },
  menuOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontSize: 16, marginLeft: 16, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuValue: { fontSize: 16, marginRight: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { borderRadius: 16, padding: 20, width: '100%', maxWidth: 400, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1 },
  languageText: { fontSize: 16 },
  modalCloseButton: { marginTop: 20, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalCloseText: { fontSize: 16, fontWeight: '600' },
});

export default SettingsScreen;