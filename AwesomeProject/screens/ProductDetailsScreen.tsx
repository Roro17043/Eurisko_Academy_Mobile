import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PixelRatio,
  useWindowDimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import {useTheme} from '../context/ThemeContext';
import AppText from '../components/AppText';


export default function ProductDetailsScreen() {
  const route = useRoute<any>();
  const {title, description, price, images} = route.params;

  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 768;
  const {isDarkMode} = useTheme();

  const themeStyles = getStyles(isDarkMode);

  return (
    <ScreenWrapper
      backgroundColor={isDarkMode ? '#000' : '#f9f9f9'}
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      translucent>
      <ScrollView contentContainerStyle={themeStyles.container}>
        <View
          style={[
            styles.contentWrapper,
            (isLandscape || isTablet) && styles.horizontalLayout,
          ]}>
          <Image
            source={{uri: images[0].url}}
            style={[
              isLandscape || isTablet ? styles.imageLandscape : styles.image,
            ]}
          />

          <View style={styles.body}>
            <AppText style={themeStyles.title}>{title}</AppText>
            <AppText style={styles.price}>{`$${price}`}</AppText>
            <AppText style={themeStyles.description}>{description}</AppText>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.shareButton]}>
                <AppText style={styles.buttonText}>Share</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cartButton]}>
                <AppText style={styles.buttonText}>Add to Cart</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#1c1c1e' : '#f9f9f9',
    },
    title: {
      fontSize: PixelRatio.getFontScale() >= 1.2 ? 24 : 20,
      fontFamily: 'Montserrat-Bold',
      marginBottom: 6,
      color: isDarkMode ? '#fff' : '#222',
    },
    description: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 24,
      color: isDarkMode ? '#ccc' : '#444',
    },
  });

const styles = StyleSheet.create({
  contentWrapper: {
    flexDirection: 'column',
  },
  horizontalLayout: {
    flexDirection: 'row',
    gap: 20,
    padding: 16,
    alignItems: 'flex-start',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  imageLandscape: {
    width: '45%',
    height: '100%',
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    padding: PixelRatio.get() >= 3 ? 20 : 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#007bff',
  },
  cartButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
