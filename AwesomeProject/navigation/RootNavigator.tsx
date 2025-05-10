import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Screens
import ProductsScreen from '../screens/ProductsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={ProductsScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
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
