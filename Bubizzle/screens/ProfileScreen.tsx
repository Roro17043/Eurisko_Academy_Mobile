import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import ListScreenWrapper from '../components/ListScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { logout } from '../RTKstore/slices/authSlice';
import ThemeButton from '../components/ThemeButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootParamNavigation';
import api from '../services/api';

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Track if profile needs re-fetching
  const shouldRefetchRef = useRef(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      setUser(response.data.data.user);
      shouldRefetchRef.current = false; // mark as up-to-date
    } catch (err) {
      ToastAndroid.show('Failed to fetch profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetchRef.current) {
        fetchProfile();
      }
    }, [fetchProfile])
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  

  return (
    <ListScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemeButton isDarkMode={isDarkMode} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditProfile', {
                user,
                onUpdated: () => {
                  shouldRefetchRef.current = true; // mark to re-fetch on return
                },
              })
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={isDarkMode ? '#fff' : '#000'}
              style={{ marginRight: 4 }}
            />
            <AppText style={styles.editText}>Edit</AppText>
          </TouchableOpacity>
        </View>

        {user?.profileImage?.url ? (
          <Image source={{ uri: user.profileImage.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons
              name="person-circle-outline"
              size={100}
              color={isDarkMode ? '#888' : '#ccc'}
            />
          </View>
        )}

        <View style={styles.info}>
          <ProfileField label="First Name" value={user?.firstName} isDarkMode={isDarkMode} />
          <ProfileField label="Last Name" value={user?.lastName} isDarkMode={isDarkMode} />
          <ProfileField label="Email" value={user?.email} isDarkMode={isDarkMode} />
        </View>

        <AppButton title="Logout" onPress={handleLogout} style={styles.logoutButton} />
      </View>
    </ListScreenWrapper>
  );
}

function ProfileField({
  label,
  value,
  isDarkMode,
}: {
  label: string;
  value?: string;
  isDarkMode: boolean;
}) {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.field}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.readonlyInput}>{value || '-'}</AppText>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    editText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 30,
    },
    info: {
      width: '100%',
      marginBottom: 20,
    },
    field: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
      marginBottom: 4,
    },
    readonlyInput: {
      fontSize: 16,
      padding: 10,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#f0f0f0',
      color: isDarkMode ? '#fff' : '#000',
    },
    logoutButton: {
      width: '100%',
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 30,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#e0e0e0',
    },
  });
