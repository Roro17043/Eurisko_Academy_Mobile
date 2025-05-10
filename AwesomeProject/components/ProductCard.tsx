import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ProductCardProps = {
  title: string;
  price: number;
  imageUrl: string;
  onPress: () => void;
};

export default function ProductCard({ title, price, imageUrl, onPress }: ProductCardProps) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    card: {
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      padding: 10,
      marginBottom: 10,
      elevation: 2,
    },
    image: {
      height: 200,
      borderRadius: 6,
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#f1f1f1' : '#000',
    },
    price: {
      color: isDarkMode ? '#9df59b' : 'green',
      marginTop: 4,
    },
  });
