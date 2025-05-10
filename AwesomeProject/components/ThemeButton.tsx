import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function ThemeButton({ isDarkMode }: { isDarkMode: boolean }) {
  const { toggleTheme, mode } = useTheme();
  const styles = getStyles(isDarkMode);

  const nextIcon =
    mode === 'dark' ? 'moon' : mode === 'light' ? 'sunny' : 'contrast';

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Ionicons name={nextIcon} size={22} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.label}>Theme</Text>
    </>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
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
