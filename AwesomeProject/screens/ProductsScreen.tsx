import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import { useSelector } from 'react-redux';
import { RootState } from '../RTKstore';
import api from '../services/api';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';

const IMAGE_BASE_URL = 'https://backend-practice.eurisko.me';

export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
};

export default function ProductScreen() {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    if (!refreshing) setLoading(true);
    setError(null);

    try {
      const response = await api.get('/products', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, limit: 10 },
      });

      if (response.data.success) {
        setProducts(response.data.data);
        const pagination = response.data.pagination;
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
      } else {
        throw new Error('API returned error');
      }
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMessage =
        err?.message?.includes('status code 521') || statusCode === 521
          ? 'Failed to Get Products'
          : err?.message || 'Failed to fetch products';

      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSearchedProducts = async (
    query: string,
    min?: string,
    max?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/products/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { query },
      });

      let filtered = response.data.data;
      const minVal = min ? Number(min) : null;
      const maxVal = max ? Number(max) : null;

      filtered = filtered.filter((item: Product) => {
        if (minVal !== null && item.price < minVal) return false;
        if (maxVal !== null && item.price > maxVal) return false;
        return true;
      });

      setProducts(filtered);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMessage =
        err?.message?.includes('status code 521') || statusCode === 521
          ? 'Failed to Get Products'
          : err?.message || 'Failed to fetch products';

      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchProducts(page);
  };

  const renderPagination = () => {
    if (searchQuery || minPrice || maxPrice) return null;

    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={[styles.pageButton, currentPage === i && styles.activePageButton]}
        >
          <Text style={styles.pageText}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.pageButton}
        >
          <Text style={styles.pageText}>Prev</Text>
        </TouchableOpacity>

        {pageButtons}

        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.pageButton}
        >
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper scroll={false} disableScrollWrap>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard
            title={item.title}
            price={item.price}
            images={item.images.map((img) => ({ uri: `${IMAGE_BASE_URL}${img.url}` }))}
            onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
          />
        )}
        ListHeaderComponent={
          <View style={styles.innerContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                fetchSearchedProducts(text, minPrice, maxPrice);
              }}
            />
            <View style={styles.priceFilterRow}>
              <AppTextInput
                placeholder="Min Price"
                keyboardType="numeric"
                value={minPrice}
                onChangeText={(text) => {
                  setMinPrice(text);
                  fetchSearchedProducts(searchQuery, text, maxPrice);
                }}
                style={styles.priceInput}
              />
              <AppTextInput
                placeholder="Max Price"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={(text) => {
                  setMaxPrice(text);
                  fetchSearchedProducts(searchQuery, minPrice, text);
                }}
                style={styles.priceInput}
              />
            </View>

            {loading && !refreshing && <ActivityIndicator size="large" />}
            {error && (
              <>
                <Text style={styles.errorText}>{error}</Text>
                <AppButton title="Retry" onPress={() => fetchProducts(currentPage)} style={styles.retryButton} />
              </>
            )}
            {!error && products.length === 0 && (
              <>
                <Text style={styles.emptyText}>No products found</Text>
                <AppButton title="Retry" onPress={() => fetchProducts(currentPage)} style={styles.retryButton} />
              </>
            )}
          </View>
        }
        ListFooterComponent={renderPagination}
        contentContainerStyle={styles.innerContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProducts(currentPage);
            }}
          />
        }
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    innerContainer: {
      padding: 28,
      paddingBottom: 100,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#f5f5f5',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginVertical: 10,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#999',
      marginTop: 20,
    },
    retryButton: {
      marginTop: 16,
    },
    priceFilterRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -10,
      gap: 12,
    },
    priceInput: {
      flex: 0.4,
      height: 38,
      fontSize: 14,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: '#fff',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
      flexWrap: 'wrap',
      gap: 8,
    },
    pageButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: '#ddd',
      marginHorizontal: 4,
    },
    activePageButton: {
      backgroundColor: '#007bff',
    },
    pageText: {
      color: '#000',
      fontWeight: 'bold',
    },
  });
