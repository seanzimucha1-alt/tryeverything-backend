import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_PRODUCTS } from './mockData';
import ProductDetailsScreen from './ProductDetailsScreen';
import { useTheme } from './ThemeContext';

const ShopScreen = ({ shopName, onClose }) => {
  const { theme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <Modal animationType="slide" transparent={false} visible={true} onRequestClose={onClose}>
      <View style={[styles.shopContainer, { backgroundColor: theme.background }]}>
        <StatusBar style={theme.status} />
        
        {/* Shop Header */}
        <View style={[styles.shopHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.shopTitle, { color: theme.text }]}>{shopName}</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.shopContent} showsVerticalScrollIndicator={false}>
          {/* Seller Details */}
          <View style={styles.sellerInfoContainer}>
            <View style={[styles.sellerAvatar, { backgroundColor: theme.border }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>{shopName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.sellerTextContainer}>
              <Text style={[styles.sellerName, { color: theme.text }]}>{shopName}</Text>
              <Text style={[styles.sellerLocation, { color: theme.textSecondary }]}>
                <Ionicons name="location-sharp" size={14} color="#EF4444" /> Harare, Zimbabwe
              </Text>
              <Text style={styles.sellerRating}>⭐ 4.8 (120)</Text>
            </View>
          </View>

          {/* AI Recommendations */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended For You ✨</Text>
          
          {/* Product Grid */}
          <View style={styles.productsGrid}>
            {MOCK_PRODUCTS.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setSelectedProduct(product)}
              >
                <View style={[styles.productImagePlaceholder, { backgroundColor: theme.border }]}>
                  <Ionicons name="cube-outline" size={40} color={theme.textSecondary} />
                </View>
                <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
                <Text style={[styles.productPrice, { color: theme.textSecondary }]}>{product.price}</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {selectedProduct && (
        <ProductDetailsScreen product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  shopContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  shopHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  shopTitle: { color: '#111827', fontSize: 18, fontWeight: 'bold' },
  shopContent: { flex: 1, padding: 20 },
  sellerInfoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  sellerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  avatarText: { color: '#556B2F', fontSize: 24, fontWeight: 'bold' },
  sellerName: { color: '#111827', fontSize: 18, fontWeight: 'bold' },
  sellerLocation: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  sellerRating: { color: '#F59E0B', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#111827', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  productImagePlaceholder: { height: 120, backgroundColor: '#F9FAFB', borderRadius: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  productName: { color: '#111827', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  productPrice: { color: '#6B7280', fontSize: 14, marginBottom: 12 },
  addToCartButton: { backgroundColor: '#F97316', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addToCartText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  backButton: { marginRight: 10 },
});

export default ShopScreen;