import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Alert, Text} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSelector} from 'react-redux';
import {RootState} from '../RTKstore';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../services/api';
import FormScreenWrapper from '../components/FormScreenWrapper';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  location: z.any().refine(val => val && val.latitude && val.longitude, {
    message: 'Location is required',
  }),
  locationName: z.string().min(1, 'Location name is required'),
});

type FormData = z.infer<typeof schema>;

export default function EditProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const productId = route.params?.productId;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const p = res.data.data;
        const formatted = {
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          locationName: p.location?.name || '',
        };
        setInitialData(formatted);
        setSelectedLocation(p.location);
        reset(formatted);
      } catch (err) {
        Alert.alert('Error', 'Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, reset, accessToken]);

  useEffect(() => {
    if (route.params?.location) {
      setSelectedLocation(route.params.location);
      setValue('location', route.params.location);
    }
  }, [route.params?.location, setValue]);

  const onSubmit = async (formData: FormData) => {
    if (!selectedLocation) {
      Alert.alert('Location is required');
      return;
    }

    const updatedData = {
      ...formData,
      location: {
        name: formData.locationName,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
    };

    try {
      await api.put(`/products/${productId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      Alert.alert('Success', 'Product updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    }
  };

  if (loading || !initialData) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <FormScreenWrapper>
      <View style={styles.container}>
        <Controller
          control={control}
          name="title"
          render={({field: {onChange, value}}) => (
            <AppTextInput
              placeholder="Title"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({field: {onChange, value}}) => (
            <AppTextInput
              placeholder="Description"
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({field: {onChange, value}}) => (
            <AppTextInput
              placeholder="Price"
              value={String(value)}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="locationName"
          render={({field: {onChange, value}}) => (
            <AppTextInput
              placeholder="Location Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.locationName && (
          <Text style={styles.errorText}>{errors.locationName.message}</Text>
        )}

        <AppButton
          title="Pick New Location"
          onPress={() =>
            navigation.navigate('LocationPicker', {
              from: 'EditProduct',
              productId,
            })
          }
        />

        {selectedLocation && (
          <Text style={styles.coords}>
            📍 {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
          </Text>
        )}

        <AppButton title="Save Changes" onPress={handleSubmit(onSubmit)} />
      </View>
    </FormScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginBottom: 12,
  },
  coords: {
    marginVertical: 10,
    fontSize: 14,
    color: '#555',
  },
});