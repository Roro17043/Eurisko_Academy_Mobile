import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../storage/RTKstore';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../services/api';
import FormScreenWrapper from '../components/FormScreenWrapper';
import {
  setAllFields,
  updateField,
  resetEditProduct,
} from '../storage/RTKstore/slices/editProductSlice';
import { reverseGeocode } from '../services/geocoding';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  location: z.any().refine(val => val && val.latitude && val.longitude, {
    message: 'Location is required',
  }),
});

type FormData = z.infer<typeof schema>;

export default function EditProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const productId = route.params?.productId;

  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const productState = useSelector((state: RootState) => state.editProduct);

  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (productState.productId === productId) {
      reset(productState);
      setSelectedLocation(productState.location);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const p = res.data.data;
        const formatted = {
          productId,
          title: p.title,
          description: p.description,
          price: String(p.price),
          location: p.location,
          locationName: p.location?.name || '',
          images: p.images.map((img: any) => img.url),
        };
        dispatch(setAllFields(formatted));
        reset(formatted);
        setSelectedLocation(p.location);
      } catch (err) {
        Alert.alert('Error', 'Could not load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (route.params?.location) {
      const loc = route.params.location;
      setSelectedLocation(loc);
      setValue('location', loc);
      dispatch(updateField({ key: 'location', value: loc }));

      reverseGeocode(loc.latitude, loc.longitude).then(address => {
        dispatch(updateField({ key: 'locationName', value: address }));
      });
    }
  }, [route.params?.location]);

  const onSubmit = async (formData: FormData) => {
    if (!selectedLocation) {
      Alert.alert('Location is required');
      return;
    }

    const updatedData = {
      ...formData,
      location: {
        name: productState.locationName,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
    };

    try {
      await api.put(`/products/${productId}`, updatedData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      Alert.alert('Success', 'Product updated');
      dispatch(resetEditProduct());

      if (route.params?.from === 'MyProducts') {
        navigation.reset({ index: 0, routes: [{ name: 'TabViews' }] });
      } else if (route.params?.from === 'Details') {
        navigation.reset({ index: 0, routes: [{ name: 'ProductDetails', params: { productId } }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'TabViews' }] });
      }
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <FormScreenWrapper>
      <View style={styles.container}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              placeholder="Title"
              value={value}
              onChangeText={(val) => {
                onChange(val);
                dispatch(updateField({ key: 'title', value: val }));
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              placeholder="Description"
              value={value}
              onChangeText={(val) => {
                onChange(val);
                dispatch(updateField({ key: 'description', value: val }));
              }}
              multiline
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              placeholder="Price"
              value={String(value)}
              onChangeText={(val) => {
                onChange(val);
                dispatch(updateField({ key: 'price', value: val }));
              }}
              keyboardType="numeric"
            />
          )}
        />

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

        {productState.locationName ? (
          <Text style={styles.locationName}>🏷️ {productState.locationName}</Text>
        ) : null}

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
  locationName: {
    marginBottom: 14,
    fontSize: 14,
    color: '#666',
  },
});
