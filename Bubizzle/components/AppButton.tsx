import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const AppButton = ({ title, onPress, style, textStyle, disabled = false }: AppButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style,
      ]}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3478f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    fontSize: 17,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  disabledText: {
    color: '#e1e1e1',
  },
});

export default AppButton;
