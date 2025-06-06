import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import FormScreenWrapper from '../components/FormScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../services/api';

const SignUpSchema = z.object({
  firstName: z.string().trim().nonempty('First name is required'),
  lastName: z.string().trim().nonempty('Last name is required'),
  email: z.string().trim().nonempty('Email is required').email('Invalid email'),
  password: z.string().trim().nonempty('Password is required').min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = React.useState(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  console.log('Validation Errors:', errors);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await api.post('/auth/signup', data);
      if (response.data?.success) {
        Alert.alert('Success', 'User created. Please login and verify OTP.');
        navigation.navigate('Login');
      } else {
        throw new Error('Signup failed');
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Signup failed';
      Alert.alert('Signup Error', message);
    }
  };

  return (
    <FormScreenWrapper>
      <Text style={styles.title}>Sign Up</Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            placeholder="First Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            placeholder="Last Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.lastName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!showPassword}
              error={errors.password?.message}
              style={styles.passwordInput}
            />
          )}
        />
        <Icon
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color="#888"
          onPress={() => setShowPassword(prev => !prev)}
          style={styles.eyeIcon}
        />
      </View>

      <AppButton title="Register" onPress={handleSubmit(onSubmit)} />

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Verification')}>
          Login
        </Text>
      </Text>
    </FormScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      color: isDarkMode ? '#f1f1f1' : '#000',
    },
    loginText: {
      marginTop: 20,
      textAlign: 'center',
      color: isDarkMode ? '#ccc' : '#555',
    },
    loginLink: {
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#007BFF',
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 18,
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    passwordInput: {
      paddingRight: 40,
    },
  });
