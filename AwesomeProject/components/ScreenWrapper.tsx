// components/ScreenWrapper.tsx
// Used to wrap screens with a consistent layout and styling
// Used for the status bar and safe area view
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import  SettingsFAB from '../components/SettingsFAB';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  barStyle?: 'dark-content' | 'light-content';
  translucent?: boolean;
};

export default function ScreenWrapper({
  children,
  backgroundColor,
  barStyle,
  translucent = false,
}: Props) {
  const { isDarkMode } = useTheme();

  const bg = backgroundColor ?? (isDarkMode ? '#000' : '#f1f1f1');
  const bar = barStyle ?? (isDarkMode ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={bar}
        translucent={translucent}
        backgroundColor={translucent ? 'transparent' : bg}
      />
      {children}
      <SettingsFAB />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
