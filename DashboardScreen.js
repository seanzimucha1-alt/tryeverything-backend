import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Image, Alert, ActivityIndicator, Switch, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from './DataContext';
import { useTheme } from './ThemeContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered': return { bg: '#ECFDF5', text: '#10B981' };
    case 'Processing': return { bg: '#EFF6FF', text: '#556B2F' };
    case 'Cancelled': return { bg: '#FEF2F2', text: '#EF4444' };
    default: return { bg: '#F3F4F6', text: '#6B7280' };
  }
};

const OrderItem = ({ item, theme, onPress }) => {
  const statusStyle = getStatusColor(item.status);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: theme.text }]}>Order #{item.id}</Text>
        <Text style={[styles.orderTotal, { color: theme.primary }]}>{item.total}</Text>
      </View>
      <Text style={[styles.orderItems, { color: theme.textSecondary }]}>{item.items}</Text>
    </TouchableOpacity>
  );
};

const DashboardScreen = ({ onLogout, onNavigateToOrderDetails, onNavigateToStoreSettings, onNavigateToFinances, onNavigateToManageTeam }) => {
  const { addProduct, storeDetails, updateStoreDetails, orders, loggedInUser } = useData();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = loggedInUser.role === 'Admin';
  const isStaff = loggedInUser.role === 'Staff';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!productName || !productPrice || !productDesc || !productImage) {
      Alert.alert('Missing Information', 'Please fill in all fields and upload an image.');
      return;
    }

    setIsUploading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsUploading(false);
      setModalVisible(false);
      
      addProduct({
        name: productName,
        price: `$${productPrice}`,
        description: productDesc,
        image: productImage
      });

      Alert.alert('Success', 'Product uploaded successfully!');
      
      // Reset form
      setProductName(''); setProductPrice(''); setProductDesc(''); setProductImage(null);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Your Store</Text>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Manage your sales and products</Text>
        </View>
        <View style={styles.storeStatus}>
            <Text style={[styles.storeStatusText, { color: storeDetails.isOpen ? theme.primary : theme.textSecondary }]}>
                {storeDetails.isOpen ? 'Open' : 'Closed'}
            </Text>
            <Switch
                value={storeDetails.isOpen}
                onValueChange={(isOpen) => updateStoreDetails({ isOpen })}
                trackColor={{ false: '#D1D5DB', true: theme.primary }}
                thumbColor="#FFFFFF"
            />
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {isAdmin && (
              <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Revenue (24h)</Text>
                      <Text style={[styles.statValue, { color: theme.text }]}>$1,240</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending Orders</Text>
                      <Text style={[styles.statValue, { color: theme.text }]}>15</Text>
                    </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Add Product</Text>
                </TouchableOpacity>
                {(isAdmin || isStaff) ? (
                  <>
                    {isAdmin && (
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]} onPress={onNavigateToFinances}>
                          <Ionicons name="cash-outline" size={22} color={theme.textSecondary} />
                          <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Finances</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]} onPress={onNavigateToManageTeam}>
                        <Ionicons name="people-outline" size={22} color={theme.textSecondary} />
                        <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Manage Team</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]} onPress={onNavigateToStoreSettings}>
                        <Ionicons name="storefront-outline" size={22} color={theme.textSecondary} />
                        <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Store Settings</Text>
                    </TouchableOpacity>
                  </>
                ) : <View style={{flex: 3, flexDirection: 'row'}} />}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
          </>
        )}
        data={orders.filter(o => o.status === 'Processing')}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderItem item={item} theme={theme} onPress={() => onNavigateToOrderDetails(item)} />}
      />

      {/* Add Product Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={styles.modalTitle}>New Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image Picker */}
              <TouchableOpacity style={[styles.imagePicker, { backgroundColor: theme.border, borderColor: theme.textSecondary }]} onPress={pickImage}>
                {productImage ? (
                  <Image source={{ uri: productImage }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                    <Text style={styles.imagePickerText}>Tap to upload image</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Product Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.border, borderColor: theme.border }]}
                placeholder="e.g. Vintage Jacket"
                placeholderTextColor="#9CA3AF"
                value={productName}
                onChangeText={setProductName}
              />

              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.border, borderColor: theme.border }]}
                placeholder="$0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={productPrice}
                onChangeText={setProductPrice}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.border, borderColor: theme.border }]}
                placeholder="Describe your product..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={productDesc}
                onChangeText={setProductDesc}
              />

              <TouchableOpacity 
                style={[styles.uploadButton, { backgroundColor: theme.primary }]} 
                onPress={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload Product</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  greeting: { color: '#6B7280', fontSize: 14 },
  title: { color: '#111827', fontSize: 24, fontWeight: 'bold' },
  storeStatus: { alignItems: 'center' },
  storeStatusText: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statLabel: { color: '#6B7280', fontSize: 14, marginBottom: 8 },
  statValue: { color: '#111827', fontSize: 24, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 10 },
  actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  sectionTitle: { color: '#111827', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  orderCard: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontSize: 14, fontWeight: '600' },
  orderTotal: { fontSize: 14, fontWeight: 'bold' },
  orderItems: { fontSize: 12 },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  imagePicker: {
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;