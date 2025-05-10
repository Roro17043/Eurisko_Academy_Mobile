// This is a React Native component that wraps the TextInput component
// and applies a custom font style. It allows you to pass additional styles and props.


import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AppTextInput = (props: TextInputProps) => {
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
    />
  );
};

const baseStyle = {
  fontFamily: 'Montserrat-Regular',
  fontSize: 16,
  padding: 12,
  borderWidth: 1,
  borderRadius: 10,
};

const lightStyles = StyleSheet.create({
  input: {
    ...baseStyle,
    backgroundColor: '#f1f1f1',
    color: '#000',
    borderColor: '#ccc',
  },
});

const darkStyles = StyleSheet.create({
  input: {
    ...baseStyle,
    backgroundColor: '#2a2a2d',
    color: '#f1f1f1',
    borderColor: '#444',
  },
});

export default AppTextInput;
