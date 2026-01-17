import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_PRODUCTS } from './mockData';
import ProductDetailsScreen from './ProductDetailsScreen';

const CATEGORIES = ['All', 'Sneakers', 'Fashion', 'Tech', 'Sports'];

const SearchScreen = ({ onBack, showBack = true }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    let matchesCategory = true;
    
    if (selectedCategory !== 'All') {
        // Simple keyword matching for demo purposes since mock data lacks category field
        const text = (product.name + ' ' + (product.description || '')).toLowerCase();
        
        if (selectedCategory === 'Sneakers' && !text.includes('sneaker')) matchesCategory = false;
        if (selectedCategory === 'Fashion' && !text.includes('tee') && !text.includes('bag') && !text.includes('sneaker')) matchesCategory = false;
        if (selectedCategory === 'Tech' && !text.includes('watch')) matchesCategory = false;
        if (selectedCategory === 'Sports' && !text.includes('sport') && !text.includes('gym') && !text.includes('running')) matchesCategory = false;
    }

    return matchesQuery && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        )}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus={true}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => setSelectedProduct(item)}
          >
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="cube-outline" size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No products found</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  backButton: { marginRight: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#111827' },
  categoriesContainer: { marginBottom: 16 },
  categoriesList: { paddingHorizontal: 20 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  categoryChipActive: { backgroundColor: '#EFF6FF', borderColor: '#556B2F' },
  categoryText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  categoryTextActive: { color: '#556B2F', fontWeight: '600' },
  resultsList: { paddingHorizontal: 20, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  productImagePlaceholder: { height: 100, backgroundColor: '#F9FAFB', borderRadius: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#556B2F', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#6B7280' },
});

export default SearchScreen;