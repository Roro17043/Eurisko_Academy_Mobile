import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ThemedToastProps = {
  text1?: string;
  text2?: string;
  props: {
    isDarkMode: boolean;
    borderColor?: string;
  };
};

const ThemedToast = ({ text1, text2, props }: ThemedToastProps) => {
  const isDarkMode = props?.isDarkMode;
  const dynamicStyles = getStyles(isDarkMode, props?.borderColor);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {text1 ? (
        <Text style={[styles.text1, dynamicStyles.text1]}>{text1}</Text>
      ) : null}
      {text2 ? (
        <Text style={[styles.text2, dynamicStyles.text2]}>{text2}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderLeftWidth: 6,
    borderRadius: 8,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text2: {
    fontSize: 14,
    marginTop: 2,
  },
});

const getStyles = (isDarkMode: boolean, borderColor?: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#2c2c2e' : '#fff',
      borderLeftColor: borderColor || (isDarkMode ? '#ff453a' : '#ff3b30'),
    },
    text1: {
      color: isDarkMode ? '#fff' : '#000',
    },
    text2: {
      color: isDarkMode ? '#ccc' : '#333',
    },
  });

export default ThemedToast;
