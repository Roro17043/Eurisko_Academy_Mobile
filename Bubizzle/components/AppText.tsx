// This is a React Native component that wraps the Text component
// and applies a custom font style. It allows you to pass additional styles and props.


import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

const AppText = ({ style, ...props }: TextProps) => {
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Regular', // ✅ use your custom font name
  },
});

export default AppText;
