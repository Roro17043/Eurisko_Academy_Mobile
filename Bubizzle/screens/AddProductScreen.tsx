import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import {useTheme} from '../context/ThemeContext';
import {useSelector} from 'react-redux';
import {RootState} from '../RTKstore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/RootParamNavigation';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be a valid number'),
  location: z.any().refine(val => val && val.latitude && val.longitude, {
    message: 'Location is required',
  }),
});

type FormDataType = z.infer<typeof schema>;

export default function AddProductScreen() {
  const {isDarkMode} = useTheme();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddProduct'>>();
  const [images, setImages] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (route.params?.location) {
      setSelectedLocation(route.params.location);
      setValue('location', route.params.location); // update form state
    }
  }, [route.params?.location]);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Gallery Access Permission',
          message: 'App needs access to your gallery',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const takePhoto = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Camera permission is required.',
        });
        return;
      }
    }

    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.assets && response.assets.length > 0) {
        const newImage = response.assets[0];
        if (images.length >= 5) {
          Toast.show({
            type: 'error',
            text1: 'Limit Reached',
            text2: 'You can only upload up to 5 images.',
          });
          return;
        }
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const pickImages = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {return;}

    const remainingSlots = 5 - images.length;
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remainingSlots,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const selected = response.assets.slice(0, remainingSlots);
          setImages(prev => [...prev, ...selected]);
        }
      },
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormDataType) => {
    if (!token) {
      Alert.alert('Authentication Error', 'You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append(
      'location',
      JSON.stringify({
        name: 'LatLng',
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      }),
    );

    let skippedImages = 0;
    images.forEach((image, index) => {
      const type = image.type || 'image/jpeg';
      if (!allowedTypes.includes(type)) {
        skippedImages++;
        return;
      }

      formData.append('images', {
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
        type,
        name: image.fileName || `image_${index}_${Date.now()}.jpg`,
      });
    });

    if (skippedImages > 0) {
      Toast.show({
        type: 'error',
        text1: 'Unsupported Image Format',
        text2: `Skipped ${skippedImages} image(s). Only JPG and PNG are allowed.`,
      });
    }

    try {
      await api.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product uploaded successfully!',
      });
      reset();
      setImages([]);
      setSelectedLocation(null);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error?.response?.data?.message || 'Unexpected error.',
      });
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      <Text style={styles.label}>Price</Text>
      <Controller
        control={control}
        name="price"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            value={value?.toString()}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
      {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

      <Text style={styles.label}>Location</Text>
      <Button
        title="Pick Location on Map"
        onPress={() =>
          navigation.navigate('LocationPicker', {from: 'AddProduct'})
        }
      />
      {selectedLocation && (
        <Text style={styles.coords}>
          📍 Selected: {selectedLocation.latitude.toFixed(5)},{' '}
          {selectedLocation.longitude.toFixed(5)}
        </Text>
      )}
      {errors.location && (
        <Text style={styles.error}>
          {(errors.location as {message?: string})?.message}
        </Text>
      )}

      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={pickImages} style={styles.imagePicker}>
          <View style={styles.rowAlignCenter}>
            <Ionicons name="image-outline" size={20} color="#fff" />
            <Text style={styles.imagePickerText}>Pick Image</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.imagePicker}>
          <View style={styles.rowAlignCenter}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.imagePickerText}>Take Photo</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.imageNote}>You can upload up to 5 images only.</Text>

      <ScrollView horizontal>
        {images.map((img, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image source={{uri: img.uri}} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(idx)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 40,
      backgroundColor: isDark ? '#121212' : '#fafafa',
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 6,
      marginTop: 16,
      color: isDark ? '#f2f2f2' : '#111',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ccc',
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      color: isDark ? '#fff' : '#000',
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
    },
    error: {
      color: '#f44336',
      fontSize: 12,
      marginTop: 4,
    },
    coords: {
      marginTop: 8,
      fontSize: 13,
      color: isDark ? '#aaa' : '#555',
    },
    imagePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: '#007bff',
      borderRadius: 10,
      marginHorizontal: 6,
    },
    imagePickerText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '500',
    },
    rowAlignCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    imageNote: {
      fontSize: 12,
      color: '#888',
      marginTop: 8,
      textAlign: 'center',
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      marginTop: 16,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    removeButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#e53935',
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      elevation: 2,
    },
    removeText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
