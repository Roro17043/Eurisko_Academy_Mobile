import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import ScreenWrapper from '../components/ScreenWrapper';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

const verificationSchema = z.object({
  code: z
    .string()
    .length(4, 'Code must be exactly 4 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerificationScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '1234',
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    if (data.code === '1234') {
      Toast.show({
        type: 'success',
        text1: 'Verification successful!',
        position: 'top',
        visibilityTime: 2000,
      });
      login();
    } else {
      Alert.alert('Error', 'Incorrect code. Please try again.');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText style={styles.title}>Enter Verification Code</AppText>
        {errors.code && <AppText style={styles.error}>{errors.code.message}</AppText>}

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              placeholder="1234"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              keyboardType="numeric"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={4}
            />
          )}
        />

        <AppButton title="Verify" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? '#f1f1f1' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#ccc',
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      color: isDarkMode ? '#f1f1f1' : '#000',
      padding: 15,
      fontSize: 20,
      letterSpacing: 10,
      textAlign: 'center',
      marginBottom: 10,
      borderRadius: 8,
    },
    error: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
  });
