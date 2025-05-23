import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type AppTextInputProps = TextInputProps & {
  error?: string;
};

const AppTextInput = ({ error, style, ...rest }: AppTextInputProps) => {
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        {...rest}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 13,
  },
});

const darkStyles = StyleSheet.create({
  input: {
    ...baseStyle,
    backgroundColor: '#2a2a2d',
    color: '#f1f1f1',
    borderColor: '#444',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 13,
  },
});

export default AppTextInput;
