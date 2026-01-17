import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';
import ProductDetailsScreen from './ProductDetailsScreen';

const FavoritesScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { products, favorites, toggleFavorite } = useData();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const renderProductItem = ({ item }) => {
    const isFavorited = favorites.includes(item.id); // Will always be true here, but good for consistency
    return (
      <View style={styles.productCardContainer}>
        <TouchableOpacity 
          style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setSelectedProduct(item)}
        >
          <View style={[styles.productImagePlaceholder, { backgroundColor: theme.border }]}>
             {item.image ? (
                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
             ) : (
                <Ionicons name="cube-outline" size={32} color={theme.textSecondary} />
             )}
          </View>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.productPrice, { color: theme.textSecondary }]}>{item.price}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => toggleFavorite(item.id)}
        >
            <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={'#EF4444'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.status} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Favorites</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={favoriteProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>You have no favorites yet.</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Tap the heart on products to save them.</Text>
          </View>
        }
      />

      {selectedProduct && (
        <ProductDetailsScreen product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
  productRow: { justifyContent: 'space-between' },
  productCardContainer: { width: '48%', marginBottom: 16, marginLeft: '1%', marginRight: '1%' },
  productCard: { width: '100%', borderRadius: 12, padding: 12, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.7)', padding: 6, borderRadius: 15 },
  productImagePlaceholder: { height: 120, borderRadius: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  emptySubText: { marginTop: 8, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});

export default FavoritesScreen;