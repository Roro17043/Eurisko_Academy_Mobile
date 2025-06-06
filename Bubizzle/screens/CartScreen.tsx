// CartScreen.tsx

import React from 'react';
import {
  View,
  FlatList,
  Image,
  ToastAndroid,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../storage/RTKstore';
import { removeFromCart } from '../storage/RTKstore/slices/cartSlice';
import AppText from '../components/AppText';
import ListScreenWrapper from '../components/ListScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type CartItemProps = {
  item: any;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
};

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, isDarkMode }) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(Math.sign(translateX.value) * SCREEN_WIDTH, {}, () => {
          runOnJS(onRemove)(item._id);
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[getStyles(isDarkMode).itemContainer, animatedStyle]}>
        <Image source={{ uri: item.imageUrl }} style={getStyles(isDarkMode).thumbnail} />
        <View style={getStyles(isDarkMode).itemText}>
          <AppText style={getStyles(isDarkMode).title}>{item.title}</AppText>
          <AppText style={getStyles(isDarkMode).details}>
            ${item.price} × {item.quantity} = ${item.price * item.quantity}
          </AppText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default function CartScreen() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    ToastAndroid.show('🗑️ Removed from cart', ToastAndroid.SHORT);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ListScreenWrapper>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>🛒 Your cart is empty.</AppText>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CartItem item={item} onRemove={handleRemove} isDarkMode={isDarkMode} />
            )}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.totalContainer}>
            <AppText style={styles.totalText}>Total: ${total.toFixed(2)}</AppText>
          </View>
        </>
      )}
    </ListScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2c2c2e' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
    itemText: {
      flex: 1,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    details: {
      color: isDarkMode ? '#ccc' : '#555',
      marginTop: 4,
    },
    totalContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderColor: isDarkMode ? '#444' : '#eee',
      backgroundColor: isDarkMode ? '#1c1c1e' : '#f9f9f9',
    },
    totalText: {
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'right',
      color: isDarkMode ? '#fff' : '#000',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#aaa' : '#888',
    },
  });
