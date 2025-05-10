import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import ScreenWrapper from '../components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';

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

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'eurisko',
      password: 'academy2025',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (
      (data.email === 'eurisko' || data.email === 'eurisko@example.com') &&
      data.password === 'academy2025'
    ) {
      navigation.navigate('Verification');
    } else {
      setError('email', {message: 'Invalid email or username'});
      setError('password', {message: 'Check your password'});
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
