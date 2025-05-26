import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  StyleSheet,
  ScrollViewProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  scrollViewProps?: ScrollViewProps;
};

export default function FormScreenWrapper({ children, scroll = true, scrollViewProps = {} }: Props) {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? '#1c1c1e' : '#fff';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {scroll ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, padding: 20 }}
              keyboardShouldPersistTaps="handled"
              {...scrollViewProps}
            >
              {children}
            </ScrollView>
          ) : (
            <>{children}</>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
