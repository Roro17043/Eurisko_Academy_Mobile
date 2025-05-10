import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import ThemeButton from './ThemeButton';
import LogoutButton from './LogoutButton';

export default function SettingsFAB() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const styles = getStyles(isDarkMode);

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setOpen(false);
      anim1.setValue(0);
      anim2.setValue(0);
    });
    return unsubscribe;
  }, [navigation, anim1, anim2]);

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    setOpen(!open);

    Animated.parallel([
      Animated.timing(anim1, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(anim2, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 30 }]}>
      {/* Logout FAB */}
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [
              {
                translateY: anim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -140],
                }),
              },
            ],
            opacity: anim2,
          },
        ]}
      >
        <LogoutButton isDarkMode={isDarkMode} />
      </Animated.View>

      {/* Theme FAB */}
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [
              {
                translateY: anim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -70],
                }),
              },
            ],
            opacity: anim1,
          },
        ]}
      >
        <ThemeButton isDarkMode={isDarkMode} />
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity style={styles.fabMain} onPress={toggleMenu}>
        <Ionicons
          name={open ? 'chevron-down' : 'settings-outline'}
          size={22}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: 20,
      alignItems: 'center',
    },
    fabMain: {
      backgroundColor: isDark ? '#333' : '#ddd',
      padding: 14,
      borderRadius: 30,
      elevation: 6,
      zIndex: 5,
    },
    fabWrapper: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 0,
    },
    icon: {
      color: isDark ? '#fff' : '#000',
    },
  });
