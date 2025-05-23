import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollViewProps,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext'; // 👈 Import theme context

type ScreenWrapperProps = {
  children: React.ReactNode;
  scroll?: boolean;
  backgroundColor?: string;
  translucent?: boolean;
  barStyle?: 'dark-content' | 'light-content';
  scrollViewProps?: ScrollViewProps;
  keyboardVerticalOffset?: number;
  disableScrollWrap?: boolean;
};

export default function ScreenWrapper({
  children,
  scroll = false,
  backgroundColor,
  translucent = false,
  barStyle,
  scrollViewProps = {},
  keyboardVerticalOffset = -80,
  disableScrollWrap = false,
}: ScreenWrapperProps) {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const bgColor = backgroundColor ?? (isDarkMode ? '#1c1c1e' : '#fff');
  const statusBarStyle = barStyle ?? (isDarkMode ? 'light-content' : 'dark-content');
  const paddingTop = translucent ? insets.top : 0;
  const dynamicStyles = getDynamicStyles(bgColor, paddingTop);

  const Wrapper = scroll && !disableScrollWrap ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        translucent={translucent}
        backgroundColor={translucent ? 'transparent' : bgColor}
      />

      {scroll && !disableScrollWrap ? (
        <Wrapper
          style={dynamicStyles.wrapper}
          contentContainerStyle={dynamicStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </Wrapper>
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Wrapper style={dynamicStyles.wrapper}>{children}</Wrapper>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

const getDynamicStyles = (backgroundColor: string, paddingTop: number) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor,
      paddingTop,
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor,
      paddingTop,
    },
  });
