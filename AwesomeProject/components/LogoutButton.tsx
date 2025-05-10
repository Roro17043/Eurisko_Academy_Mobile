import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import AppText from '../components/AppText';


export default function LogoutButton({ isDarkMode }: { isDarkMode: boolean }) {
  const { logout } = useAuth();
  const styles = getStyles(isDarkMode);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Ionicons name="exit-outline" size={22} style={styles.icon} />
      </TouchableOpacity>
      <AppText style={styles.label}>Logout</AppText>
    </>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    button: {
      backgroundColor: isDark ? '#444' : '#eee',
      padding: 12,
      borderRadius: 30,
      elevation: 4,
    },
    icon: {
      color: isDark ? '#fff' : '#000',
    },
    label: {
      color: isDark ? '#fff' : '#000',
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
  });
