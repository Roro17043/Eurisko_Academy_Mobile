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
