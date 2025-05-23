import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../RTKstore';
import { RootStackParamList } from './RootParamNavigation';



// Screens
// import ProductsScreen from '../screens/ProductsScreen';
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
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
  {isLoggedIn ? (
    <>
      <Stack.Screen name="TabViews" component={TabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
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
