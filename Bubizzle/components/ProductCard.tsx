import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
  ScrollView,
} from 'react-native';
import AppText from './AppText';
import { useIsFocused } from '@react-navigation/native';

export type ProductCardProps = {
  title: string;
  price: number;
  images: { uri: string }[];
  onPress: () => void;
};

const screenWidth = Dimensions.get('window').width;

export default function ProductCard({ title, price, images, onPress }: ProductCardProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!images.length || !isFocused) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        scrollRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
        return nextIndex;
      });
    }, 4000); // Fixed 4s interval
    return () => clearInterval(interval);
  }, [images.length, isFocused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      {images && images.length > 0 ? (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.dotContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.fallbackContainer}>
          <AppText style={styles.fallbackText}>No Image</AppText>
        </View>
      )}

      <View style={styles.info}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText style={styles.price}>${price}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    image: {
      width: screenWidth,
      height: 200,
    },
    fallbackContainer: {
      width: screenWidth,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#444' : '#eee',
    },
    fallbackText: {
      color: '#888',
      fontSize: 14,
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ccc',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#007aff',
      width: 10,
      height: 10,
    },
    info: {
      padding: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#f1f1f1' : '#111',
    },
    price: {
      fontSize: 14,
      color: isDarkMode ? '#9df59b' : 'green',
      marginTop: 4,
    },
  });
