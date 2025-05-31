import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 56;

export default function ProductSkeleton({ count = 4 }: { count?: number }) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.wrapper}>
      {[...Array(count)].map((_, index) => (
        <View key={index} style={styles.shadowBox}>
          <SkeletonPlaceholder
            borderRadius={12}
            backgroundColor={isDarkMode ? '#444' : '#E1E9EE'}
            highlightColor={isDarkMode ? '#555' : '#F2F8FC'}
          >
            <View style={styles.card}>
              <View style={styles.image} />
              <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <View style={styles.info}>
                <View style={styles.title} />
                <View style={styles.price} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 12,
      alignItems: 'center',
    },
    shadowBox: {
      width: cardWidth,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      width: '100%',
    },
    image: {
      height: 200,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 4,
    },
    info: {
      padding: 12,
    },
    title: {
      width: '60%',
      height: 22,
      borderRadius: 4,
      marginBottom: 8,
    },
    price: {
      width: '30%',
      height: 18,
      borderRadius: 4,
    },
  });
