import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Text,
  StyleSheet,
  PixelRatio,
  ToastAndroid,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useTheme } from '../context/ThemeContext';
import AppText from '../components/AppText';
import api from '../services/api';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../navigation/RootParamNavigation';
import MapView, { Marker } from 'react-native-maps';
import ListScreenWrapper from '../components/ListScreenWrapper';
import { reverseGeocode } from '../services/geocoding';
import { useDispatch } from 'react-redux';
import { addToCart } from '../RTKstore/slices/cartSlice';
import Animated, { SlideInUp } from 'react-native-reanimated';

const IMAGE_BASE_URL = 'https://backend-practice.eurisko.me';
type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen() {
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;
  const { width } = useWindowDimensions();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const themeStyles = getStyles(isDarkMode);

  const [product, setProduct] = useState<any>(null);
  const [locationName, setLocationName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        const data = res.data.data;
        setProduct(data);
        if (data.location?.latitude && data.location?.longitude) {
          const name = await reverseGeocode(data.location.latitude, data.location.longitude);
          setLocationName(name);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleImageSave = async (url: string) => {
    try {
      if (Platform.OS === 'android') {
        const sdk = Platform.Version;
        const permission = sdk >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
          return;
        }
      }

      const fileName = url.split('/').pop() || `image_${Date.now()}.jpg`;
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      const result = await RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise;
      if (result.statusCode === 200) {
        await CameraRoll.save(localPath, { type: 'photo' });
        ToastAndroid.show('✅ Image saved to gallery', ToastAndroid.SHORT);
      } else {
        throw new Error();
      }
    } catch {
      ToastAndroid.show('❌ Failed to save image', ToastAndroid.SHORT);
    }
  };

  if (loading) return <ActivityIndicator style={themeStyles.loadingContainer} size="large" />;
  if (error || !product) return (
    <ListScreenWrapper>
      <Text style={themeStyles.errorText}>{error || 'No product found'}</Text>
    </ListScreenWrapper>
  );

  return (
    <ListScreenWrapper>
      <Animated.ScrollView
        entering={SlideInUp.duration(600).delay(100)}
        contentContainerStyle={themeStyles.container}
        nestedScrollEnabled
      >
        <FlatList
          data={product.images}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleImageSave(`${IMAGE_BASE_URL}${item.url}`)}>
              <Image source={{ uri: `${IMAGE_BASE_URL}${item.url}` }} style={[themeStyles.image, { width }]} />
            </TouchableOpacity>
          )}
        />

        <View style={themeStyles.dotContainer}>
          {product.images.map((_, index) => (
            <View key={index} style={[themeStyles.dot, index === currentImageIndex && themeStyles.activeDot]} />
          ))}
        </View>

        <View style={themeStyles.body}>
          <AppText style={themeStyles.title}>{product.title}</AppText>
          <AppText style={themeStyles.price}>${product.price}</AppText>
          <AppText style={themeStyles.description}>{product.description}</AppText>

          <View style={themeStyles.buttonRow}>
            <TouchableOpacity style={[themeStyles.button, themeStyles.shareButton]}>
              <AppText style={themeStyles.buttonText}>Share</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[themeStyles.button, themeStyles.cartButton]}
              onPress={() => {
                dispatch(addToCart({
                  _id: product._id,
                  title: product.title,
                  price: product.price,
                  imageUrl: `${IMAGE_BASE_URL}${product.images[0]?.url || ''}`,
                }));
                ToastAndroid.show('✅ Added to cart', ToastAndroid.SHORT);
              }}
            >
              <AppText style={themeStyles.buttonText}>Add to Cart</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={themeStyles.footerSection}>
          {locationName ? <AppText style={themeStyles.locationText}>📍 {locationName}</AppText> : null}
          {product.user?.email && (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${product.user.email}`)}>
              <AppText style={themeStyles.emailLink}>✉️ {product.user.email}</AppText>
            </TouchableOpacity>
          )}
        </View>

        {product.location && (
          <MapView
            style={themeStyles.map}
            region={{
              latitude: product.location.latitude,
              longitude: product.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={product.location} />
          </MapView>
        )}
      </Animated.ScrollView>
    </ListScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
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
  emailLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  map: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    marginTop: 16,
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
  image: {
    height: 300,
    resizeMode: 'cover',
  },
  footerSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
