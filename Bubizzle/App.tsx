import React, { useEffect, useState } from 'react';
import { Text, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './storage/RTKstore';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { ThemedToast } from './components/ThemedToast';
import SplashScreen from './screens/SplashScreen';
import NotificationInitializer from './services/NotificationInitializer';
import { initializeOneSignal, removeOneSignalListeners } from './services/onesignalSetup';
import { navigationRef } from './navigation/navigationRef'; // ✅ make sure this is correct

const toastConfig = {
  success: (props: BaseToastProps) => <ThemedToast {...props} />,
  error: (props: BaseToastProps) => <ThemedToast {...props} />,
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeOneSignal();
    return () => removeOneSignalListeners();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Deep link handler
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const match = url.match(/product\/(.+)/);
      if (match?.[1]) {
        const productId = match[1];
        navigationRef.current?.resetRoot({
          index: 1,
          routes: [
            { name: 'TabViews' },
            { name: 'ProductDetails', params: { productId } },
          ],
        });
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  if (showSplash) return <SplashScreen />;

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
