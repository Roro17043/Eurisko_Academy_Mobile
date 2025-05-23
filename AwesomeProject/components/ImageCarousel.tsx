// ImageCarousel.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  PixelRatio,
  ViewToken,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  GestureResponderEvent,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const IMAGE_HEIGHT = screenHeight * 0.3;

let gestureStartX = 0;
let gestureStartY = 0;
let isSwipe = false;

const SWIPE_THRESHOLD = 10;

type ImageItem = { uri: string };
type Props = { images: ImageItem[] };

export default function ImageCarousel({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselScrollEnabled, setCarouselScrollEnabled] = useState(true);
  const flatListRef = useRef<FlatList<ImageItem>>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    gestureStartX = e.nativeEvent.pageX;
    gestureStartY = e.nativeEvent.pageY;
    isSwipe = false;
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - gestureStartX;
    const dy = e.nativeEvent.pageY - gestureStartY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      isSwipe = true;
      setCarouselScrollEnabled(true);
    } else if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      setCarouselScrollEnabled(false);
    }
  };

  const renderItem = ({ item }: { item: ImageItem }) => (
    <Pressable
      onPress={() => {}}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        scrollEnabled={carouselScrollEnabled}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
      />

      <View style={styles.dotsWrapper}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    width: screenWidth,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    marginBottom: PixelRatio.roundToNearestPixel(10),
    backgroundColor: '#000',
    borderRadius: PixelRatio.roundToNearestPixel(12),
  },
  imageWrapper: {
    width: screenWidth,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: PixelRatio.roundToNearestPixel(10),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: PixelRatio.roundToNearestPixel(8),
    height: PixelRatio.roundToNearestPixel(8),
    borderRadius: PixelRatio.roundToNearestPixel(4),
    marginHorizontal: PixelRatio.roundToNearestPixel(4),
  },
  activeDot: {
    backgroundColor: '#fff',
    width: PixelRatio.roundToNearestPixel(10),
    height: PixelRatio.roundToNearestPixel(10),
  },
  inactiveDot: {
    backgroundColor: '#666',
  },
});
