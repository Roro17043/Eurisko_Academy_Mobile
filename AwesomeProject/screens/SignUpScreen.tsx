import React, {useState} from 'react';
import {Text, TextInput, Button, StyleSheet, ScrollView} from 'react-native';
import {z} from 'zod';
import ScreenWrapper from '../components/ScreenWrapper';
import {useTheme} from '../context/ThemeContext';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Zod schema
const signUpSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export default function SignUpScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const {isDarkMode} = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<any>();

  const handleChange = (field: string, value: string) => {
    setForm({...form, [field]: value});
    setErrors({...errors, [field]: ''});
  };

  const handleSubmit = () => {
    const result = signUpSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: {[key: string]: string} = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    console.log('User signed up:', form);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
  <Text style={styles.title}>Sign Up</Text>

  {errors.name && <Text style={styles.error}>{errors.name}</Text>}
  <TextInput
    placeholder="Name"
    placeholderTextColor={isDarkMode ? '#999' : '#666'}
    style={styles.input}
    value={form.name}
    onChangeText={value => handleChange('name', value)}
  />

  {errors.email && <Text style={styles.error}>{errors.email}</Text>}
  <TextInput
    placeholder="Email"
    placeholderTextColor={isDarkMode ? '#999' : '#666'}
    style={styles.input}
    value={form.email}
    onChangeText={value => handleChange('email', value)}
    autoCapitalize="none"
  />

  {errors.password && <Text style={styles.error}>{errors.password}</Text>}
  <TextInput
    placeholder="Password"
    placeholderTextColor={isDarkMode ? '#999' : '#666'}
    style={styles.input}
    value={form.password}
    onChangeText={value => handleChange('password', value)}
    secureTextEntry
  />

  {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
  <TextInput
    placeholder="Phone Number"
    placeholderTextColor={isDarkMode ? '#999' : '#666'}
    style={styles.input}
    value={form.phone}
    onChangeText={value => handleChange('phone', value)}
    keyboardType="phone-pad"
  />

  <Button title="Register" onPress={handleSubmit} />

  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <Text style={styles.loginText}>
      Already have an account? <Text style={styles.loginLink}>Login</Text>
    </Text>
  </TouchableOpacity>
</ScrollView>

    </ScreenWrapper>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flexGrow: 1,
      justifyContent: 'center',
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
      padding: 10,
      borderRadius: 6,
      marginBottom: 10,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    loginText: {
      marginTop: 20,
      textAlign: 'center',
      color: isDarkMode ? '#ccc' : '#555',
    },
    loginLink: {
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
  });
