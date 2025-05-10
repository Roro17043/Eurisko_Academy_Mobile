import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}
