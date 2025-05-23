import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './RTKstore';
import {ThemeProvider} from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import {Text} from 'react-native';
import ThemedToast from './components/ThemedToast';

const toastConfig = {
  customError: ThemedToast,
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <ThemeProvider>
          <RootNavigator />
          <Toast config={toastConfig} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
