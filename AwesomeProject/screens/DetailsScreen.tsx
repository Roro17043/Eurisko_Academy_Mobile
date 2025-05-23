import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  PixelRatio,
  ActivityIndicator,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Linking,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import AppText from '../components/AppText';
import api from '../services/api';
import { RootStackParamList } from '../navigation/RootParamNavigation';
import RNFS from 'react-native-fs';
import MapView, { Marker } from 'react-native-maps';
import { reverseGeocode } from '../services/geocoding';

const IMAGE_BASE_URL = 'https://backend-practice.eurisko.me';
type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen() {
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;
  const { width, height } = useWindowDimensions();
  const { isDarkMode } = useTheme();
  const themeStyles = getStyles(isDarkMode);

  const [resolvedLocationName, setResolvedLocationName] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product?.location?.latitude && product?.location?.longitude) {
      reverseGeocode(product.location.latitude, product.location.longitude).then(setResolvedLocationName);
    }
  }, [product?.location]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      if (res.data.success) {
        const productData = res.data.data;
        setProduct(productData);
      } else {
        throw new Error('Product not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentImageIndex(index);
  };

  const handleImageSave = async (imageUrl: string) => {
    try {
      if (Platform.OS === 'android') {
        const sdk = Platform.Version;
        const permission =
          sdk >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'App needs permission to save images to your device',
          buttonPositive: 'OK',
        });

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
          return;
        }
      }

      const fileName = imageUrl.split('/').pop() || `image_${Date.now()}.jpg`;
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: localPath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        await CameraRoll.save(localPath, { type: 'photo' });
        ToastAndroid.show('✅ Image saved to gallery', ToastAndroid.SHORT);
      } else {
        throw new Error('Failed to download image');
      }
    } catch (err) {
      ToastAndroid.show('❌ Failed to save image', ToastAndroid.SHORT);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error || !product) {
    return (
      <ScreenWrapper>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      backgroundColor={isDarkMode ? '#000' : '#f9f9f9'}
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      translucent
    >
      <ScrollView contentContainerStyle={themeStyles.container} nestedScrollEnabled>
        <FlatList
          data={product.images}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} onLongPress={() => handleImageSave(`${IMAGE_BASE_URL}${item.url}`)}>
              <Image source={{ uri: `${IMAGE_BASE_URL}${item.url}` }} style={{ width, height: 300, resizeMode: 'cover' }} />
            </TouchableOpacity>
          )}
        />

        <View style={themeStyles.dotContainer}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[themeStyles.dot, currentImageIndex === index && themeStyles.activeDot]}
            />
          ))}
        </View>

        <View style={themeStyles.body}>
          <AppText style={themeStyles.title}>{product.title}</AppText>
          <AppText style={themeStyles.price}>{`$${product.price}`}</AppText>
          <AppText style={themeStyles.description}>{product.description}</AppText>

          <View style={themeStyles.buttonRow}>
            <TouchableOpacity style={[themeStyles.button, themeStyles.shareButton]}>
              <AppText style={themeStyles.buttonText}>Share</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[themeStyles.button, themeStyles.cartButton]}>
              <AppText style={themeStyles.buttonText}>Add to Cart</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          {resolvedLocationName && (
            <AppText style={themeStyles.locationText}>📍 {resolvedLocationName}</AppText>
          )}

          {product.user?.email && (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${product.user.email}`)}>
              <AppText style={{ color: '#007bff', textDecorationLine: 'underline' }}>
                ✉️ {product.user.email}
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {product.location && (
          <TouchableOpacity>
            <MapView
              style={{ height: 200, width: '100%', borderRadius: 12, marginTop: 16 }}
              region={{
                latitude: product.location.latitude,
                longitude: product.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={product.location} />
            </MapView>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#1c1c1e' : '#f9f9f9',
      paddingBottom: 20,
    },
    title: {
      fontSize: PixelRatio.getFontScale() >= 1.2 ? 24 : 20,
      fontFamily: 'Montserrat-Bold',
      marginBottom: 6,
      color: isDarkMode ? '#fff' : '#222',
    },
    description: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 24,
      color: isDarkMode ? '#ccc' : '#444',
    },
    locationText: {
      marginBottom: 6,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
      marginBottom: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ccc',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#007bff',
    },
    body: {
      flex: 1,
      padding: PixelRatio.get() >= 3 ? 20 : 16,
    },
    price: {
      fontSize: 18,
      fontWeight: '600',
      color: '#28a745',
      marginBottom: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    shareButton: {
      backgroundColor: '#007bff',
    },
    cartButton: {
      backgroundColor: '#28a745',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 15,
    },
  });
