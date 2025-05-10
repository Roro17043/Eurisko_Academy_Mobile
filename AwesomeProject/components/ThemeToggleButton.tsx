import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ThemeToggleButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme, mode } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 20 }]}>
      <TouchableOpacity style={styles.fab} onPress={() => setIsMenuOpen(prev => !prev)}>
        <Ionicons
          name={isMenuOpen ? 'chevron-down' : 'settings-outline'}
          size={22}
          color="#fff"
        />
      </TouchableOpacity>

      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <Text style={styles.menuText}>Theme: {mode.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    elevation: 6,
  },
  menu: {
    marginTop: 8,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingVertical: 6,
    width: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    color: '#fff',
    fontWeight: '500',
  },
});
