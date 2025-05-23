import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../RTKstore';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import AppText from '../components/AppText';
import {useTheme} from '../context/ThemeContext';
import api from '../services/api';

const IMAGE_BASE_URL = 'https://backend-practice.eurisko.me';

export default function MyProductsScreen() {
  const {isDarkMode} = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<any>();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      setLoading(true); // optional: show loading during refetch
      let page = 1;
      let allProducts: any[] = [];
      let hasNext = true;

      while (hasNext) {
        const res = await api.get('/products', {
          headers: {Authorization: `Bearer ${accessToken}`},
          params: {page, limit: 10},
        });

        const data = res.data.data || [];
        allProducts = [...allProducts, ...data];
        hasNext = res.data.pagination?.hasNextPage;
        page += 1;
      }

      const filtered = allProducts.filter(
        (product: any) => product.user?._id === userId,
      );
      console.log('📦 My Product IDs:');
      filtered.forEach(p => console.log(`- ${p._id}`));

      setMyProducts(filtered);
    } catch (err: any) {
      console.error(
        '❌ Product fetch error:',
        err?.response?.data || err.message || err,
      );
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/products/${productId}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
              });

              setMyProducts(prev => prev.filter(p => p._id !== productId));
              Alert.alert('Deleted', 'Product has been removed');
            } catch {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    fetchMyProducts(); // initial fetch
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMyProducts(); // refetch on screen focus
    }, []),
  );

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" style={{marginTop: 50}} />
        ) : myProducts.length === 0 ? (
          <Text style={styles.empty}>No products added yet.</Text>
        ) : (
          <FlatList
            data={myProducts}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.card}>
                <Image
                  source={{uri: `${IMAGE_BASE_URL}${item.images[0]?.url}`}}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <AppText style={styles.title}>{item.title}</AppText>
                  <AppText style={styles.price}>${item.price}</AppText>
                  <AppText style={styles.location}>
                    📍 Dummy Location: {item.location?.latitude ?? 33.89}°,{' '}
                    {item.location?.longitude ?? 35.5}°
                  </AppText>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.edit}
                      onPress={() =>
                        navigation.navigate('EditProduct', {
                          productId: item._id,
                        })
                      }>
                      <AppText style={styles.btnText}>Edit</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.delete}
                      onPress={() => deleteProduct(item._id)}>
                      <AppText style={styles.btnText}>Delete</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
      flexGrow: 1,
    },
    empty: {
      textAlign: 'center',
      color: '#999',
      marginTop: 20,
    },
    card: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#f4f4f4',
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: 100,
      height: 100,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },
    info: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
    },
    price: {
      marginTop: 4,
      color: '#28a745',
    },
    location: {
      marginTop: 4,
      fontSize: 12,
      color: isDarkMode ? '#aaa' : '#555',
    },
    actions: {
      flexDirection: 'row',
      marginTop: 10,
      gap: 10,
    },
    edit: {
      backgroundColor: '#007bff',
      padding: 8,
      borderRadius: 6,
    },
    delete: {
      backgroundColor: '#dc3545',
      padding: 8,
      borderRadius: 6,
    },
    btnText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
