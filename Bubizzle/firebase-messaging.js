// firebase-messaging.js
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Handle FCM background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 [FCM Background] Message:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'New Notification',
    body: remoteMessage.notification?.body ?? 'Tap to view',
    android: {
      channelId: 'default',
      pressAction: { id: 'default' },
    },
    data: remoteMessage.data,
  });
});

// Handle background notification tap events
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const productId = detail.notification?.data?.productId;
    console.log('🟢 [Notifee Background Tap] → productId:', productId);

    // Optionally: save productId to a temp store or AsyncStorage
    // Then navigate when app launches (via getInitialNotification)
  }
});
