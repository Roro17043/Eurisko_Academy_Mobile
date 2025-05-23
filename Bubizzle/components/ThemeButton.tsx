import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import AppText from './AppText'; // make sure this path is correct
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ThemeButton({ isDarkMode }: { isDarkMode: boolean }) {
  const { toggleTheme, mode } = useTheme();
  const styles = getStyles(isDarkMode);
  const insets = useSafeAreaInsets(); // ✅ Add this

  const nextIcon =
    mode === 'dark' ? 'moon' : mode === 'light' ? 'sunny' : 'contrast';

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}> 
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Ionicons name={nextIcon} size={22} style={styles.icon} />
      </TouchableOpacity>
      <AppText style={styles.label}>Theme</AppText>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
    },
    button: {
      backgroundColor: isDark ? '#444' : '#eee',
      padding: 12,
      borderRadius: 30,
      elevation: 4,
    },
    icon: {
      color: isDark ? '#fff' : '#000',
    },
    label: {
      color: isDark ? '#fff' : '#000',
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
  });
