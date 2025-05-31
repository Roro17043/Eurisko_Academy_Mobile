import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './RTKstore';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { Text } from 'react-native';
import ThemedToast from './components/ThemedToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import NotificationInitializer from './services/NotificationInitializer';

const toastConfig = {
  customError: ThemedToast,
};

// ✅ Deep linking config
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      ProductDetails: 'product/:productId',
      // Add other screens here if needed
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              <RootNavigator />
              <NotificationInitializer />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
