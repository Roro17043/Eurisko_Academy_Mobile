// storage/tokenStorage.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await EncryptedStorage.setItem(
      'auth_tokens',
      JSON.stringify({ accessToken, refreshToken })
    );
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
};

export const getTokens = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const data = await EncryptedStorage.getItem('auth_tokens');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load tokens:', error);
    return null;
  }
};

export const removeTokens = async () => {
  try {
    await EncryptedStorage.removeItem('auth_tokens');
  } catch (error) {
    console.error('Failed to remove tokens:', error);
  }
};
