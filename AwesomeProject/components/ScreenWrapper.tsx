import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type ScreenWrapperProps = {
  children: React.ReactNode;
  scroll?: boolean;
  backgroundColor?: string;
  translucent?: boolean;
  barStyle?: 'dark-content' | 'light-content';
  scrollViewProps?: ScrollViewProps;
};

export default function ScreenWrapper({
  children,
  scroll = false,
  backgroundColor = '#fff',
  translucent = false,
  barStyle = 'dark-content',
  scrollViewProps = {},
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets(); // ✅ Get safe area values
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        backgroundColor={translucent ? 'transparent' : backgroundColor}
      />
      <Wrapper
        style={[
          styles.wrapper,
          { backgroundColor, paddingTop: translucent ? insets.top : 0 }, // ✅ Add safe top padding if translucent
        ]}
        {...(scroll
          ? {
              contentContainerStyle: {
                flexGrow: 1,
                paddingTop: translucent ? insets.top : 0, // ✅ Also add to ScrollView's content
              },
              ...scrollViewProps,
            }
          : {})}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
});
