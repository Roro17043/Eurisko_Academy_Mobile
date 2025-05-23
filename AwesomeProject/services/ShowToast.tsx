import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';

export const useThemedToast = () => {
  const { isDarkMode } = useTheme();

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'customError',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      props: {
        isDarkMode,
        borderColor: isDarkMode ? '#ff453a' : '#ff3b30',
      },
    });
  };

  return { showErrorToast };
};
