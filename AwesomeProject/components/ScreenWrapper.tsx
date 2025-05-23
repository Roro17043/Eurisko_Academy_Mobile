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

type ScreenWrapperProps = {
  children: React.ReactNode;
  scroll?: boolean;
  backgroundColor?: string;
  translucent?: boolean;
  barStyle?: 'dark-content' | 'light-content';
  scrollViewProps?: ScrollViewProps;
  keyboardVerticalOffset?: number;
  disableScrollWrap?: boolean; // 👈 NEW
};

export default function ScreenWrapper({
  children,
  scroll = false,
  backgroundColor = '#fff',
  translucent = false,
  barStyle = 'dark-content',
  scrollViewProps = {},
  keyboardVerticalOffset = -80,
  disableScrollWrap = false, // 👈 DEFAULT false
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = translucent ? insets.top : 0;
  const dynamicStyles = getDynamicStyles(backgroundColor, paddingTop);

  const Wrapper = scroll && !disableScrollWrap ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        backgroundColor={translucent ? 'transparent' : backgroundColor}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Wrapper
            style={dynamicStyles.wrapper}
            {...(scroll && !disableScrollWrap
              ? {
                  contentContainerStyle: dynamicStyles.scrollContainer,
                  keyboardShouldPersistTaps: 'handled',
                  ...scrollViewProps,
                }
              : {})}
          >
            {children}
          </Wrapper>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
