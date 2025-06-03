import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../context/ThemeContext';
import FormScreenWrapper from '../components/FormScreenWrapper';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';
import Toast from 'react-native-toast-message';

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerificationScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {return;}
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Submit OTP
  const onSubmit = async (data: VerificationFormData) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/verify-otp', {
        email,
        otp: data.code,
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result?.data?.message || 'Verification failed');
      }

      Toast.show({
        type: 'success',
        text1: 'Verified!',
        text2: 'Your account has been verified.',
        position: 'top',
      });

      navigation.navigate('Login');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err?.response?.data?.message || err.message || 'Something went wrong.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await api.post('/auth/resend-verification-otp', { email });

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new code was sent to your email.',
        position: 'top',
      });

      setTimer(60);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Resend',
        text2: err?.response?.data?.message || err.message || 'Something went wrong.',
        position: 'top',
      });
    }
  };

  return (
    <FormScreenWrapper>
      <View style={styles.container}>
        <AppText style={styles.title}>Enter OTP Code</AppText>

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              placeholder="123456"
              keyboardType="numeric"
              maxLength={6}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              error={errors.code?.message}
            />
          )}
        />

        <AppText style={styles.timerText}>
          {timer > 0 ? `OTP expires in 00:${String(timer).padStart(2, '0')}` : ''}
        </AppText>

        <AppButton title="Verify" onPress={handleSubmit(onSubmit)} disabled={isLoading} />
        <AppButton
          title="Resend OTP"
          onPress={handleResendOtp}
          disabled={timer > 0}
          style={styles.resendButton}
        />
      </View>
    </FormScreenWrapper>
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
      marginBottom: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      color: isDarkMode ? '#f1f1f1' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      color: isDarkMode ? '#f1f1f1' : '#000',
      padding: 15,
      fontSize: 20,
      letterSpacing: 10,
      textAlign: 'center',
      marginBottom: 10,
      borderRadius: 8,
      fontFamily: 'Montserrat-Regular',
    },
    timerText: {
      textAlign: 'center',
      color: isDarkMode ? '#aaa' : '#555',
      marginBottom: 16,
      fontSize: 14,
    },
    resendButton: {
      marginTop: 10,
      backgroundColor: '#666',
    },
  });
