import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import ScreenWrapper from '../components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../RTKstore';
import { setCredentials, setMyProducts } from '../RTKstore/slices/authSlice';
import api from '../services/api';

const loginSchema = z.object({
  email: z.union([
    z.string().email('Invalid email'),
    z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .refine(val => !val.includes('@'), {
        message: 'Username must not contain "@" unless it is a valid email',
      }),
  ]),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const {isDarkMode} = useTheme();
  const styles = getStyles(isDarkMode);
  const dispatch = useDispatch<AppDispatch>();


  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'rouhanasalameh83@gmail.com',
      password: '123456',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
  try {
    // Step 1: Login to get tokens
    const loginRes = await api.post('/auth/login', data);
    const { accessToken, refreshToken } = loginRes.data.data;

    // Step 2: Get user profile using token
    const profileRes = await api.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = profileRes.data.data.user;


    // Step 5: Save tokens + user + myProducts in Redux
    dispatch(
      setCredentials({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
        },
      })
    );

    console.log('✅ Login successful, user + products saved');
    // console.log('📦 All fetched products:', allProducts);

    console.log('👤 Current user ID:', user.id);


    // Navigate as usual (e.g., home/dashboard)
    // navigation.navigate('TabViews'); // if needed

  } catch (err: any) {
    const message = err?.response?.data?.message || 'Login failed';
    setError('email', { message: 'Invalid email or username' });
    setError('password', { message: 'Check your password' });
    console.error('❌ Login error:', message);
  }
};



  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText style={styles.title}>Login</AppText>

        {errors.email && (
          <AppText style={styles.error}>{errors.email.message}</AppText>
        )}
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <AppTextInput
              placeholder="Email or Username"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
            />
          )}
        />

        {errors.password && (
          <AppText style={styles.error}>{errors.password.message}</AppText>
        )}
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <AppTextInput
              placeholder="Password"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />

        <AppButton title="Login" onPress={handleSubmit(onSubmit)} />

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <AppText style={styles.signupText}>
            Don’t have an account?{' '}
            <AppText style={styles.signupLink}>Sign up</AppText>
          </AppText>
        </TouchableOpacity>

        <AppButton
          title="Go to Verification"
          onPress={() =>
            navigation.navigate('Verification', {
              email: 'rouhanasalameh83@gmail.com',
            })
          }
        />
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
      color: isDarkMode ? '#fff' : '#1c1c1e',
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? '#2a2a2d' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      padding: 10,
      marginBottom: 10,
      borderRadius: 6,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    signupText: {
      marginTop: 20,
      textAlign: 'center',
      color: isDarkMode ? '#ccc' : '#555',
    },
    signupLink: {
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
  });
