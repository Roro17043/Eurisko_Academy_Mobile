import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './RootParamNavigation';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="TabViews" component={TabNavigator} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
