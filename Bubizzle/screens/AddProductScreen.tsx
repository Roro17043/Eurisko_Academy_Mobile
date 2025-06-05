import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import {useTheme} from '../context/ThemeContext';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../storage/RTKstore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/RootParamNavigation';
import FormScreenWrapper from '../components/FormScreenWrapper';
import {reverseGeocode} from '../services/geocoding';
import mime from 'mime';
import {
  updateField,
  resetAddProduct,
} from '../storage/RTKstore/slices/addProductSlice';

type FormDataType = z.infer<typeof schema>;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a valid number',
  }),
  location: z.any().refine(val => val && val.latitude && val.longitude, {
    message: 'Location is required',
  }),
});

export default function AddProductScreen() {
  const {isDarkMode} = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const product = useSelector((state: RootState) => state.addProduct);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddProduct'>>();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price, // 🔁 Fixes undefined
      location: product.location,
    },
  });

  useEffect(() => {
    if (route.params?.location) {
      const loc = route.params.location;
      dispatch(updateField({key: 'location', value: loc}));
      setValue('location', loc);
      reverseGeocode(loc.latitude, loc.longitude).then(address => {
        dispatch(updateField({key: 'locationName', value: address}));
      });
    }
  }, [route.params?.location]);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const takePhoto = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      Toast.show({type: 'error', text1: 'Camera permission denied'});
      return;
    }
    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (
        response.didCancel ||
        response.errorCode ||
        !response.assets?.length
      ) {
        return;
      }

      const image = response.assets[0];
      const uri = image.uri;

      if (uri) {
        dispatch(
          updateField({
            key: 'images',
            value: [...product.images, uri],
          }),
        );
      }
    });
  };

  const pickImages = async () => {
    if (!(await requestGalleryPermission())) return;
    const remaining = 5 - product.images.length;
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: remaining},
      response => {
        if (response.assets?.length) {
          const uris = response.assets
            .map(img => img.uri)
            .filter((uri): uri is string => typeof uri === 'string');
          dispatch(
            updateField({
              key: 'images',
              value: [...product.images, ...uris],
            }),
          );
        }
      },
    );
  };

  const removeImage = (index: number) => {
    const updated = [...product.images];
    updated.splice(index, 1);
    dispatch(updateField({key: 'images', value: updated}));
  };

  const onSubmit = async (data: any) => {
    if (!token) return Alert.alert('You must be logged in.');

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append(
      'location',
      JSON.stringify({
        name: product.locationName || 'LatLng',
        ...data.location,
      }),
    );

    product.images.forEach((uri, index) => {
      const cleanedUri =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');
      formData.append('images', {
        uri: cleanedUri,
        type: mime.getType(uri) || 'image/jpeg',
        name: `image_${index}_${Date.now()}.jpg`,
      });
    });

    try {
      await api.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Toast.show({type: 'success', text1: 'Product uploaded successfully'});
      dispatch(resetAddProduct());
      navigation.reset({
        index: 0,
        routes: [{name: 'TabViews', params: {screen: 'Home'}}],
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: err?.response?.data?.message || 'Unexpected error',
      });
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <FormScreenWrapper>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Title</Text>
          <Controller
            control={control}
            name="title"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={val => {
                  onChange(val);
                  dispatch(updateField({key: 'title', value: val}));
                }}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.error}>{errors.title.message}</Text>
          )}

          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                value={value}
                multiline
                onChangeText={val => {
                  onChange(val);
                  dispatch(updateField({key: 'description', value: val}));
                }}
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
                keyboardType="numeric"
                value={value}
                onChangeText={val => {
                  onChange(val);
                  dispatch(updateField({key: 'price', value: val}));
                }}
              />
            )}
          />

          {errors.price && (
            <Text style={styles.error}>{errors.price.message}</Text>
          )}
          <View style={styles.rowCenter}>
            <Button
              title="Pick Location on Map"
              onPress={() =>
                navigation.navigate('LocationPicker', {from: 'AddProduct'})
              }
            />
          </View>

          {product.location && (
            <Text style={styles.coords}>
              📍 {product.location.latitude.toFixed(5)},{' '}
              {product.location.longitude.toFixed(5)}
            </Text>
          )}

          {errors.location && (
            <Text style={styles.error}>
              {errors.location.message?.toString()}
            </Text>
          )}

          <View style={styles.rowCenter}>
            <TouchableOpacity onPress={pickImages} style={styles.imagePicker}>
              <Ionicons name="image-outline" size={20} color="#fff" />
              <Text style={styles.imagePickerText}>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.imagePicker}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imagePickerText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal>
            {product.images.map((uri, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image source={{uri}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(idx)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.submitButton}>
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormScreenWrapper>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      paddingBottom: 120,
      paddingHorizontal: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 8,
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
      margin: 6,
    },
    imagePickerText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '500',
    },
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
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
    },
    removeText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    submitButton: {
      marginTop: 30,
      marginBottom: 60,
    },
  });
