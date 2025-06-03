import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  const scheme = useColorScheme();
  const animation = scheme === 'dark'
    ? require('../assets/splashscreen/Animation - dark mode.json')
    : require('../assets/splashscreen/Animation - light mode.json');

  const backgroundStyle =
    scheme === 'dark' ? styles.darkBackground : styles.lightBackground;

  return (
    <View style={[styles.container, backgroundStyle]}>
      <LottieView
        source={animation}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
