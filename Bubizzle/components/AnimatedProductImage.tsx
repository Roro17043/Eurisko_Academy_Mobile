// components/AnimatedProductImage.tsx
import React from 'react';
import { TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  uri: string;
  onLongPress: () => void;
};

export default function AnimatedProductImage({ uri, onLongPress }: Props) {
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.05);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.Image
        source={{ uri }}
        style={[{ width, height: 300, resizeMode: 'cover' }, animatedStyle]}
      />
    </TouchableOpacity>
  );
}
