import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../RTKstore';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import ScreenWrapper from '../components/ScreenWrapper';
import api from '../services/api';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
});

type FormData = z.infer<typeof schema>;

export default function EditProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const productId = route.params?.productId;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
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
        };
        setInitialData(formatted);
        reset(formatted);
      } catch (err) {
        Alert.alert('Error', 'Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, reset, accessToken]);

  const onSubmit = async (formData: FormData) => {
    try {
      await api.put(`/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // ✅ Refetch all my products
    //   const refreshed = await api.get('/products/me', {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    //   dispatch(setMyProducts(refreshed.data.data));

      Alert.alert('Success', 'Product updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Update failed');
      console.error('Update error:', err);
    }
  };

  if (loading || !initialData) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
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
          render={({ field: { onChange, value } }) => (
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
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              placeholder="Price"
              value={String(value)}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        <AppButton title="Save Changes" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
