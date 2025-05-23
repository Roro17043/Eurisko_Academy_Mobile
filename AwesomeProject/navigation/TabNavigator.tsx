import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProductScreen from '../screens/ProductsScreen';
import AddProductScreen from '../screens/dummyscreens/AddProductScreen';
import MyProductsScreen from '../screens/MyProductsScreen';
import ProfileScreen from '../screens/dummyscreens/ProfileScreen';
import DummyScreen from '../screens/dummyscreens/DummyScreen';

const Tab = createBottomTabNavigator();

function getTabBarIcon(routeName: string, focused: boolean, color: string, size: number) {
  let iconName = '';

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Dummy':
      iconName = focused ? 'list' : 'list-outline';
      break;
    case 'Add Product':
      iconName = focused ? 'add-circle' : 'add-circle-outline';
      break;
    case 'My Products':
      iconName = focused ? 'cube' : 'cube-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'ellipse';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={ProductScreen} />
      <Tab.Screen name="Dummy" component={DummyScreen} />
      <Tab.Screen name="Add Product" component={AddProductScreen} />
      <Tab.Screen name="My Products" component={MyProductsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
