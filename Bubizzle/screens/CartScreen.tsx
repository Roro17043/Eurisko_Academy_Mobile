import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../RTKstore';
import { removeFromCart } from '../RTKstore/slices/cartSlice';
import AppText from '../components/AppText';
import ListScreenWrapper from '../components/ListScreenWrapper';
import CartItem from '../components/CartItem';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const handleRemove = (id: string) => dispatch(removeFromCart(id));

  const renderItem = ({ item }: any) => (
    <View>
      <CartItem item={item} onRemove={handleRemove} isDarkMode={isDarkMode} />
    </View>
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
