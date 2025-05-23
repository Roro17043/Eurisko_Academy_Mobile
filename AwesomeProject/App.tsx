import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './RTKstore';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { Text } from 'react-native';

export default function App() {
  // persistor.purge(); // ⚠️ only temporarily, then remove it

  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <ThemeProvider>
            <RootNavigator />
            <Toast />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
