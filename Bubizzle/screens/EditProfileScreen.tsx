import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormScreenWrapper from '../components/FormScreenWrapper';

export default function EditProfileScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const route = useRoute();
  const { user, onUpdated }: any = route.params; // include onUpdated callback

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [profileImage, setProfileImage] = useState<any>(
    user.profileImage?.url ? { uri: user.profileImage.url } : null
  );
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0]);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {return;}

    const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);

    if (profileImage && profileImage.uri && !profileImage.uri.startsWith('https://')) {
      const uri = Platform.OS === 'android'
        ? profileImage.uri.replace('file://', '')
        : profileImage.uri;

      formData.append('profileImage', {
        uri,
        type: profileImage.type || 'image/jpeg',
        name: profileImage.fileName || `profile_${Date.now()}.jpg`,
      });
    }

    try {
      await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });

      if (typeof onUpdated === 'function') {
        onUpdated(); // Notify ProfileScreen to refetch
      }

      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update',
        text2: err?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreenWrapper>
      <View style={styles.imageContainer}>
        {profileImage?.uri ? (
          <Image source={{ uri: profileImage.uri }} style={styles.image} />
        ) : (
          <Ionicons name="person-circle-outline" size={120} color={isDarkMode ? '#888' : '#ccc'} />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.imageButton} onPress={pickFromGallery}>
          <Ionicons name="images-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.imageButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.imageButtonText}>Take a New Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Button
        title={loading ? 'Saving...' : 'Save'}
        onPress={handleSave}
        disabled={loading}
      />
    </FormScreenWrapper>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    label: {
      color: isDark ? '#fff' : '#000',
      fontWeight: 'bold',
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
      color: isDark ? '#fff' : '#000',
      borderRadius: 8,
      padding: 10,
      marginTop: 4,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 8,
    },
    buttonRow: {
      gap: 10,
      marginBottom: 20,
    },
    imageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#007aff',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    imageButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    icon: {
      marginRight: 8,
    },
  });
