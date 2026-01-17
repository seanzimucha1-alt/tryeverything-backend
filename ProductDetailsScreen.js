import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';

const ProductDetailsScreen = ({ product, onClose }) => {
  const { theme } = useTheme();
  const { addToCart, favorites, toggleFavorite } = useData();
  if (!product) return null;

  const isFavorited = favorites.includes(product.id);
  return (
    <Modal animationType="slide" transparent={false} visible={true} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={theme.status} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-down" size={32} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Product Details</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ padding: 4, marginRight: 12 }}>
              <Ionicons name="share-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 4 }} onPress={() => toggleFavorite(product.id)}>
              <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={isFavorited ? '#EF4444' : theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Image Placeholder */}
          <View style={[styles.imageContainer, { backgroundColor: theme.border, overflow: 'hidden' }]}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Ionicons name="cube-outline" size={80} color={theme.textSecondary} />
            )}
          </View>

          {/* Title & Price */}
          <View style={styles.infoContainer}>
            <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
            <Text style={[styles.productPrice, { color: theme.primary }]}>{product.price}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>4.8 (12 Reviews)</Text>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>{product.description || 'No description available.'}</Text>

            {/* Reviews Section */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews</Text>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.card }]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewUser, { color: theme.text }]}>{review.user}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={[styles.reviewRatingText, { color: theme.textSecondary }]}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noReviews, { color: theme.textSecondary }]}>No reviews yet.</Text>
            )}
          </View>
          
          {/* Bottom Padding for Scroll */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Bottom Action */}
        <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => {
            addToCart(product);
            onClose();
          }}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <Ionicons name="cart" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  backButton: { padding: 4 },
  content: { flex: 1 },
  imageContainer: { height: 300, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  infoContainer: { paddingHorizontal: 20 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  productPrice: { fontSize: 20, fontWeight: '600', color: '#556B2F', marginBottom: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  ratingText: { marginLeft: 6, color: '#6B7280', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12, marginTop: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 20 },
  
  // Reviews
  reviewCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewUser: { fontWeight: '600', color: '#111827' },
  reviewRating: { flexDirection: 'row', alignItems: 'center' },
  reviewRatingText: { marginLeft: 4, fontSize: 12, color: '#4B5563' },
  reviewComment: { color: '#4B5563', fontSize: 14 },
  noReviews: { color: '#9CA3AF', fontStyle: 'italic' },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 40 },
  addToCartButton: { backgroundColor: '#F97316', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addToCartText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default ProductDetailsScreen;