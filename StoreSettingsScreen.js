import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const StoreSettingsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { storeDetails, updateStoreDetails, loggedInUser } = useData();
  const canEdit = loggedInUser.role === 'Admin';
  
  const [name, setName] = useState(storeDetails.name);
  const [address, setAddress] = useState(storeDetails.address);
  const [city, setCity] = useState(storeDetails.city);

  const handleSaveChanges = () => {
    updateStoreDetails({ name, address, city });
    Alert.alert('Success', 'Store details have been updated.');
    onBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Store Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={styles.inputLabel}>Store Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.border, color: theme.text, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Your Awesome Store"
            placeholderTextColor={theme.textSecondary}
            editable={canEdit}
          />

          <Text style={styles.inputLabel}>Store Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.border, color: theme.text, borderColor: theme.border }]}
            value={address}
            onChangeText={setAddress}
            placeholder="123 Market Street"
            placeholderTextColor={theme.textSecondary}
            editable={canEdit}
          />

          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.border, color: theme.text, borderColor: theme.border }]}
            value={city}
            onChangeText={setCity}
            placeholder="Harare"
            placeholderTextColor={theme.textSecondary}
            editable={canEdit}
          />
        </View>
        
        {/* Location on Map (Placeholder) */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Store Location</Text>
            <Text style={[styles.sectionSubtitle, {color: theme.textSecondary}]}>Help deliverers find you easily.</Text>
            <View style={[styles.mapPlaceholder, {backgroundColor: theme.border}]}>
                <Ionicons name="map-outline" size={48} color={theme.textSecondary} />
                <Text style={{color: theme.textSecondary, marginTop: 8}}>Map view will be here</Text>
            </View>
            <TouchableOpacity 
              style={[styles.locationButton, {borderColor: theme.primary}, !canEdit && { opacity: 0.5, borderColor: theme.border }]}
              disabled={!canEdit}
            >
                <Text style={[styles.locationButtonText, {color: theme.primary}, !canEdit && { color: theme.textSecondary }]}>Pin Location on Map</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      {canEdit && (
        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  section: { padding: 20, borderRadius: 12, marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, marginBottom: 16 },
  mapPlaceholder: { height: 150, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  locationButton: { padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  locationButtonText: { fontSize: 14, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  saveButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default StoreSettingsScreen;