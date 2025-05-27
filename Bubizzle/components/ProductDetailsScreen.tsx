import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// ⚠️ TEMP: Same mock product list used in ProductListScreen
const products = [
  { id: '1', title: 'iPhone 14', price: '$999', image: 'https://i5.walmartimages.com/seo/Pre-Owned-MacBook-Pro-13-Touch-Bar-MPXV2LL-A-Core-i5-3-1Ghz-8GB-RAM-256GB-SSD-Good_0290991b-4f6b-47c7-b278-a69077b4bbaf.684ce090a8b1ca271ddf45bc70eae664.jpeg' },
  { id: '2', title: 'MacBook Pro', price: '$1999', image: 'https://via.placeholder.com/400x300' },
];

export default function ProductDetailsScreen() {
  const route = useRoute<any>();
  const { productId } = route.params;

  const product = products.find((item) => item.id === productId);
  const scale = useSharedValue(1);
  console.log('Received productId:', productId);
  console.log('Product image URL:', product?.image);


  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Animated.Image
          sharedTransitionTag={`product-${product.id}`}
          source={{ uri: product.image }}
          style={[styles.image, animatedImageStyle]}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.desc}>
          This is a premium {product.title} with top-notch features. Enjoy the sleek animation and
          modern UI!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: screenWidth,
    height: 300,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginVertical: 10,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
