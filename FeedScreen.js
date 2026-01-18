import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-video';
import ShopScreen from './ShopScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import { useTheme } from './ThemeContext';
import { useData } from './DataContext';
import * as mockVideoService from './services/mockVideoService';

const { width, height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = 80;
const SCREEN_HEIGHT = height - BOTTOM_NAV_HEIGHT;

const CATEGORIES = ['All', 'Sneakers', 'Fashion', 'Tech', 'Sports'];

// Single Video Post Component with actual video playback
const VideoPost = ({ item, onOpenShop, onViewProduct, theme, onLike }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(item.id);
    }
  };

  return (
    <View style={styles.videoContainer}>
      {/* Video Player */}
      <View style={styles.videoPlayer}>
        <Video
          ref={videoRef}
          source={{ uri: item.video_url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          useNativeControls
          style={styles.videoElement}
          onError={(error) => console.log('Video error:', error)}
        />
      </View>

      {/* Right Side Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionText, { color: theme.text }]}>
            {liked ? item.likes + 1 : item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={[styles.actionText, { color: theme.text }]}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={[styles.actionText, { color: theme.text }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info & Shop Link */}
      <View style={styles.bottomContainer}>
        <Text style={[styles.username, { color: theme.text }]}>Creator</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
        
        <TouchableOpacity style={styles.shopButton} onPress={() => onOpenShop('Featured Store')}>
          <Ionicons name="cart" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.shopButtonText}>View Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FeedScreen = () => {
  const { theme } = useTheme();
  const { products, videos, favorites, toggleFavorite } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedShop, setSelectedShop] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from mock service on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const mockVideos = await mockVideoService.fetchAllVideos();
        setVideoList(mockVideos);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handleViewProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) setViewingProduct(product);
  };

  const handleVideoLike = async (videoId) => {
    try {
      const updatedVideo = await mockVideoService.likeVideo(videoId);
      // Update local state
      setVideoList(videoList.map(v => v.id === videoId ? updatedVideo : v));
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  const renderProductItem = ({ item }) => {
    const isFavorited = favorites.includes(item.id);
    return (
      <View style={styles.productCardContainer}>
        <TouchableOpacity 
          style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setViewingProduct(item)}
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
            <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={isFavorited ? '#EF4444' : theme.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.feedContainer, { backgroundColor: theme.background }]}>
      
      {/* Top Header */}
      <View style={[styles.header, searchQuery.length > 0 && { backgroundColor: theme.background, borderBottomWidth: 1, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <Text style={styles.headerText}>Pamusika</Text>
            <Ionicons name="cart" size={24} color="#556B2F" style={styles.cartIcon} />
          </View>
          {!searchQuery && <Text style={styles.tagline}>Discover, Connect, Trade</Text>}
        </View>
        
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: searchQuery.length > 0 ? theme.border : 'rgba(255,255,255,0.9)' }]}>
            <Ionicons name="search" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (text === '') {
                    setSelectedCategory('All');
                  }
                }}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                </TouchableOpacity>
            )}
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.categoriesContainer}>
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.categoryChip, { backgroundColor: theme.border }, selectedCategory === item && styles.categoryChipActive]} onPress={() => setSelectedCategory(item)}>
                  <Text style={[styles.categoryText, { color: theme.textSecondary }, selectedCategory === item && styles.categoryTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {searchQuery.length > 0 ? (
        <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow} 
            contentContainerStyle={{ paddingTop: 190, paddingHorizontal: 10 }}
            ListEmptyComponent={
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ color: theme.textSecondary }}>No products found</Text>
                </View>
            }
        />
      ) : (
        <FlatList
            data={videoList}
            renderItem={({ item }) => <VideoPost item={item} onOpenShop={setSelectedShop} onViewProduct={handleViewProduct} theme={theme} onLike={handleVideoLike} />}
            keyExtractor={item => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={SCREEN_HEIGHT}
            decelerationRate="fast"
            disableIntervalMomentum
        />
      )}

      {selectedShop && (
        <ShopScreen shopName={selectedShop} onClose={() => setSelectedShop(null)} />
      )}

      {viewingProduct && (
        <ProductDetailsScreen product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  headerText: { color: '#556B2F', fontSize: 24, fontWeight: 'bold', letterSpacing: 0.5 },
  cartIcon: { marginLeft: 8 },
  tagline: { color: '#6B7280', fontSize: 12, marginTop: 2, fontWeight: '500' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 14 },
  categoriesContainer: { marginTop: 12 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#556B2F' },
  categoryText: { fontSize: 14, fontWeight: '500' },
  categoryTextActive: { color: '#FFFFFF', fontWeight: '600' },
  productRow: { justifyContent: 'space-between' },
  productCardContainer: { width: '48%', marginBottom: 16 },
  productCard: { width: '100%', borderRadius: 12, padding: 12, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.7)', padding: 6, borderRadius: 15 },
  productImagePlaceholder: { height: 120, borderRadius: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14 },
  videoContainer: { width: width, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  videoPlayer: { width: '100%', height: '100%', backgroundColor: '#000' },
  videoElement: { width: '100%', height: '100%' },
  actionsContainer: { position: 'absolute', right: 10, bottom: 150, alignItems: 'center', zIndex: 5 },
  actionButton: { marginBottom: 20, alignItems: 'center' },
  actionIcon: { fontSize: 32, marginBottom: 4 },
  actionText: { marginTop: 5, fontSize: 12, fontWeight: '600' },
  bottomContainer: { position: 'absolute', bottom: 40, left: 10, right: 80 },
  username: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  description: { fontSize: 14, marginBottom: 15 },
  shopButton: { backgroundColor: '#F97316', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, alignSelf: 'flex-start', shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  shopButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});

export default FeedScreen;