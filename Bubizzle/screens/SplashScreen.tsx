import React, { useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { RootState } from '../RTKstore';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const scheme = useColorScheme();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const animation = scheme === 'dark'
    ? require('../assets/splashscreen/Animation - dark mode.json')
    : require('../assets/splashscreen/Animation - light mode.json');

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace(isLoggedIn ? 'TabViews' : 'Login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

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
