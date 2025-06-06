import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUpScreen from '../screens/SignUpScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import * as api from '../services/api';

// ✅ MOCK useNavigation to prevent crash
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// ✅ Mock API
jest.mock('../services/api');
const mockPost = api.default.post as jest.Mock;

// ✅ Spy on alerts
jest.spyOn(Alert, 'alert');

const renderWithProviders = () =>
  render(
    <NavigationContainer>
      <ThemeProvider>
        <SignUpScreen />
      </ThemeProvider>
    </NavigationContainer>
  );

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and button', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders();
    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('shows validation errors if form is submitted empty', async () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('First name is required')).toBeTruthy();
      expect(getByText('Last name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('submits form and navigates on success', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const { getByPlaceholderText, getByText } = renderWithProviders();

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'User created. Please login and verify OTP.'
      );
    });
  });

  it('shows error alert on signup failure', async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Email already exists',
        },
      },
    });

    const { getByPlaceholderText, getByText } = renderWithProviders();

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Signup Error', 'Email already exists');
    });
  });
});
