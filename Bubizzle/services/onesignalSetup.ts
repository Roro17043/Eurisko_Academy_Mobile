import {
  OneSignal,
  LogLevel,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
} from 'react-native-onesignal';
import { navigationRef } from '../navigation/navigationRef';
import notifee from '@notifee/react-native';
import { ONESIGNAL_APP_ID } from '@env';


function onForegroundDisplay(event: NotificationWillDisplayEvent) {
  console.log('🔔 Foreground notification:', event);
  event.preventDefault();

  const notif = event.getNotification();

  notifee.displayNotification({
    title: notif.title || 'New Product',
    body: notif.body || 'Tap to see more!',
    android: {
      channelId: 'default',
    },
  });
}

function onNotificationClick(event: NotificationClickEvent) {
  const data = event.notification.additionalData as { productId?: string };
  const productId = data?.productId;
  console.log('📨 Notification clicked, productId:', productId);

  if (productId) {
    navigationRef.current?.navigate('ProductDetails', { productId });
  }
}

export function initializeOneSignal() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(ONESIGNAL_APP_ID);
  OneSignal.Notifications.requestPermission(false);

  OneSignal.User.pushSubscription.getTokenAsync().then(token => {
    console.log('🆔 OneSignal Push Token:', token);
  });

  OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForegroundDisplay);
  OneSignal.Notifications.addEventListener('click', onNotificationClick);
}

export function removeOneSignalListeners() {
  OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForegroundDisplay);
  OneSignal.Notifications.removeEventListener('click', onNotificationClick);
}