import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../RTKstore';
import { useTheme } from '../context/ThemeContext';

// Screens
import ProductScreen from '../screens/ProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import MyProductsScreen from '../screens/MyProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

function getTabBarIcon(
  routeName: string,
  focused: boolean,
  color: string,
  size: number,
  cartCount: number
) {
  let iconName = '';

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Cart':
      iconName = focused ? 'cart' : 'cart-outline';
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

  return (
    <View>
      <Ionicons name={iconName} size={size} color={color} />
      {routeName === 'Cart' && cartCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabNavigator() {
  const { isDarkMode } = useTheme();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size, cartCount),
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#007aff',
        tabBarInactiveTintColor: isDarkMode ? '#888' : 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
          borderTopColor: isDarkMode ? '#333' : '#ccc',
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={ProductScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Add Product" component={AddProductScreen} />
      <Tab.Screen name="My Products" component={MyProductsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
