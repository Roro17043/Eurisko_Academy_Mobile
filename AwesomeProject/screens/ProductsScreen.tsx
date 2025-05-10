import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import products from '../data/Phones.json';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';

export default function ProductListScreen() {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={products.data}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              imageUrl={item.images[0].url}
              onPress={() => navigation.navigate('ProductDetails', { ...item })}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 20,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#f5f5f5',
    },
  });
