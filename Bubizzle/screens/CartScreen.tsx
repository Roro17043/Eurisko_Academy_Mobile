import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,

  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../RTKstore';
import { removeFromCart } from '../RTKstore/slices/cartSlice';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import AppText from '../components/AppText';
import ListScreenWrapper from '../components/ListScreenWrapper';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const handleRemove = (productId: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item from the cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => dispatch(removeFromCart(productId)) },
    ]);
  };

  const renderRightActions = (productId: string) => (
    <RectButton style={styles.deleteButton} onPress={() => handleRemove(productId)}>
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  const renderItem = ({ item }: any) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        <View style={styles.itemText}>
          <AppText style={styles.title}>{item.title}</AppText>
          <AppText style={styles.details}>
            ${item.price} × {item.quantity} = ${item.price * item.quantity}
          </AppText>
        </View>
      </View>
    </Swipeable>
  );

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
            renderItem={renderItem}
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
    deleteButton: {
      backgroundColor: '#ff3b30',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      marginVertical: 10,
      borderRadius: 10,
    },
    deleteText: {
      color: '#fff',
      fontWeight: 'bold',
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
