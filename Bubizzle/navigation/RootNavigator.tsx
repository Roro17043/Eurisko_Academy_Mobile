import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../storage/RTKstore';
import { navigationRef } from './navigationRef';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductDetailsScreen from '../screens/DetailsScreen';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';

const Stack = createNativeStackNavigator();

// ✅ Deep linking config
const linking = {
  prefixes: ['myapp://'], // or your custom domain/app scheme
  config: {
    screens: {
      ProductDetails: 'product/:productId',
      // Add more screens if needed
    },
  },
};

export default function RootNavigator() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const rehydrated = useSelector((state: RootState) => state._persist?.rehydrated);

  if (!rehydrated) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="TabViews" component={TabNavigator} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="LocationPicker" component={LocationPickerScreen} options={{ animation: 'slide_from_bottom' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
