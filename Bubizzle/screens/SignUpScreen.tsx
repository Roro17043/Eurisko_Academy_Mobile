import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import FormScreenWrapper from '../components/FormScreenWrapper';
import {useTheme} from '../context/ThemeContext';

import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../services/api'; // Your configured Axios instance

// -------------------- Schema --------------------

const SignUpSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

// -------------------- Component --------------------

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = React.useState(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const {
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await api.post('/auth/signup', data); // JSON payload

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

        <AppTextInput
          placeholder="First Name"
          onChangeText={text => setValue('firstName', text)}
          error={errors.firstName?.message}
        />
        <AppTextInput
          placeholder="Last Name"
          onChangeText={text => setValue('lastName', text)}
          error={errors.lastName?.message}
        />
        <AppTextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={text => setValue('email', text)}
          error={errors.email?.message}
        />
        <View style={styles.passwordContainer}>
          <AppTextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={text => setValue('password', text)}
            error={errors.password?.message}
            style={styles.passwordInput}
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

// -------------------- Styles --------------------

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      padding: 20,
      justifyContent: 'center',
      flexGrow: 1,
    },
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

