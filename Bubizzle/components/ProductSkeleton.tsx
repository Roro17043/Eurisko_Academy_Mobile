import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 56; // considering your horizontal padding (28 * 2)

export default function ProductSkeleton() {
  return (
    <View style={styles.wrapper}>
      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.shadowBox}>
          <SkeletonPlaceholder borderRadius={12}>
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

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
  },
  shadowBox: {
    borderRadius: 12,
    backgroundColor: '#2a2a2d',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#333',
  },
  image: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 200,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
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
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  price: {
    width: '30%',
    height: 16,
    borderRadius: 4,
  },
});
