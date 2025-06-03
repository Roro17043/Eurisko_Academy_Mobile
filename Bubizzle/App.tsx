import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './RTKstore';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast, {BaseToastProps} from 'react-native-toast-message';
import {ThemedToast} from './components/ThemedToast';

import NotificationInitializer from './services/NotificationInitializer';
import { initializeOneSignal, removeOneSignalListeners } from './services/onesignalSetup';

const toastConfig = {
  success: (props: BaseToastProps) => <ThemedToast {...props} />,
  error: (props: BaseToastProps) => <ThemedToast {...props} />,
};

export default function App() {
  useEffect(() => {
    initializeOneSignal();
    return () => removeOneSignalListeners();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
          <ThemeProvider>
            <NotificationInitializer />
            <RootNavigator />
            <Toast config={toastConfig} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
