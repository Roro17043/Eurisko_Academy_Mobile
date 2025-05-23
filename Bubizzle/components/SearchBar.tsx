// components/SearchBar.tsx

import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import AppTextInput from './AppTextInput';

interface SearchBarProps extends TextInputProps {}

const SearchBar = (props: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <AppTextInput
        placeholder="Search..."
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default SearchBar;
