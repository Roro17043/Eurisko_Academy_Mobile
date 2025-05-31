import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootParamNavigation';
import notifee, { EventType } from '@notifee/react-native';

export default function NotificationInitializer() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const setupNotifications = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('📱 FCM Token:', token);

        await messaging().subscribeToTopic('all');
        console.log('✅ Subscribed to topic: all');
      } else {
        Alert.alert('Notification permission denied');
      }

      // Create Android notification channel (required)
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    };

    // Foreground FCM messages
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('📬 Foreground FCM message:', remoteMessage);

      const productId = remoteMessage.data?.productId;

      // Show local notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? 'New Notification',
        body: remoteMessage.notification?.body ?? 'Tap to view',
        android: {
          channelId: 'default',
          pressAction: { id: 'default' },
        },
        data: remoteMessage.data,
      });

      // Optional alert UI
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || '',
        [
          {
            text: 'Open',
            onPress: () => {
              if (productId) {
                navigation.navigate('ProductDetails', { productId: String(productId) });
              }
            },
          },
          { text: 'Dismiss', style: 'cancel' },
        ]
      );
    });

    // Handle taps from Notifee notifications
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const productId = detail.notification?.data?.productId;
        if (productId) {
          console.log('👆 Notifee tap → Navigating to ProductDetails:', productId);
          navigation.navigate('ProductDetails', { productId: String(productId) });
        }
      }
    });

    // App opened from background push
    const unsubscribeOnOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      const productId = remoteMessage.data?.productId;
      if (productId) {
        console.log('📦 App opened from background → ProductDetails:', productId);
        navigation.navigate('ProductDetails', { productId: String(productId) });
      }
    });

    // App launched from quit state via push
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const productId = remoteMessage.data?.productId;
          if (productId) {
            console.log('🚀 App launched via FCM → ProductDetails:', productId);
            navigation.navigate('ProductDetails', { productId: String(productId) });
          }
        }
      });

    setupNotifications();

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpenedApp();
      unsubscribeNotifee();
    };
  }, [navigation]);

  return null;
}
