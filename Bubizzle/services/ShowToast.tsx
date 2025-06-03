import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';

export const useThemedToast = () => {
  const { isDarkMode } = useTheme();

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
      props: {
        isDarkMode,
        borderColor: isDarkMode ? '#ff453a' : '#ff3b30',
      },
    });
  };

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
      props: {
        isDarkMode,
        borderColor: isDarkMode ? '#32d74b' : '#34c759',
      },
    });
  };

  return { showErrorToast, showSuccessToast };
};
