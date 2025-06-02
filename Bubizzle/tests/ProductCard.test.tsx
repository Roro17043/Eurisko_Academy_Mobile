// tests/ProductCard.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../components/ProductCard';
import { NavigationContainer } from '@react-navigation/native';

const mockProps = {
  title: 'Test Product',
  price: 99.99,
  images: [{ uri: 'https://example.com/image.jpg' }],
  onPress: jest.fn(),
};

const renderWithNavigation = (ui: React.ReactElement) => {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
};

describe('ProductCard', () => {
  it('renders correctly with images', () => {
    const { getByText, getByTestId } = renderWithNavigation(
      <ProductCard {...mockProps} />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
    expect(getByTestId('product-card')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByTestId } = renderWithNavigation(
      <ProductCard {...mockProps} />
    );

    fireEvent.press(getByTestId('product-card'));
    expect(mockProps.onPress).toHaveBeenCalled();
  });

  it('renders fallback text if no image', () => {
    const { getByText } = renderWithNavigation(
      <ProductCard {...mockProps} images={[]} />
    );

    expect(getByText('No Image')).toBeTruthy();
  });
});