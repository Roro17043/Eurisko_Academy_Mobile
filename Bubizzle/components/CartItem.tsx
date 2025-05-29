import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import AppText from './AppText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function CartItem({ item, onRemove, isDarkMode }: any) {
  const translateX = useSharedValue(0);
  const styles = getStyles(isDarkMode);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value < 0 ? -SCREEN_WIDTH : SCREEN_WIDTH;
        translateX.value = withSpring(direction, {}, () => {
          runOnJS(onRemove)(item._id);
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, rStyle]}>
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
          <AppText style={styles.title}>{item.title}</AppText>
          <AppText style={styles.details}>
            ${item.price} × {item.quantity} = ${item.price * item.quantity}
          </AppText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dark ? '#2c2c2e' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
      elevation: 2,
    },
    thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      color: dark ? '#fff' : '#000',
    },
    details: {
      color: dark ? '#ccc' : '#555',
      marginTop: 4,
    },
  });
