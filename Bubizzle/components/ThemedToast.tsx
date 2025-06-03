import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';

type CustomProps = {
  isDarkMode?: boolean;
  borderColor?: string;
};

export const ThemedToast = ({
  text1,
  text2,
  props,
}: BaseToastProps & { props?: CustomProps }) => {
  const isDarkMode = props?.isDarkMode ?? false;
  const borderColor = props?.borderColor;

  const styles = getStyles(isDarkMode, borderColor);

  return (
    <View style={styles.container}>
      {text1 ? <Text style={styles.text1}>{text1}</Text> : null}
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  );
};

const getStyles = (isDarkMode: boolean, borderColor?: string) =>
  StyleSheet.create({
    container: {
      padding: 12,
      borderLeftWidth: 6,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#fff',
      borderLeftColor: borderColor ?? (isDarkMode ? '#ff453a' : '#ff3b30'),
    },
    text1: {
      fontWeight: 'bold',
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    text2: {
      fontSize: 14,
      marginTop: 2,
      color: isDarkMode ? '#ccc' : '#333',
    },
  });
