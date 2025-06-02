import {useEffect} from 'react';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {AppState} from 'react-native';

export default function NotificationInitializer() {
  useEffect(() => {
    const requestPermissionAndSchedule = async () => {
      // Request permissions (Android 13+)
      await notifee.requestPermission();

      // Create a channel (Android)
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Schedule notification every 5 minutes
      const interval = setInterval(async () => {
        await notifee.displayNotification({
          title: '🔍 Looking for something?',
          body: 'Come check for it!',
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
          },
        });
      },60 * 1000); // 1 minutes

      // Clear on app close or background
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState !== 'active') {
          clearInterval(interval);
        }
      };

      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );

      return () => {
        clearInterval(interval);
        subscription.remove();
      };
    };

    requestPermissionAndSchedule();
  }, []);

  return null;
}