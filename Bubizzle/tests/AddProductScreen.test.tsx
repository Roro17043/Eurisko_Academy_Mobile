import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddProductScreen from '../screens/AddProductScreen';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { NavigationContainer } from '@react-navigation/native';

const mockStore = configureStore([]);
const store = mockStore({
  auth: { accessToken: 'mockToken' },
  addProduct: {
    title: '',
    description: '',
    price: '',
    location: null,
    locationName: '',
    images: [],
  },
});

jest.mock('../services/api', () => ({
  post: jest.fn().mockResolvedValue({}),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

describe('AddProductScreen', () => {
  it('renders all fields and buttons', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <AddProductScreen />
        </NavigationContainer>
      </Provider>
    );

    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('Pick Location on Map')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('shows validation errors on empty submission', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <AddProductScreen />
        </NavigationContainer>
      </Provider>
    );

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Title is required')).toBeTruthy();
      expect(getByText('Description is required')).toBeTruthy();
      expect(getByText('Price must be a valid number')).toBeTruthy();
      expect(getByText('Location is required')).toBeTruthy();
    });
  });
});
