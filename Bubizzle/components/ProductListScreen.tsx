import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const products = [
  { id: '1', title: 'iPhone 14', price: '$999', image: 'https://i5.walmartimages.com/seo/Pre-Owned-MacBook-Pro-13-Touch-Bar-MPXV2LL-A-Core-i5-3-1Ghz-8GB-RAM-256GB-SSD-Good_0290991b-4f6b-47c7-b278-a69077b4bbaf.684ce090a8b1ca271ddf45bc70eae664.jpeg' },
  { id: '2', title: 'MacBook Pro', price: '$1999', image: 'https://via.placeholder.com/400x300' },
];


export default function ProductListScreen() {
  const navigation = useNavigation<any>();

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        >
          <Animated.Image
            sharedTransitionTag={`product-${item.id}`}
            source={{ uri: item.image }}
            style={styles.image}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: screenWidth - 32,
    height: 200,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 12,
  },
  price: {
    fontSize: 16,
    marginBottom: 12,
    marginHorizontal: 12,
    color: 'green',
  },
});
