import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import AppText from './AppText';

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
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      {images && images.length > 0 ? (
        <>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </Animated.ScrollView>

          <View style={styles.dotContainer}>
            {images.map((_, index) => (
              <Dot
                key={index}
                index={index}
                scrollX={scrollX}
                isDarkMode={isDarkMode}
                dotStyle={styles.dotBase}
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

const Dot = ({
  index,
  scrollX,
  isDarkMode,
  dotStyle,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  isDarkMode: boolean;
  dotStyle: any;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value / screenWidth,
      [index - 1, index, index + 1],
      [1, 1.3, 1],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value / screenWidth,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
      backgroundColor: isDarkMode ? '#666' : '#007aff',
    };
  });

  return <Animated.View style={[dotStyle, animatedStyle]} />;
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#2a2a2d' : '#ffffff',
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
      color: isDarkMode ? '#aaa' : '#888',
      fontSize: 14,
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: '#e3e3e8',
    },
    dotBase: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    info: {
      padding: 12,
      backgroundColor: '#e3e3e8',
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
