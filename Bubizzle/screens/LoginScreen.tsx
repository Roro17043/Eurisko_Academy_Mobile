import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../RTKstore';
import {setCredentials} from '../RTKstore/slices/authSlice';
import api from '../services/api';
import {useThemedToast} from '../services/ShowToast';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import FormScreenWrapper from '../components/FormScreenWrapper';

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
  const {showErrorToast} = useThemedToast();
  const [showPassword, setShowPassword] = useState(false);

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
      const {accessToken, refreshToken} = loginRes.data.data;

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
        }),
      );
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMessage = err?.response?.data?.message;

      if (statusCode === 404) {
        setError('email', {message: 'Email not found'});
        return;
      }

      if (statusCode === 401) {
        setError('password', {message: 'Incorrect password'});
        return;
      }

      // Fallback for all other backend or API-level issues
      const message =
        errorMessage ||
        (statusCode === 521
          ? 'Server is down. Please try again shortly.'
          : 'Login failed. Please try again.');

      showErrorToast(message);
    }
  };

  return (
    <FormScreenWrapper>
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
            <View style={styles.inputWithIcon}>
              <AppTextInput
                placeholder="Password"
                placeholderTextColor={isDarkMode ? '#999' : '#666'}
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(prev => !prev)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={isDarkMode ? '#fff' : '#333'}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        <AppButton title="Login" onPress={handleSubmit(onSubmit)} />

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <AppText style={styles.signupText}>
            Don’t have an account?{' '}
            <AppText style={styles.signupLink}>Sign up</AppText>
          </AppText>
        </TouchableOpacity>
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
      paddingRight: 40,
      borderRadius: 6,
    },
    inputFlex: {
      flex: 1,
    },
    inputWithIcon: {
      position: 'relative',
      marginBottom: 10,
    },

    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: '40%',
      transform: [{translateY: -11}],
      zIndex: 1,
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
